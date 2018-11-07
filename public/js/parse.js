// grabs data from server
function Parser(src){
  var data;
  var finished = false;
  this.src = src;

  this.getData = function(){
    return data;
  }

  this.isFinished = function(){
    return finished;
  }

  // gets data from requested file
  this.getFile = function(callback){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        data = JSON.parse(this.responseText);
        finished = true;
        if(callback){
          callback(this.responseText);
        }
      }
    }
    xhttp.open("GET",this.src,true);
    xhttp.send();
  }

  // data formatting:
  // "identifier="data&"identifier2="data2
  this.postData = function(data, callback){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST",this.src, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onload = function() {
      if (xhttp.status==200) {
        if(callback){
          callback(xhttp.responseText);
        }
      }
    };
    xhttp.send(data);
  }
}

// beats
var beatParser = new Parser("/beats");
beatParser.getFile();

var barUpvoter = new Parser("/upvoteBars");

// comments
var commentParser = new Parser("/comment");

// register
var registerParser = new Parser("/register");

//login
var loginParser = new Parser("/login");

//userData
var accountParser = new Parser("/accountData");

// new Parser("/comment").postData("comment=yoyoyo&author=jp&beat=0");

var parserList = [beatParser, commentParser, barUpvoter];
