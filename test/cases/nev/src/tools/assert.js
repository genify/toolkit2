
define(function(){
  var strict = true;
  var assert = function(exp,msg){
    if(strict){
      if (exp){
        return true;
      }else{
        var theMsg = msg === undefined ? "assert!" : msg;
        //console.log("exception throwed:  " + theMsg);
        throw (theMsg);
      }
    }
    
  }
  return assert;
});