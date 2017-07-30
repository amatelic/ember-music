const express = require('express');
const User = require('../service/user-service');
const Response = require('../service/response-service');
const USER_RESPONSES = require('../response-metadata/user');

const router = express.Router();

router.get('/profile', function(req, res) {
  const apiKey = req.query['api-key'];
  User.getByApiKey(apiKey)
    .then(user => {
      res.json(user);
    });
  // TODO work on errors;
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
  //preverjanje ali uporabnik obstaja
  // DB.dataExist('user', {email, password},
    //Če uporabnik obstaja se  izvede ta metoda,
    //ki vrne odgovor uporabnik obstaja.
    // (data) => res.json(RS.exist()),
    //V primeru, da uporabnik ne obstaja
    //potem se izvede ta metoda, ki najprej uporabnika
    //shrane, ter pošlje odgovor, da je vse vredu.
    // (data) => {
    //   DB.insert('user', createUser(req.body),
    //   (err, result) => { res.json(RS.normal({email})); });
    // });
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
