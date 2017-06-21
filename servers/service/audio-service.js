const fs = require('fs');
var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const _  = require('lodash');
const moment = require('moment');
var mm = require('musicmetadata');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

// JSONAPI serializer
const JSONAPI = new JSONAPISerializer('music',{
  pluralizeType: false,
  attributes: ['title', 'artist', 'album', 'path', 'date', 'thumbnail'],
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

  addMusic(apiKey, directory, audio) {
    audio.id = new ObjectID();
    return new Promise(function(resolve, reject)  {
        MongoClient.connect(url, function(err, db) {
          if(err) { return reject(err); }
          db.collection('user')
            .update({
              apiKey,
                'directories.name': directory
            }, {
              $push: {
                'directories.$.music':  audio,
              }
          },(err, res) => {
            db.close();
            return err ? reject(err) : resolve(res);
          });
        });
    });
  }


  extractImage(file) {
    const stream = fs.createReadStream(file);
    return new Promise((resolve, reject)  => {
      mm(stream, (err, metadata) => {
      console.log(err)
      if (err) {
        return reject(err);
      };

      const images = metadata.picture.map(picture => {
        const timestamp = Math.round(+new Date()/1000);
        return {
          path: `files/thumbnail/${timestamp}_${_.toLower(_.replace(metadata.title, / /g, '_'))}.${picture.format}`,
          stream: picture.data
        };
      });

      var wstream = fs.createWriteStream('./servers/' + images[0].path);
      wstream.write(images[0].stream);
      wstream.end(function () {
        stream.close();
        resolve({
          title: metadata.title,
          artist: metadata.artist.join(' '),
          album: metadata.album,
          date: moment().format(),
          thumbnail: images[0].path,
          path: file.replace('servers', '')
        });
      });
      });
    });
  }

  parser(metadata) {
    console.log(1,metadata)
    const picture = this.extractPicture(metadata.title, metadata.picture);
      console.log(2,picture)

    return {
      title: metadata.title,
      artist: metadata.albumartist,
      album: metadata.album,
      date: moment().format(),
      thumbnail: picture[0].path,
      stream: picture[0].stream,
    }
  }

  extractPicture(title, pictures) {
      const timestamp = Math.round(+new Date()/1000);
      return pictures.map(picture => {
        const formatExtension = picture.format;

        return {
          title: title,
          path: `./servers/files/thumbnail/${timestamp}_${_.toLower(_.replace(title, / /g, '_'))}.${formatExtension}`,
          stream: picture.data
        };
      });
  }

}

module.exports = new Audio();
