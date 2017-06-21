const express = require('express');
const multer  = require('multer');
var crypto = require('crypto');
const bodyParser = require('body-parser');
const Audio = require('../service/audio-service');
const User = require('../service/user-service');
const Response = require('../service/user-service');
var JSONAPISerializer = require('jsonapi-serializer').Serializer;

// JSONAPI serializer
const JSONAPI = new JSONAPISerializer('music',{
  pluralizeType: false,
  attributes: ['title', 'artist', 'album', 'path', 'date'],
});

// Storage location
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './servers/files/audio/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
    // crypto.randomBytes(16, function(err, raw) {
    //   cb(null, file.originalname);
    // });
  },
});
// multer({ dest: 'uploads/' })
var audioUpload = multer({ storage: audioStorage });


var router = express.Router();

router.get('/', function(req, res) {
  let apiKey =  req.headers['api-key'];
  let selected =  req.query.params || 'all';
  User.getByApiKey(apiKey)
    .then(user => {
      res.json(Audio.directorys(user.directories, selected));
    });
});


router.post('/upload', audioUpload.single('file'), (req, res) => {
  console.log(req.headers['api-key']);
  const apiKey = req.headers['api-key'];
  const directory = req.body.directory;
  Audio.extractImage(req.file.path)
    .then(audio => {
      Audio.addMusic(apiKey, directory, audio);
      res.json(JSONAPI.serialize([]));
    })
    .catch(err => {
      console.log(err)
    })
  //Pridobivanje podatkov seznama za shranjevanje podatkov
  //ter informacije o uporabniku
  // let {directory, id} = req.body;
  // let email = req.headers['api-key'];
  // let trackName = req.file.filename;
  // //Metoda za pridobivanje meta podatkov o skladbi
  // DB.getMusic(trackName, id, (data) => {
  //   //Shranjevanje nove skladbe v izbrani
  //   //seznam predvajanj
  //   DB.update('user', {
  //     email,
  //     'directories.name': `${directory}`
  //   },{
  //     $push: {
  //       'directories.$.music':  data,
  //   }});
  //   //vračanje podatkov v json obliki
  //   res.json(JSONAPI.serialize(data));
  // });
});

// router.post('/new_folder', (req, res) => {
//   let directory = req.body.name;
//   let email =  req.headers['api-key'];
//   DB.update('user', {email}, {$push: {
//     'directories': {
//       name: directory,
//       music: [],
//     }
//   }}, {multi: false});
//   res.json({status: 200, dir: req.body.name});
// });


// Vtičnik za pridobivanje seznamov skladb in izbranega seznama
// router.get('/music', (req, res) => {
//   //pridobivanje uporabniških podatkov
  // let email =  req.headers['api-key'];
  // let path =  req.query.params || 'all';
  //Pridobivanje podatkov uporabnika iz mongdodb baze
  // DB.first('user', {email}, user => {
    //pridobivanje vseh seznamov predvajanj povezani z uporabnikom
    // let allDirectories = user.directories.map(d => d.name);
    //pridobivanje vseh skladb pozevani z izbranem seznamom
    // let data = user.directories.filter(d => d.name === path);
    //vračanje podatkov nazaj v json obliki
  //   res.json(Object.assign({
  //     meta: {
  //       directory: path,
  //       allDirectories: allDirectories,
  //     },
  //   }, JSONAPI.serialize(data[0].music)));
  // });
// });

// Vtičnik za dodajanje novih skladb
// app.post('/upload', upload.single('file'), (req, res) => {
//   //Pridobivanje podatkov seznama za shranjevanje podatkov
//   //ter informacije o uporabniku
//   let {directory, id} = req.body;
//   let email = req.headers['api-key'];
//   let trackName = req.file.filename;
//   //Metoda za pridobivanje meta podatkov o skladbi
//   DB.getMusic(trackName, id, (data) => {
//     //Shranjevanje nove skladbe v izbrani
//     //seznam predvajanj
//     DB.update('user', {
//       email,
//       'directories.name': `${directory}`
//     },{
//       $push: {
//         'directories.$.music':  data,
//     }});
//     //vračanje podatkov v json obliki
//     res.json(JSONAPI.serialize(data));
//   });
// });


module.exports = router;
