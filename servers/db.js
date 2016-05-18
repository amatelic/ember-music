const audioMetaData = require('audio-metadata');
const fs = require('fs');
const directory = fs.readdirSync(__dirname + '/musics');
let directoryLength = directory.length;

function start() {
  console.log('loading files');
  return directory.map((path, i) => {
    var oggData = fs.readFileSync(`${__dirname}/musics/${path}`);
    return setConfig(oggData, path, i);
  });

}

function getFile(track, callback) {
  let path = `${__dirname}/musics`;
  directoryLength++;
  fs.readFile(`${path}/${track}`, (err, file) => {
    let trackInfo = setConfig(file, track, directoryLength);
    callback(trackInfo);
  });
}

function setConfig(mp3File, path, i) {
  var metadata = audioMetaData.id3v2(mp3File);
  // console.log(metadata, path)
  return {
    type: 'music',
    id: i,
    attributes: {
      name: metadata.title,
      artist: metadata.artist,
      album: 'Code Geass',
      path: `http://localhost:5000/musics/${path}`,
      date: "2016-05-10T19:54:06.000Z",
    },
  };
}

module.exports = {
  start,
  getData: getFile,
};
