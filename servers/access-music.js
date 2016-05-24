const storage = require('node-persist');
var db = require('./db');
const fs = require('fs');

storage.initSync({
  dir: `${__dirname}/persist`,
});

module.exports = {
  addTrackToDirectory(directory, track) {},
  getData: db.getData,
  getDirectory(name) {
    return storage.getItem(name);
  },

  saveFile(directory, file) {
    var dir = storage.getItem(directory);
    db.getData(file, (d) => {
      dir.push(d);
      storage.setItem(directory, dir);
    });
  }
}
