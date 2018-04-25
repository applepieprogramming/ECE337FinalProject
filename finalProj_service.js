const express = require("express");
const fs = require("fs");
const app = express();

const MongoClient = require("mongodb");
const MONGO_URL = 'mongodb://localhost:27017/';

app.use(express.static('public'));

//database shiz
var db = null;
var collection = null;
MongoClient.connect(MONGO_URL, function(err, client) {
  db = client.db('SongLib');
  collection = db.collection('songs');
});

// so that we can run on the localhost without errors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// allows us to access prameters easily
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

app.post('/', jsonParser, function(req, res) {
  var name = req.body.name;
  var password = req.body.password;
  var mode = req.body.mode;
  var firstUser = 1;
  var pwCheck = 0;
  if (name == '' || password == '') {
    res.send("Blank username of password try again");
  } else {
    if (mode == 'signUp') { //-----------------------------------------sign up
      var data = fs.readFileSync('users.txt', 'utf8');
      var dataByLine = data.split("\n");
      for (var i = 0; i < dataByLine.length - 1; i++) {
        var tempArray = dataByLine[i].split(":::");
        //console.log("User Input" + name.toLowerCase() + "File data: "+ tempArray[0].toLowerCase());
        if (name.toLowerCase() == tempArray[0].toLowerCase()) {
          firstUser = 0; //not the first person with this user name
        }
      }
      if (firstUser) {
        fs.appendFile("users.txt", name.toLowerCase() + ':::' + password + '\n', function(err) {
          if (err) {
            //res.send(err.message);
            return console.log(err);
          }
        });
        res.send("Thank you " + name + " for signing up\n PW: " + password);
      } else {
        res.send("Sorry " + name + ", but that user name already exists, try another one.")
      }
    } else if (mode == 'login') { //-------------------------------------------------login

      var data = fs.readFileSync('users.txt', 'utf8');
      //console.log(data);
      var dataByLine = data.split("\n");

      for (var i = 0; i < dataByLine.length - 1; i++) {

        var tempArray = dataByLine[i].split(":::");
        //console.log("User Input" + name.toLowerCase() + "File data: "+ tempArray[0].toLowerCase());
        if (name.toLowerCase() == tempArray[0].toLowerCase()) {

          firstUser = 0; //not the first person with this user name

        }
        if (password == tempArray[1]) {

          pwCheck = 1;

        }
      }

      if (firstUser == 0) {
        if (pwCheck == 1) {
          res.send("Welcome back " + name + "\n PW: " + password);
        } else {
          res.send("Invalid Password");
        }

      } else {
        res.send("Sorry " + name + ", but we dont have your information, perhaps try signing up.")
      }
    }
  }
})


console.log('web service started');


app.get('/', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");

  res.send("work in progress");

})

app.listen(3000);
