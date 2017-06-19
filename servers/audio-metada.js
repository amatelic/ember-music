//uvažanje modula audio-metadata
const audioMetaData = require('audio-metadata');
const fs = require('fs');
const _  = require('lodash');
//nodejs modul za delo z datotečnim sistemom
var mm = require('musicmetadata');
// create a new parser from a node ReadStream
var parser = mm(fs.createReadStream('./musics/test.mp3'), function (err, metadata) {
  if (err) throw err;


  const picture = metadata.picture;
  const name = _.toLower(_.replace(metadata.title, / /g, '_'));

  const format = picture[0].format;
  const stream = picture[0].data;

  console.log(`${name}.${format}`);
  const timestamp = Math.round(+new Date()/1000);
  var wstream = fs.createWriteStream(`${timestamp}_${name}.${format}`);
  wstream.write(stream);
  wstream.end(function () { console.log('done'); });
});

//Pridobivanje skladbe s pomočjo fs modula na sinhroni način
// var oggData = fs.readFileSync('/path/to/audio.ogg');
//Pridobivanje metapodatkov iz skladbe
// var metadata = audioMetaData.ogg(oggData);
// console.log(metadata)
/*
  Podatki v metadata spremenljivki.
{
  "title": "Contra Base Snippet",
  "artist": "Konami",
  "album": "Bill and Lance's Excellent Adventure",
  "year": "1988",
  "tracknumber": "1",
  "track": "1",
  "encoder": "Lavf53.21.1"
}
*/
