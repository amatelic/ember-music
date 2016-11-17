const express = require('express');
const bodyParser = require('body-parser');
const multer  = require('multer');
var crypto = require('crypto');
const cors = require('cors');
const DB = require('./dbFacade');
const RS = require('./responses');
const port = 5000;
var JSONAPISerializer = require('jsonapi-serializer').Serializer;
const JSONAPI = new JSONAPISerializer('music',{
  pluralizeType: false,
  attributes: ['title', 'artist', 'album', 'path', 'date'],
});

var app = express();
app.use(cors());

var storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'musics/'),
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      cb(null, file.originalname);
    });
  },
});

var storage2 = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'users/'),
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      cb(null, file.originalname);
    });
  },
});

var upload = multer({ storage: storage });
var uploadUser = multer({ storage: storage2});
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.json({test: 1})
});

app.delete('/music/:id', (req, res) => {
    res.json({}, 204);
});

app.post('/user', (req, res) => {
  let {email, password} = req.body;
  let obj = req.body;
  DB.dataExist('user', {email},
    (user) => res.json(RS.normal(user)),
    (user) => res.json(RS.dontExist()));
});

//pridobivanje podatkov uporabnika iz podatkovne baze ob GET
//zahtevi na url http://localhost:5000/profile
app.get('/profile', (req, res) => {
    //pridobivanje emaila ter passworda iz zahteve
  let {user, password} = req.query;
  //preverjanje, če uporabnik obstaja
  DB.dataExist('user', {email: user},
    (user) => res.json(user),
    (user) => res.json(RS.dontExist())
  );
});


app.post('/profile', uploadUser.single('file'),(req, res) => {
  let {email, username, image} = req.body;
  DB.update('user', { email}, {$set:{ username, image }});

  res.json({
    user: 'Anze Matelic',
    email: 'amatelic93@gmail.com',
  });
});

//registriranje novega vtičnika ki posluša POST
//zahtevo na url http://localhost:5000/register
app.post('/register', (req, res) => {
  //pridobivanje zahteve aplikacije
  let {email, password} = req.body;
  //preverjanje ali uporabnik obstaja
  DB.dataExist('user', {email},
    //Če uporabnik obstaja se  izvede ta metoda,
    //ki vrne odgovor uporabnik obstaja.
    (data) => {res.json(RS.exist())},
    //V primeru, da uporabnik ne obstaja
    //potem se izvede ta metoda, ki najprej uporabnika
    //shrane, ter pošlje odgovor, da je vse vredu.
    (data) => {
      DB.insert('user', createUser(req.body),
      (err, result) => { res.json(RS.normal({email})); });
    });
});

// Vtičnik za pridobivanje seznamov skladb in izbranega seznama
app.get('/music', (req, res) => {
  //pridobivanje uporabniških podatkov
  let email =  req.headers['api-key'];
  var path =  req.query.params || 'all';
  //Pridobivanje podatkov uporabnika iz mongdodb baze
  DB.first('user', {email}, user => {
    //pridobivanje vseh seznamov predvajanj povezani z uporabnikom
    let allDirectories = user.directories.map(d => d.name);
    //pridobivanje vseh skladb pozevani z izbranem seznamom
    let data = user.directories.filter(d => d.name === path);
    //vračanje podatkov nazaj v json obliki
    res.json(Object.assign({
      meta: {
        directory: path,
        allDirectories: allDirectories,
      },
    }, JSONAPI.serialize(data[0].music)));
  });
});

// Vtičnik za dodajanje novih skladb
app.post('/upload', upload.single('file'), (req, res) => {
  //Pridobivanje podatkov seznama za shranjevanje podatkov
  //ter informacije o uporabniku
  let {directory, id} = req.body;
  let email = req.headers['api-key'];
  let trackName = req.file.filename;
  //Metoda za pridobivanje meta podatkov o skladbi
  DB.getMusic(trackName, id, (data) => {
    //Shranjevanje nove skladbe v izbrani
    //seznam predvajanj
    DB.update('user', {
      email,
      'directories.name': `${directory}`
    },{
      $push: {
        'directories.$.music':  data,
    }});
    //vračanje podatkov v json obliki
    res.json(JSONAPI.serialize(data));
  });
});

app.post('/new_folder', (req, res) => {
  let directory = req.body.name;
  let email =  req.headers['api-key'];
  DB.update('user', {email}, {$push: {
    'directories': {
      name: directory,
      music: [],
    }
  }}, {multi: false});
  res.json({status: 200, dir: req.body.name});
});

app.use('/musics', express.static(__dirname + '/musics'));
app.use('/users', express.static(__dirname + '/users'));
app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});

function createUser(data) {
  data.image = 'https://myspace.com/common/images/user.png';
  data.username = '';
  data.directories = [];
  return data;
}
//end mongoDB
