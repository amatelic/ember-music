const storage = require('node-persist');
var db = require('./db');
const fs = require('fs');

storage.initSync({
  dir: `${__dirname}/persist`,
});
storage.setItem('all', db.start());
console.log(storage.getItem('book'));

module.exports = {
  addTrackToDirectory(directory, track) {

  },
  getData: db.getData,
  getDirectory(name) {
    return storage.getItem(name);
  },
}
