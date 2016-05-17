const audioMetaData = require('audio-metadata');
const fs = require('fs');

function start() {
  const directory = fs.readdirSync(__dirname + '/musics');

  return directory.map((path, i) => {
    var oggData = fs.readFileSync(`${__dirname}/musics/${path}`);
    return setConfig(oggData, path, i);
  });

}

function setConfig(mp3File, path, i) {
  var metadata = audioMetaData.id3v2(mp3File);
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
};
