const express = require('express');
const audioMetaData = require('audio-metadata');
const bodyParser = require('body-parser');
var mime = require('mime');
const multer  = require('multer');
var crypto = require('crypto');
const fs = require('fs');
const cors = require('cors');
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

const directory = fs.readdirSync(__dirname + '/musics');
const data = directory.map((path, i) => {
  var oggData = fs.readFileSync(`${__dirname}/musics/${path}`);
  var metadata = audioMetaData.id3v2(oggData);
  var data = fs.lstatSync(`${__dirname}/musics/${path}`);
  return {
    type: 'music',
    id: i,
    attributes: {
      name: metadata.title,
      artist: metadata.artist,
      album: 'Code Geass',
      path: `http://localhost:5000/musics/${path}`,
      date: data.ctime,
    },
  };
});

app.get('/', (req, res) => {
  res.send('test');
});

app.get('/music', (req, res) => {
  res.json({
    data: data,
  });
});
app.post('/upload', upload.single('test'), (req, res) => {
  console.log(req.files)
});

app.use('/musics', express.static(__dirname + '/musics'));
app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
