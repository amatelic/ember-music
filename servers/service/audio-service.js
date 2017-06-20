const fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var JSONAPISerializer = require('jsonapi-serializer').Serializer;

// JSONAPI serializer
const JSONAPI = new JSONAPISerializer('music',{
  pluralizeType: false,
  attributes: ['title', 'artist', 'album', 'path', 'date'],
});

class Audio {
  constructor() {}


  directorys(directories, selected) {
    let selectedDirectory = directories.filter(d => d.name === selected);

    return Object.assign({
      meta: {
        directory: selected,
        allDirectories: directories.map(d => d.name),
      },
    }, JSONAPI.serialize(selectedDirectory[0].music));
  }

}

module.exports = new Audio();
