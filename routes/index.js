var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

/* GET home page. */
router.post('/', function(req, response, next) {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb+srv://@marketinc.qu9xr.mongodb.net/";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("login");
  dbo.collection("client").find({}, { projection: { username: req.body.username,password: req.body.password } }).toArray(function(err, result) {
    console.log(result) 
    bcrypt.compare(req.body.password, result[0].password, function(err, res) {
      if(err)
      {
      console.log(err);
      }
      if(!res)
      {
      console.log("invalid password")
      response.status(200).end()
      }
      else
      {
      response.status(200).end();
      }
    });
  });
  });

});

module.exports = router;
