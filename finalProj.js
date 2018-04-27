(function() {
  "use strict";

  window.onload = function() { //initial function to handle when the user clicks on either buttons
    console.log(document.title);
    if(document.title == 'Login') {
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
    }
  };

  function home() {
    window.location.href = './index.html';
  }

  function signUp() {
    var name = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    //console.log("name: "+ name + "\npassword: "+ password);
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
          loadService(user);
        } else {
          //else stay here
        }
      })
      .catch(function(error) {
        console.log(error);
        document.getElementById("debug").innerHTML = error;
      });
  }

  function login() {
    var name = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    //console.log("name: "+ name + "\npassword: "+ password);
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
          loadService(user);
        } else {
          //else stay here
        }
      })
      .catch(function(error) {
        console.log(error);
        document.getElementById("debug").innerHTML = error;
      });
  }

  function loadService(user) {
    window.location.href = './music.html';
  }

  function populateMusicList(){

    var url1 = 'http://localhost:3000/' ;//"http://localhost:3000/";
    fetch(url1)
      .then(checkStatus)
      .then(function(responseText) {
        console.log("Response Text:     " + responseText);
        var json = JSON.parse(responseText);
        //console.log(json);
        //console.log("JSON:     " + json);
        addDataToAllMusic(json);

      })
      .catch(function(error) {

        //error: do something with error
        console.log(error);

      });



  }

  function addDataToAllMusic(responseText){

    console.log("Length" + responseText.length);
    //console.log(responseText);

    var titleInput = document.getElementById("titleInput").value;
    var artistInput = document.getElementById("artistInput").value;
    var yearInput = document.getElementById("yearInput").value;

    document.getElementById("allSongs").innerHTML = '';

    console.log(titleInput + artistInput + yearInput );

    for(var i = 0; i < responseText.length; i++){

        //console.log(responseText[i].title);
        var newBlock = document.createElement('div');
        console.log(responseText[i].artist);
        newBlock.artist = responseText[i].artist;
        newBlock.title = responseText[i].title;
        newBlock.year = responseText[i].year;

        //text nodes
        var artist = document.createTextNode("Artist: " + responseText[i].artist  + '\n');
        var title = document.createTextNode("Title: " + responseText[i].title + '\n');
        var year = document.createTextNode("Year: " + responseText[i].year + '\n');

        newBlock.addEventListener("mouseover", hiLight);
        newBlock.addEventListener("mouseleave", turnBlack);
        newBlock.addEventListener("click", addToLibrary);//function to add songs to user library


        //add elements to the array
        newBlock.appendChild(artist);
        newBlock.appendChild(title);
        newBlock.appendChild(year);



        if(artistInput.toLowerCase() == responseText[i].artist.toLowerCase() || artistInput.toLowerCase() == '' ){
          if(titleInput.toLowerCase() == responseText[i].title.toLowerCase() || titleInput.toLowerCase() == '' ){
            if(yearInput.toLowerCase() == responseText[i].year.toLowerCase() || yearInput.toLowerCase() == '' ){
              document.getElementById("allSongs").appendChild(newBlock);
            }
          }
        }


      }//end for loop






  }

  function turnBlack(){
    this.style.backgroundColor = '#609dff';
    this.style.cursor = 'default';
  }

  function hiLight(){

    this.style.backgroundColor = 'red';
    this.style.cursor = 'pointer';

  }

  function addToLibrary(){

    //alert('in progress');

    var newBlock = document.createElement('div');
    newBlock.artist = this.artist;
    newBlock.title = this.title;
    newBlock.year = this.year;

    //text nodes
    var artist = document.createTextNode("Artist: " + this.artist  + '\n');
    var title = document.createTextNode("Title: " + this.title + '\n');
    var year = document.createTextNode("Year: " + this.year + '\n');

    newBlock.addEventListener("mouseover", hiLight);
    newBlock.addEventListener("mouseleave", turnBlack);
    newBlock.addEventListener("click", removeFromLibrary);//function to remove songs to user library


    //add elements to the array
    newBlock.appendChild(artist);
    newBlock.appendChild(title);
    newBlock.appendChild(year);

    document.getElementById("userSongs").appendChild(newBlock);

    //write this data to a text file here --- FIXME


  }

  function removeFromLibrary(){
    //alert("Removing songs is still in progress");
    this.innerHTML = '';
    //remove songs from file here --- FIXME
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
