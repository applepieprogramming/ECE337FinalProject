const express = require("express");
const fs = require("fs");
const MongoClient = require("mongodb");
const MONGO_URL = 'mongodb://localhost:27017/';
const app = express();



app.use(express.static('public'));


var curUserName = ''


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
  var mode = req.body.mode;
  if (mode == 'yourMusic') {
    if (curUserName == '') {
      res.send("Notlogin");
    }
    var data = fs.readFileSync('userMusic.txt', 'utf8');
    var dataByLine = data.split("\n");
    var returnData = []
    dataByLine.forEach(function(line) {
      line = line.split(":");
      if (line[0] == curUserName) {
        returnData.push(line);
      }
    });
    res.send(returnData);
  } else if (mode == 'removeSong') {
    if (curUserName == '') {
      res.send("Notlogin");
    } else {
      var artist = req.body.artist;
      var title = req.body.title;
      var year = req.body.year;
      text = curUserName.toLowerCase() + ":" + artist + ":" + title + ":" + year;
      writeData = []
      var data = fs.readFileSync('userMusic.txt', 'utf8');
      fs.writeFile("userMusic.txt", '', function(err) {
        if (err) {
          //res.send(err.message);
          return console.log(err);
        }
      });
      var dataByLine = data.split("\n");
      dataByLine.forEach(function(line) {
        if (line != text) {
          fs.appendFile("userMusic.txt", line + '\n', function(err) {
            if (err) {
              //res.send(err.message);
              return console.log(err);
            }
          });
        }
      });
    }
  } else if (mode == 'writeMusic')  {
    if (curUserName == '') {
      res.send("Notlogin");
    } else {
      var artist = req.body.artist;
      var title = req.body.title;
      var year = req.body.year;
      text = curUserName.toLowerCase() + ":" + artist + ":" + title + ":" + year;
      var data = fs.readFileSync('userMusic.txt', 'utf8');
      var dataByLine = data.split("\n");
      var isNew = true;
      dataByLine.forEach(function(line) {
        if (line == text) {
          isNew = false;
        }
      });
      if (isNew) {
        fs.appendFile("userMusic.txt", text + '\n', function(err) {
          if (err) {
            //res.send(err.message);
            return console.log(err);
          }
        });
      }
    }
  }
  else{
    var name = req.body.name;
    var password = req.body.password;
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
          curUserName = name;
          res.send("Thank you " + name + " for signing up\n PW: " + password);
        } else {
          res.send("Sorry " + name + ", but that user name already exists, try another one.")
        }
      } else if (mode == 'login') { //-------------------------------------------------login

        var data = fs.readFileSync('users.txt', 'utf8');
        var dataByLine = data.split("\n");

        for (var i = 0; i < dataByLine.length - 1; i++) {

          var tempArray = dataByLine[i].split(":::");
          if (name.toLowerCase() == tempArray[0].toLowerCase()) {

            firstUser = 0; //not the first person with this user name

          }
          if (password == tempArray[1]) {
            pwCheck = 1;
          }
        }

        if (firstUser == 0) {
          if (pwCheck == 1) {
            curUserName = name;
            res.send("Welcome back " + name + "\n PW: " + password);

          } else {
            res.send("Invalid Password");
          }

        } else {
          res.send("Sorry " + name + ", but we dont have your information, perhaps try signing up.")
        }
      }
    }
  }
})


app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");

	// connect to the movies collection in the imdb database
	var db = null;
	var collection = null;


	MongoClient.connect(MONGO_URL, function(err, client) {
      dbo = client.db('SongLib');
      collection = dbo.collection('songs');
      dbo.collection("songs").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
      });
	});
})

// takes a year to search for and a collection to search through as parameters
// logs the liset of all of the movies made in that year or the one
// after that do not have the genre of animation

//async function query(year, title, artist, collection) {
function query(collection) {
    var result = collection.find();
}

app.listen(3000);
