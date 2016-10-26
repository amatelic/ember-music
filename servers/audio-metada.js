//uvažanje modula audio-metadata
const audioMetaData = require('audio-metadata');
//nodejs modul za delo z datotečnim sistemom
const fs = require('fs');

//Pridobivanje skladbe s pomočjo fs modula na sinhroni način
var oggData = fs.readFileSync('/path/to/audio.ogg');
//Pridobivanje metapodatkov iz skladbe
var metadata = audioMetaData.ogg(oggData);
console.log(metadata)
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
