define(function(){
	var toRGB = function(value){
		var str = value.toLowerCase();
		var result = [];
		var length = value.length;
		for(var i = 1;i < length;i+=2)
			result.push(parseInt("0x" + str.slice(i, i+2)));
		
		return {r : result[0], g : result[1], b : result[2]};
	}
	return toRGB;
});