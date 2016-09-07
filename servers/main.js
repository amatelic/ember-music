const express = require('express');
const bodyParser = require('body-parser');
var accessMusic = require('./access-music');
var mime = require('mime');
const multer  = require('multer');
var crypto = require('crypto');
const fs = require('fs');
const cors = require('cors');
const mkdirp = require('mkdirp');
const DB = require('./dbFacade');
const RS = require('./responses');
const port = 5000;
const moment = require('moment');
var app = express();
app.use(cors());




  var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'musics/');
    },

    filename: function(req, file, cb) {
      crypto.pseudoRandomBytes(16, function(err, raw) {
        cb(null, file.originalname);
      });
    },
  });

  var upload = multer({ storage: storage });
  app.use(bodyParser.urlencoded({extended: true}));

  app.get('/', (req, res) => {
      res.json({test: 1})
  });

  app.post('/user', (req, res) => {
    let {email, password} = req.body;
    let obj = req.body;
    DB.dataExist('user', {email},
      (user) => res.json(RS.normal(obj)),
      (user) => res.json(RS.dontExist()));
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
      let musicResponse = data[0].music.map((d, i) => {
        return {
          id: i,
          type: 'music',
          attributes: d,
        };
      });
      // console.log(musicResponse)
      res.json({
        meta: {
          directory: path,
          allDirectories: allDirectories,
        },
        data: musicResponse,
      });
    });
  });

  app.post('/upload', upload.single('file'), (req, res) => {
    let {directory} = req.body;
    let email = req.headers['api-key'];
    let trackName = req.file.filename;
    DB.getMusic(trackName, (data) => {
      DB.update('user', {
        email,
        'directories.name': `${directory}`
      },{
        $push: {
          'directories.$.music':  data,
        }});
        console.log(1111)
        DB.first('user', {email}, user => {
          let a = user.directories.filter(d => d.name === directory);
          let length = a[0].music.length;
          console.log(legnth, a)
          res.json({data: {
            type: 'music',
            id: lenght,
            attributes: data,
          }});
        });
    });

    // accessMusic.getData(req.file.filename, (file) => res.json({data: file}));
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
    // accessMusic.createDirectory(req.body.name);
    res.json({status: 200, dir: req.body.name});
  });

  app.use('/musics', express.static(__dirname + '/musics'));
  app.listen(port, () => {
    console.log(`Listen on port ${port}`);
  });

  function createUser(data) {
    data.directories = [];
    return data;
  }
  //end mongoDB
