define(['{pro}/tools/Vector.js'], function(vec) {
	var mergeArea;
	return mergeArea = function(areaA, areaB) {
		var bottom, right, x, y;
		x = Math.min(areaA.x, areaB.x);
		y = Math.min(areaA.y, areaB.y);
		right = Math.max(areaA.x + areaA.width, areaB.x + areaB.width);
		bottom = Math.max(areaA.y + areaA.height, areaB.y + areaB.height);
		return {
			x: x,
			y: y,
			width: right - x,
			height: bottom - y
		};
	};
});
