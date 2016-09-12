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
    (user) => res.json(RS.normal(obj)),
    (user) => res.json(RS.dontExist()));
});

app.get('/profile', (req, res) => {
  let email = req.query.user;
  DB.dataExist('user', {email}, (d) => {
    res.json(d);
  });
});


app.post('/profile', uploadUser.single('file'),(req, res) => {
  let {email, username, image} = req.body;
  DB.update('user', { email}, {$set:{ username, image }});

  res.json({
    user: 'Anze Matelic',
    email: 'amatelic93@gmail.com',
  });
});

app.post('/register', (req, res) => {
  let {email, password} = req.body;
  DB.dataExist('user', {email},
    (data) => {res.json(RS.exist())},
    (data) => {
      DB.insert('user', createUser(req.body),
      (err, result) => { res.json(RS.normal({email})); });
    });
});

app.get('/music', (req, res) => {
  let email =  req.headers['api-key'];
  var path =  req.query.params || 'all';
  DB.first('user', {email}, user => {
    let allDirectories = user.directories.map(d => d.name);
    let data = user.directories.filter(d => d.name === path);

    res.json(Object.assign({
      meta: {
        directory: path,
        allDirectories: allDirectories,
      },
    }, JSONAPI.serialize(data[0].music)));
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  let {directory, id} = req.body;
  let email = req.headers['api-key'];
  let trackName = req.file.filename;
  DB.getMusic(trackName, id, (data) => {
    DB.update('user', {
      email,
      'directories.name': `${directory}`
    },{
      $push: {
        'directories.$.music':  data,
    }});
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
