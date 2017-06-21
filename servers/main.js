const express = require('express');
const bodyParser = require('body-parser');
const multer  = require('multer');
var crypto = require('crypto');
const cors = require('cors');
const user = require('./routers/user');
const music = require('./routers/music');

var app = express();

// Express configuration
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

// Express routers
app.use('/user', user);
app.use('/music', music);

// var storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'musics/'),
//   filename: function(req, file, cb) {
//     crypto.pseudoRandomBytes(16, function(err, raw) {
//       cb(null, file.originalname);
//     });
//   },
// });

// var storage2 = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'users/'),
//   filename: function(req, file, cb) {
//     crypto.pseudoRandomBytes(16, function(err, raw) {
//       cb(null, file.originalname);
//     });
//   },
// });

// var upload = multer({ storage: storage });
// var uploadUser = multer({ storage: storage2});

app.get('/', (req, res) => {
    res.json({message: 'Music app server is running'});
});

app.delete('/music/:id', (req, res) => {
    res.json({}, 204);
});


//pridobivanje podatkov uporabnika iz podatkovne baze ob GET
//zahtevi na url http://localhost:5000/profile

app.use('/files', express.static(__dirname + '/files'));
app.use('/users', express.static(__dirname + '/users'));

console.log(`Server enviroment: ${process.env.NODE_ENV}`);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
