// grabs data from server
function Parser(src){
  var data;
  var finished = false;

  this.getData = function(){
    return data;
  }

  this.isFinished = function(){
    return finished;
  }

  // gets data from requested file
  this.getFile = function(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        data = JSON.parse(this.responseText);
        finished = true;
      }
    }
    xhttp.open("GET",src,true);
    xhttp.send();
  }

  // data formatting:
  // "identifier="data&"identifier2="data2
  this.postData = function(data){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST",src, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(data);
  }

}

// user data
var userParser = new Parser("/users");
userParser.getFile();

// beats
var beatParser = new Parser("/beats");
beatParser.getFile();

var barUpvoter = new Parser("./upvoteBars");

// comments
var commentParser = new Parser("/comment");

// new Parser("/comment").postData("comment=yoyoyo&author=jp&beat=0");

var parserList = [beatParser, userParser];
