(function() {
  "use strict";

window.onload = function() {//initial function to handle when the user clicks on either buttons


  var signUpButton = document.getElementById("signUpButton");
  var loginButton = document.getElementById("loginButton");

  signUpButton.onclick = signUp;
  loginButton.onclick = login;

};


function signUp(){
    var name = document.getElementById("userName").value;
    var password = document.getElementById("password").value;

    //console.log("name: "+ name + "\npassword: "+ password);

    var user = {};
    user["name"] = name;
    user["password"] = password;
    user['mode'] = 'signUp';

    var fetchOptions = {
      method : 'POST',
      headers : {
        'Accept': 'application/json',
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(user)
    };

    var url = "http://localhost:3000";
    fetch(url, fetchOptions)
      .then(checkStatus)
      .then(function(responseText) {
        document.getElementById("debug").innerHTML = responseText;

        //if user doesnt exist redirect to other service
        if(responseText[0] == 'T'){
          loadService(user);
        }else{
        //else stay here

        }

      })
      .catch(function(error) {
        console.log(error);
        document.getElementById("debug").innerHTML = error;
      });
    }


function login(){
  var name = document.getElementById("userName").value;
  var password = document.getElementById("password").value;

  //console.log("name: "+ name + "\npassword: "+ password);

  var user = {};
  user["name"] = name;
  user["password"] = password;
  user['mode'] = 'login';

  var fetchOptions = {
    method : 'POST',
    headers : {
      'Accept': 'application/json',
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify(user)
  };

  var url = "http://localhost:3000";
  fetch(url, fetchOptions)
    .then(checkStatus)
    .then(function(responseText) {
      document.getElementById("debug").innerHTML = responseText;

      //if user doesnt exist redirect to other service
      if(responseText[0] == 'W'){
        loadService(user);
      }else{
      //else stay here

      }

    })
    .catch(function(error) {
      console.log(error);
      document.getElementById("debug").innerHTML = error;
      });
}


function loadService(user){
  clearLoginInfo(user);
  console.log("Load Service");
  console.log("Name: " + user.name);
  console.log("PW: " + user.password);

}


function clearLoginInfo(user){
    document.getElementById("loginMessage").innerHTML = "Fix Me";
    document.getElementById("welcomeText").innerHTML = 'Welcome '+ user.name + "!";
    document.getElementById("block1").innerHTML = 'Your Library:';
    //add songs to list here
    //for(var i; i < user.SongData.length; i++){
    for(var i; i < 5; i++){
      var node = document.createElement("div");
      var textnode = document.createTextNode("Example ");
      node.appendChild(textnode);
      document.getElementById("block1").appendChild(node);
    }
    document.getElementById("block2").innerHTML = '';

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
          return Promise.reject(new Error(response.status+": "+response.statusText));
      }
  }


})();
