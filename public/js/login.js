function Login(){
  this.submit = function(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    loginParser.postData("username="+username+"&password="+password,loginCheck);
  }

  this.register = function(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var passwordCheck = document.getElementById("passwordCheck").value;
    if(password === passwordCheck){
      registerParser.postData("username="+username+"&password="+password,registryCheck);
    }
    else{
      console.log("passwords don't match");
    }
  }

  this.logout = function(){
    document.cookie = "";
  }

  // callback function for login
  function loginCheck(response){
    response = response.split(":");
    if(response[0] === "succeeded"){
      console.log("login successful");
      document.cookie = response[1];
      console.log(document.cookie);
    }
    else{
      console.log("login failed");
    }
  }

  // callback function for registry
  function registryCheck(response){
    console.log(response);
  }

}

var login = new Login();
