const fs = require('fs');
const moment = require('moment');
const audioMetaData = require('audio-metadata');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  var users = db.collection('user');
  db.close();
});

function insert(table, obj, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    var database = db.collection(table);
    database.insert(obj, function(err, result) {
      callback(err, result);
      db.close();
    });
  });
}

function first(table, obj, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server ");
    console.log("Start getting collection data");
    var database = db.collection(table);
    let userResolve = database.findOne(obj);
    userResolve.then((data)=> {
      console.log(data);
      return data;
    }).then(callback);
    db.close();
  });
}

function update(table, obj, updateObj, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    var database = db.collection(table);
    database.update(obj, updateObj, callback);
    db.close();
  });
}

function dataExist(table, obj, call1, call2){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    var database = db.collection(table);
    let userResolve = database.findOne(obj);
    userResolve.then(function(data) {
      if (data) {
        call1(data);
      } else {
        call2(data);
      }
    });
    db.close();
  });
}

function getMusic(track, id, callback) {
  let path = `${__dirname}/musics`;
  fs.readFile(`${path}/${track}`, (err, file) => {
    var metadata = audioMetaData.id3v2(file);

    var obj = {
      id: id,
      title: metadata.title  || 'undefined',
      artist: metadata.artist || 'undefined',
      album: metadata.album || 'undefined',
      path: 'http://localhost:5000/musics/' + track,
      date: moment().toISOString(),
    };
    callback(obj);
  })
}

// let trackInfo = setConfig(file, track, directoryLength);
// callback(trackInfo);
module.exports = {
  insert,
  first,
  dataExist,
  update,
  getMusic,
};
