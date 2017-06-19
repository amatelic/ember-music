const audioMetaData = require('audio-metadata');
const fs = require('fs');
const _  = require('lodash');
var mm = require('musicmetadata');

function getAudioMetaData(filePath) {
  mm(fs.createReadStream(filePath), function (err, meta) {
    if (err) {
      throw err;
    }

    const metadata = parseMetaData(meta);
    var wstream = fs.createWriteStream(`${timestamp}_${name}.${format}`);
    wstream.write(picture[0].data);
    wstream.end(function () { console.log('done'); });

    return meta
  });
}

function parseMetaData(metadata) {
  const picture = metadata.picture;
  const format = picture[0].format;

  return {
    name: _.toLower(_.replace(meta.title, / /g, '_')),
    img: `${timestamp()}_${name}.${format}`,
  }
}

function timestamp() {
  return Math.round(+new Date()/1000);
}


module.exports = {
  getAudioMetaData
};
