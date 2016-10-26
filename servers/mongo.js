//Uvažanje mongodb modula
const MongoClient = require('mongodb').MongoClient;
//Vrata na katerih se mongodb izvaja
const url = 'mongodb://localhost:27017';
//Povezava na mongodb bazo
MongoClient.connect(url, function(err, db) {
  //Preverjanje ali je prišlo do napake.
  if (err) {
    return new Error('There was an error');
  }
  // Pridobivanje mongodb seznama
  const user = db.collection('user')

  //Zapiranje mongodb baze
  db.close();
});
