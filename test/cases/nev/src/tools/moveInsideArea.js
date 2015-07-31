define(['{pro}/tools/Vector.js', '{pro}/tools/mergeArea.js'], function(vec, mergeArea) {
	var moveInsideArea;
	return moveInsideArea = function(bbox, area) {
		var outer, x, y;
		outer = mergeArea(bbox, area);
		x = (area.x - outer.x) + (area.width - outer.width);
		y = (area.y - outer.y) + (area.height - outer.height);
		return vec(x, y);
	};
});
