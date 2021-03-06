
// setup
// query variable setup

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// creates comments
function populateComments(){
  var beat = beatParser.getData().beats[beatId];
  beat = beat.comments;

  var commentDiv;
  var authorP;
  var cText;
  for(var i = beat.length - 1; i > 0; i-=1){
    commentDiv = document.createElement("div");
    commentDiv.className = "comment";
    authorP = document.createElement("p");
    authorP.className = "author";
    authorP.innerHTML = beat[i].author;
    commentDiv.appendChild(authorP);
    cText = document.createElement("p");
    cText.className = "cText";
    cText.innerHTML = beat[i].comment;
    commentDiv.appendChild(cText);
    document.getElementById("commentBox").appendChild(commentDiv);
  }

}


var beatId = getParameterByName("id");

var audio;
var audioPlaying = false;
var queue = [];

function restartTrack(){
  audio.pause();
  audio.currentTime = 0;
  runTrack();
}

function pauseTrack(){
  if(audioPlaying){
    audioPos = audio.currentTime;
    audio.pause();
    audioPlaying = false;
  }
}

var audioPos = 0;

function runTrack(){
  // if the audio isn't playing
  if(!audioPlaying){
    var beat = beatParser.getData().beats[beatId];
    var sections = beat.sections;
    var startTimes = [];
    var endTimes = [];


    // new audio
    audio=new Audio(beat.src);
    audio.currentTime = audioPos;


    // fills queue with top
    var temp;
    if(queue.length === 0){
      for(var i = 0; i < sections.length; i++){
        queue[i] = beat.sections[i].bars[0].src;
        temp = document.getElementById(divIds[i]).getElementsByTagName("p");
        temp[0].style.backgroundColor = "rgb(102, 114, 138)";
      }
    }
    // populates all queue data
    if(!(queue[0] instanceof Audio)){
      for(var i = 0; i < sections.length; i++){
        startTimes[i] = sections[i].start_time;
        endTimes[i] = sections[i].end_time;
        queue[i] = new Audio(queue[i]);
        queue[i].volume = 0.65;
        console.log(queue[i].volume);
        queue[i].load();
      }
    }


    audio.play();
    audioPlaying = true;

    var inc = 0;
    var cTime;
    var playPromise;
    var playedOnce = false;
    // timer
    var update = setInterval(function(){
      // gets current song time
      cTime = Math.floor(audio.currentTime);
      // checks current time against time stamps
      if(cTime == startTimes[inc] && !playedOnce){
        console.log("yo");
        playPromise = queue[inc].play();
        playedOnce = true;
      }
      if(cTime === endTimes[inc]){
        playPromise.then(()=>{
          console.log("pause the boi");
          queue[inc].pause();
          playedOnce = false;
          inc++;
        });
      }
    },100);


  }
}

var divIds = ["a","b","c","d"];

function displaySorted(){

  var beat = beatParser.getData().beats[beatId];

  //preparing variables for each div



  // arrays
  var sections = [false, false, false, false];

  // populator
  for(var i = 0; i < beat.sections.length; i++){
    if(beat.sections.length >= 5){
      break;
    }
    else{
      sections[i] = beat.sections[i];
    }
  }

  //sort
  for(var a = 0; a < sections.length; a++){
    if(sections[a]){
      // console.log(sections[a])
      sections[a].bars = bubbleSort(sections[a].bars);
    }
  }

  // document modifier
  for(var a = 0; a < sections.length; a++){
    document.getElementById(divIds[a]).innerHTML = "<h2>Part " + divIds[a].toUpperCase() + "</h2>"
    if(sections[a]){
      for(var i=0;i<sections[a].bars.length;i++){
      	var newP=document.createElement("p");
        var upvote = document.createElement("img");
        upvote.className = 'upvoter';
        upvote.src = './resources/hot_flames.png';
        upvote.id = a+"_"+i;
        upvote.setAttribute("clicked",false);
        upvote.style.cursor = "pointer";
        newP.innerHTML=sections[a].bars[i].author + " (" + sections[a].bars[i].rating + ")";
        newP.style.cursor = "pointer";
        newP.id = a+"_"+i;

        newP.addEventListener("click",function(){

          var splitId = this.id.split("_");
          queue[parseInt(splitId[0])] = beat.sections[parseInt(splitId[0])].bars[parseInt(splitId[1])].src;
          var temp = document.getElementById(divIds[parseInt(splitId[0])]).getElementsByTagName("p");
          for(var i = 0; i < temp.length; i++){
            temp[i].style.background = "rgb(86, 97, 119)";
          }
          this.style.background = "rgb(102, 114, 138)";
        });

        upvote.addEventListener('click',function(){
          if(this.getAttribute("clicked")){
            this.src = './resources//hot_flames_activated.png';
            var splitId = this.id.split("_");
            var temp = beat.sections[parseInt(splitId[0])].bars[parseInt(splitId[1])];
            var temp2 = document.getElementById(divIds[parseInt(splitId[0])]).getElementsByTagName("p");
            temp2[parseInt(splitId[1])].innerHTML = temp.author + " (" + (temp.rating+1) + ")";
            barUpvoter.postData("beatId="+beatId+"&sectionId="+splitId[0]+"&author="+sections[parseInt(splitId[0])].bars[parseInt(splitId[1])].author);
            this.removeAttribute("clicked");
          }
          else{
            // console.log("yo");
            this.src = './resources//hot_flames.png';
            var splitId = this.id.split("_");
            var temp = beat.sections[parseInt(splitId[0])].bars[parseInt(splitId[1])];
            var temp2 = document.getElementById(divIds[parseInt(splitId[0])]).getElementsByTagName("p");
            temp2[parseInt(splitId[1])].innerHTML = temp.author + " (" + (temp.rating) + ")";
            barUpvoter.postData("downvote=true&beatId="+beatId+"&sectionId="+splitId[0]+"&author="+sections[parseInt(splitId[0])].bars[parseInt(splitId[1])].author);
            this.setAttribute("clicked",false);
          }
        });
        document.getElementById(divIds[a]).appendChild(upvote);
      	document.getElementById(divIds[a]).appendChild(newP);
      }
    }
  }



}

//Sorting Function
function bubbleSort(arr){
   var len = arr.length;
   for (var i = len-1; i>=0; i--){
     for(var j = 1; j<=i; j++){
       if(arr[j-1].rating<arr[j].rating){
           var temp = arr[j-1];
           arr[j-1] = arr[j];
           arr[j] = temp;
        }
     }
   }
   return arr;
}
