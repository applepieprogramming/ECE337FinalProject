// Corey Miner and Brock Berube
// CSC 337, Spring 2018
// Final Project

//this is the js file for the music and index webpages
//it populates music libraries and has functionality to change
//search parameters and filter music library based on params

(function() {
  "use strict";

  window.onload = function() { //initial function to handle when the user clicks on either buttons
    console.log(document.title);
    if (document.title == 'Login') {
      var signUpButton = document.getElementById("signUpButton");
      var loginButton = document.getElementById("loginButton");
      signUpButton.onclick = signUp;
      loginButton.onclick = login;
    } else {
      var homeButton = document.getElementById("home");
      homeButton.onclick = home;
      var searchButton = document.getElementById("searchButton");
      searchButton.onclick = populateMusicList;
      populateMusicList();
      populateYourMusic();
    }
  };

  function home() {
    window.location.href = './index.html';
  }

  function signUp() { //send sign up post request
    var name = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    var user = {};
    user["name"] = name;
    user["password"] = password;
    user['mode'] = 'signUp';
    var fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    };
    var url = "http://localhost:3000";
    fetch(url, fetchOptions)
      .then(checkStatus)
      .then(function(responseText) {
        document.getElementById("debug").innerHTML = responseText;
        //if user doesnt exist redirect to other service
        if (responseText[0] == 'T') {
          loadService();
        } else {
          //else stay here
        }
      })
      .catch(function(error) {
        console.log(error);
        document.getElementById("debug").innerHTML = error;
      });
  }

  function login() { //send login post request
    var name = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    var user = {};
    user["name"] = name;
    user["password"] = password;
    user['mode'] = 'login';
    var fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    };
    var url = "http://localhost:3000";
    fetch(url, fetchOptions)
      .then(checkStatus)
      .then(function(responseText) {
        document.getElementById("debug").innerHTML = responseText;

        //if user doesnt exist redirect to other service
        if (responseText[0] == 'W') {
          loadService();
        } else {
          //else stay here
        }
      })
      .catch(function(error) {
        console.log(error);
        document.getElementById("debug").innerHTML = error;
      });
  }

  function loadService() {
    window.location.href = './music.html';
  }

  function populateMusicList() { //takes returned json object and populates music list
    var url1 = 'http://localhost:3000/'; //"http://localhost:3000/";
    fetch(url1)
      .then(checkStatus)
      .then(function(responseText) {
        var json = JSON.parse(responseText);
        addDataToAllMusic(json);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function addDataToAllMusic(responseText) {
    var titleInput = document.getElementById("titleInput").value;
    var artistInput = document.getElementById("artistInput").value;
    var yearInput = document.getElementById("yearInput").value;

    document.getElementById("allSongs").innerHTML = '';
    for (var i = 0; i < responseText.length; i++) {
      var newBlock = document.createElement('div');
      newBlock.artist = responseText[i].artist;
      newBlock.title = responseText[i].title;
      newBlock.year = responseText[i].year;
      //text nodes
      var artist = document.createTextNode("Artist: " + responseText[i].artist + '\n');
      var title = document.createTextNode("Title: " + responseText[i].title + '\n');
      var year = document.createTextNode("Year: " + responseText[i].year + '\n');

      newBlock.addEventListener("mouseover", hiLight);
      newBlock.addEventListener("mouseleave", turnBlack);
      newBlock.addEventListener("click", addToLibrary); //function to add songs to user library

      //add elements to the array
      newBlock.appendChild(artist);
      newBlock.appendChild(title);
      newBlock.appendChild(year);

      if (artistInput.toLowerCase() == responseText[i].artist.toLowerCase() || artistInput.toLowerCase() == '') {
        if (titleInput.toLowerCase() == responseText[i].title.toLowerCase() || titleInput.toLowerCase() == '') {
          if (yearInput.toLowerCase() == responseText[i].year.toLowerCase() || yearInput.toLowerCase() == '') {
            document.getElementById("allSongs").appendChild(newBlock);
          }
        }
      }
    } //end for loop
  }

  function turnBlack() {
    this.style.backgroundColor = '#609dff';
    this.style.cursor = 'default';
  }

  function hiLight() {
    this.style.backgroundColor = 'red';
    this.style.cursor = 'pointer';
  }

  function addToLibrary() {
    var newBlock = document.createElement('div');
    newBlock.artist = this.artist;
    newBlock.title = this.title;
    newBlock.year = this.year;
    newBlock.style.backgroundColor = '#609dff'
    //text nodes
    var artist = document.createTextNode("Artist: " + this.artist + '\n');
    var title = document.createTextNode("Title: " + this.title + '\n');
    var year = document.createTextNode("Year: " + this.year + '\n');

    newBlock.addEventListener("mouseover", hiLight);
    newBlock.addEventListener("mouseleave", turnBlack);
    newBlock.addEventListener("click", removeFromLibrary); //function to remove songs to user library

    //add elements to the array
    newBlock.appendChild(artist);
    newBlock.appendChild(title);
    newBlock.appendChild(year);

    document.getElementById("userSongs").appendChild(newBlock);
    updateLibrary()
  }

  function updateLibrary() {
    //write this data to a text file here ---
    var songList = document.getElementById("userSongs").innerHTML;
    songList = songList.split(">");
    songList.forEach(function(song) {
      //send post request for each song
      if (song[0] == 'A') {
        song = song.split("\n");
        song = song.slice(0, 3);
        var user = {};
        user["artist"] = song[0].split(": ")[1];
        user["title"] = song[1].split(": ")[1];
        user["year"] = song[2].split(": ")[1];
        user["mode"] = 'writeMusic';
        var fetchOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        };
        var url = "http://localhost:3000";
        fetch(url, fetchOptions)
          .then(checkStatus)
          .then(function(responseText) {
            if (responseText == "Notlogin") {
              window.location.href = './index.html';
            }
            console.log(responseText);
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    });

  }

  function populateYourMusic() { //populate current users library
    var user = {};
    user["mode"] = 'yourMusic';
    var fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    };
    var url = "http://localhost:3000";
    fetch(url, fetchOptions)
      .then(checkStatus)
      .then(function(responseText) {
        if (responseText == "Notlogin") {
          window.location.href = './index.html';
        }
        console.log(responseText);
        var songList = JSON.parse(responseText);
        console.log(songList);
        songList.forEach(function(song) {
          var newBlock = document.createElement('div');
          newBlock.artist = song[1];
          newBlock.title = song[2];
          newBlock.year = song[3];
          newBlock.style.backgroundColor = '#609dff'
          //text nodes
          var artist = document.createTextNode("Artist: " + song[1] + '\n');
          var title = document.createTextNode("Title: " + song[2] + '\n');
          var year = document.createTextNode("Year: " + song[3] + '\n');

          newBlock.addEventListener("mouseover", hiLight);
          newBlock.addEventListener("mouseleave", turnBlack);
          newBlock.addEventListener("click", removeFromLibrary); //function to remove songs to user library

          //add elements to the array
          newBlock.appendChild(artist);
          newBlock.appendChild(title);
          newBlock.appendChild(year);

          document.getElementById("userSongs").appendChild(newBlock);

        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function removeFromLibrary() { //sends post request to remove song from files
    this.innerHTML = "";
    var user = {};
    user["artist"] = this.artist;
    user["title"] = this.title;
    user["year"] = this.year;
    user["mode"] = 'removeSong';
    var fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    };
    var url = "http://localhost:3000";
    fetch(url, fetchOptions)
      .then(checkStatus)
      .then(function(responseText) {
        if (responseText == "Notlogin") {
          window.location.href = './index.html';
        }
        console.log(responseText);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  // returns the response text if the status is in the 200s
  // otherwise rejects the promise with a message including the status
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else if (response.status == 404) {
      // sends back a different error when we have a 404 than when we have
      // a different error
      return Promise.reject(new Error("Sorry, we couldn't find that page"));
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }

})();
