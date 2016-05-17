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

  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      console.log(file.originalname)
      cb(null, file.originalname);
    });
  }
});
var upload = multer({ storage: storage });
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {
  res.send('test');
});

app.get('/music', (req, res) => {
  res.json({
    data: accessMusic.getDirectory('all'),
  });
});
app.post('/upload', upload.single('test'), (req, res) => {
  console.log(req.files)
});

app.post('/new_folder', (req, res) => {
  // mkdirp(`${__dirname}/dir/${req.body.name}`);
});

app.use('/musics', express.static(__dirname + '/musics'));
app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
