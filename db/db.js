var fs = require("fs");

var data;

function getData(src){
  data = JSON.parse(fs.readFileSync('./db/' + src, 'utf8'));
}

function updateData(src){
  fs.writeFileSync("./db/" + src, JSON.stringify(data,null,2), 'utf8');
	getData(src);
}

function getUsers(){
  getData("users.json");
  return data;
}

function getBeats(){
  getData("/beats.json");
  return data;
}

function addBeat(beat){
  getData("/beats.json");
  data.beats.push(beat);
  updateData("/beats.json");
}

function comment(author, comment, beatId){
  getData("/beats.json");
  data.beats[parseInt(beatId)].comments.push({"author":author,"comment":comment,"rating":0,"id":data.beats[parseInt(beatId)].comments.length});
  updateData("/beats.json");
}

function upvoteComment(beatId, commentId){
  getData("/beats.json");
  data.beats[beatId].comments[commentId].rating++;
  updateData("/beats.json");
}

function dropBars(author, src, beatId, sectionId){
  getData("/beats.json");
  data.beats[beatId].sections[sectionId].bars.push({"author":author, "src": src, "rating":0});
  updateData("/beats.json");
}

function upvoteBars(beatId, sectionId, author){
  getData("/beats.json");
  var temp = data.beats[beatId].sections[sectionId].bars;
  for(var i = 0; i < temp.length; i++){
    if(temp[i].author === author){
      temp[i].rating++;
    }
  }
  updateData("/beats.json");
}

module.exports = {
  getUsers:getUsers,
  addBeat:addBeat,
  getBeats:getBeats,
  comment:comment,
  upvoteComment:upvoteComment,
  dropBars:dropBars,
  upvoteBars:upvoteBars
}
