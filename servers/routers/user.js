const express = require('express');
const multer  = require('multer');
const User = require('../service/user-service');
const Response = require('../service/response-service');
const USER_RESPONSES = require('../response-metadata/user');

// Storage location
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './servers/files/profiles/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});

var userUpload = multer({ storage: userStorage });

const router = express.Router();

router.get('/profile', function(req, res) {
  const apiKey = req.query['api-key'];
  User.getByApiKey(apiKey)
    .then(user => {
      res.json(user);
    });
  // TODO work on errors;
});

router.post('/profile/update', userUpload.single('file'), function(req, res) {
  const path = req.file.path;
  const email = req.body.email;
  const apiKey = req.body['apiKey'];
  User.set(apiKey, {
    image: path.replace('servers/', ''),
  })
    .then(user => {
      res.json({});
    });
});

router.post('/', function(req, res) {
  let { email, password } = req.body;
  User.login(email, password)
    .then(([isCorrect, user]) => {
      if(isCorrect) {
        res.json(Response.ok({apiKey: user.apiKey}));
      } else {
        res.json(Response._404(USER_RESPONSES.LOGIN_ERROR));
      }
    })
    .catch(err => console.log(err));
});

router.post('/register', function(req, res) {
  //pridobivanje zahteve aplikacije
  let { email, password } = req.body;

  User.userExist(email)
    .then(user => {
      return (user)
        ? res.json(Response._404(USER_RESPONSES.USER_ALREADY_EXSISTS), 404)
        : User.create(User.userDataStructure(email, password))
            .then(db => res.json(Response.ok({ apiKey: db.ops[0].apiKey})));
    })
    .catch(d => console.log('err', d));
});

// app.post('/user', (req, res) => {
//   let {email, password} = req.body;
//   let obj = req.body;
//   DB.dataExist('user', {email, password},
//     (user) => res.json(RS.normal(user)),
//     (user) => res.json(RS.dontExist()));
// });

// app.get('/profile', (req, res) => {
//     //pridobivanje emaila ter passworda iz zahteve
//   let {user, password} = req.query;
//   //preverjanje, če uporabnik obstaja
//   DB.dataExist('user', {email: user},
//     (user) => res.json(user),
//     (user) => res.json(RS.dontExist())
//   );
// });


module.exports = router;
