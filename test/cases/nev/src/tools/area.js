define(function(){
	var area = function(w,h){

		if(!arguments.length) return null;

		return {left : 0, right : w, top : 0, bottom : h, width : w, height : h};
	};
    return area;
});