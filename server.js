const express = require("express");
const path = require("path");
const fs = require("fs");
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/get-profile', function (req, res) {
  const response = res;

  MongoClient.connect('mongodb://admin:password@localhost:27017', function (err, client) { // senha visivel pois é apenas uma demonstração!
    if (err) throw err;

    const db = client.db('user-account');
    const query = {userid: 1};
    db.collection('users').findOne(query, function (err, result) {
      if (err) throw err;
      client.close();
      response.send(result);
    })
  })
});

app.post('/update-profile', function (req, res) {
  const userObj = req.body;
  const response = res;

  console.log('connevting to the db')

  MongoClient.connect('mongodb://admin:password@localhost:27017', function (err, client) {
    if (err) throw err;

    const db = client.db('user-account');
    userObj['userid'] = 1
    const query = {userid: 1};
    const newValues = {$set: userObj};

    console.log('successfully connected to the user-account db');

    db.collection('users').updateOne(query, newValues, {upsert: true}, function (err, res) {
      if (err) throw err;
      console.log('successfully update or inserted');
      client.close();
      response.send(userObj);
    })
  })
})

app.get('/profile-picture', function (req, res) {
  const img = fs.readFileSync('images.png');
  res.writeHead(200, {'content-type': 'image/png'});
  res.end(img, 'binary');
});



app.listen(3000, function () {
  console.log('app listening on port 3000!')
})