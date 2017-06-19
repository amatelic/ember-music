const express = require('express');
const bodyParser = require('body-parser');
const User = require('../service/user-service');
const Response = require('../service/response-service');
const USER_RESPONSES = require('../response-metadata/user');

const router = express.Router();

router.get('/profile', function(req, res) {
  res.send('im the home page!');
});

router.post('/', function(req, res) {
  let { email, password } = req.body;
  User.login(email, password)
    .then(([isCorrect, user]) => {
      if(isCorrect) {
        delete user.password;
        res.json(Response.ok(user));
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
      if(user) {
        res.json(Response._404(USER_RESPONSES.USER_ALREADY_EXSISTS), 404);
      } else {
        return User.create(User.userDataStructure(email, password))
                .then(db => {
                  const user = db.ops[0];
                  delete user.password;
                  res.json(Response.ok(user));
                });
      }
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


// app.post('/profile', uploadUser.single('file'),(req, res) => {
//   let {email, username, image} = req.body;
//   DB.update('user', { email }, {$set:{ username, image }});

//   res.json({
//     user: 'Anze Matelic',
//     email: 'amatelic93@gmail.com',
//   });
// });


module.exports = router;
