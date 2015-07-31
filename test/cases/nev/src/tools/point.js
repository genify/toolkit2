define(function(){
	var point = function(x,y){

		if(!arguments.length) return this;

		return {x : x, y : y};
	};
    return point;
});