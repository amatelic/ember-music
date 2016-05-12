const express = require('express');
const fs = require('fs');
const cors = require('cors');
const port = 5000;
var app = express();
app.use(cors());

const directory = fs.readdirSync(__dirname + '/music');
const data = directory.map((path, i) => {
  return {
    type: 'music',
    id: i,
    attributes: {
      name: i,
      artist: 'Kohin bla',
      album: 'Code Geass',
      path: `http://localhost:5000/music/${path}`,
      date: new Date(),
    },
  };
});

app.get('/', (req, res) => {
  res.send('test');
});

app.get('/music', (req, res) => {
  res.json({
    "data": data,
  });
});

app.use('/music', express.static(__dirname + '/music'));
app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
