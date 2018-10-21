// beat class
function Beat(author, src, name){

  // attributes
  this.name = name;
  this.author = author;
  this.src = src;
  this.sections = [];

  // add a section
  this.addSection = function(name, start, end){
    this.sections.push({"name":name, "start_time":start, "end_time":end, "bars":[]});
  }

  // converts to json
  this.toJSON = function(){
    return {
      "name":this.name,
      "author":this.author,
      "src":this.src,
      "comments":[],
      "sections":this.sections
    };
  }

}

module.exports = {
  Beat:Beat
}
