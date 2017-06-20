const express = require('express');
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


var router = express.Router();

router.get('/', function(req, res) {
  let apiKey =  req.headers['api-key'];
  let selected =  req.query.params || 'all';
  User.getByApiKey(apiKey)
    .then(user => {
      res.json(Audio.directorys(user.directories, selected));
    });
  //Pridobivanje podatkov uporabnika iz mongdodb baze
  // DB.first('user', {email}, user => {
    //pridobivanje vseh seznamov predvajanj povezani z uporabnikom
    // let allDirectories = user.directories.map(d => d.name);
    //pridobivanje vseh skladb pozevani z izbranem seznamom
    // let data = user.directories.filter(d => d.name === path);
    //vračanje podatkov nazaj v json obliki
    // res.json(Object.assign({
    //   meta: {
    //     directory: path,
    //     allDirectories: allDirectories,
    //   },
    // }, JSONAPI.serialize(data[0].music)));
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
