//uvažanje express modula
const express = require('express');
//inicializacija strežnika
const app = express();

//Strežnik kateri posluša na url http://localhost:5000
app.get('/', function(request, response) {
  //odogovor strežnika
  response.send('Express api');
});

//Nastavitev vrat za strežnik
app.listen(5000);
