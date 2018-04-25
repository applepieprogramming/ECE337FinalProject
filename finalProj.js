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
