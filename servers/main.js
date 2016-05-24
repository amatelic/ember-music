const express = require('express');
const bodyParser = require('body-parser');
var accessMusic = require('./access-music');
var mime = require('mime');
const multer  = require('multer');
var crypto = require('crypto');
const fs = require('fs');
const cors = require('cors');
const mkdirp = require('mkdirp');
const port = 5000;
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
  res.send('test');
});

app.get('/music', (req, res) => {

  var path =  req.query.params || 'all';
  res.json({
    meta: {
      directory: path,
      allDirectories: accessMusic.getDirectories(),
    },
    data: accessMusic.getDirectory(path),
  });

});

app.post('/upload', upload.single('file'), (req, res) => {
  let {directory} = req.body;
  accessMusic.saveFile(directory, req.file.filename);
  accessMusic.getData(req.file.filename, (file) => res.json({data: file}));
});

app.post('/new_folder', (req, res) => {
  accessMusic.createDirectory(req.body.name);
  res.json({status: 200, dir: req.body.name});
});

app.use('/musics', express.static(__dirname + '/musics'));
app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
