const fs = require('fs');
const moment = require('moment');
const apikey = require('apikeygen').apikey;
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

class User {
  constructor() {}

  login(email, password) {
    return this.userExist(email)
            .then(user => [(user && bcrypt.compareSync(password, user.password)), user]);
  }

  getByApiKey(apiKey) {
    return new Promise(function(resolve, reject)  {
      MongoClient.connect(url, function(err, db) {
        if(err) { return reject(err); }
          var database = db.collection('user');
          database.findOne({ apiKey }).then(resolve);
          db.close();
      });
    });
  }

  create(user) {
    return new Promise(function(resolve, reject)  {
        MongoClient.connect(url, function(err, db) {
          if(err) { return reject(err); }
          db.collection('user').insert(user, function(err, result) {
            db.close();
            return (err) ? reject(err) : resolve(result);
          });
        });
    });
  }

  update(apiKey, update) {
    return new Promise(function(resolve, reject)  {
      MongoClient.connect(url, function(err, db) {
        if(err) { return reject(err); }
        return db.collection('user')
          .update({apiKey}, update, {multi: false}, (err, result) => {
          db.close();
          return (err) ? reject(err) : resolve(result);
        });
      });
    });
  }

  addFolder(apiKey, folder) {
    return this.update(apikey, {
        $push: {
         'directories': {
          name: folder,
          music: [],
        }
      }});
  }

  // createFolder(folder) {
  //   return (user) => {
  //     return user.update({
  //       $push: {
  //        'directories': {
  //         name: folder,
  //         music: [],
  //       }
  //     }}, {multi: false});
  //   }
  // }
  // router.post('/new_folder', (req, res) => {
  //   let directory = req.body.name;
  //   const apiKey =  req.headers['api-key'];

  //   User.addFolder(apiKey, dire)
  //   DB.update('user', {email}, {$push: {
  //     'directories': {
  //       name: directory,
  //       music: [],
  //     }
  //   }}, {multi: false});
  //   res.json({status: 200, dir: req.body.name});
  // });

  userDataStructure(email, password) {
    return {
      email: email,
      password: bcrypt.hashSync(password, salt),
      image: 'files/thumbnail/default_profile.png',
      directories: [{name: "all", music: []}],
      apiKey: apikey()
    };
  }

  userExist(email) {
    return new Promise(function(resolve, reject)  {
        MongoClient.connect(url, function(err, db) {
          if(err) { return reject(err); }
          var database = db.collection('user');
          database.findOne({ email }).then(resolve);
          db.close();
        });
    });
  }
}

module.exports = new User();
