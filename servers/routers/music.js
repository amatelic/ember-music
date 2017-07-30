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
  attributes: ['title', 'artist', 'album', 'path', 'date', 'thumbnail'],
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
  const apiKey = req.headers['api-key'];
  const directory = req.body.directory;
  Audio.extractImage(req.file.path)
    .then(audio => Audio.addMusic(apiKey, directory, audio))
    .then(audio => {
      res.json(JSONAPI.serialize(audio));
    })
    .catch(err => {
      console.log(err);
    });
});

router.post('/new_folder', (req, res) => {
  let folder = req.body.name;
  const apiKey =  req.headers['api-key'];

  User.addFolder(apiKey, folder)
    .then(_ => {
      res.json({status: 200, dir: folder});
    })
    .catch(_ => {
      res.json({status: 404, message: 'There was an error'});
    });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const apiKey = req.headers['api-key'];
  Audio.deleteMusic(apiKey, id)
    .then(_ => {
      res.status(204).end();
    });
});

module.exports = router;
