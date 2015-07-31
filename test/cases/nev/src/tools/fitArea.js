define(['{pro}/tools/Vector.js', '{pro}/tools/binarySearch.js'], function(vec, binarySearch) {
	var fitArea;
	fitArea = function(area, getbbox, arg, eps) {
		var bbox, f, h, maxBound, minBound, o, p, q, r, ref, ref1, ref2, ref3, w;
		minBound = arg[0], maxBound = arg[1];
		w = area.width, h = area.height;
		f = function(r) {
			var height, ref, width;
			ref = getbbox(r), width = ref.width, height = ref.height;
			return width < w && height < h;
		};
		r = binarySearch(f, [minBound, maxBound], eps);
		bbox = getbbox(r);
		p = vec(w / 2, h / 2).add(vec(-bbox.width / 2, -bbox.height / 2));
		q = p.add(vec(-((ref = bbox.x) != null ? ref : bbox.left), -((ref1 = bbox.y) != null ? ref1 : bbox.top)));
		o = q.add(vec((ref2 = area.x) != null ? ref2 : area.left, (ref3 = area.y) != null ? ref3 : area.top));
		return [r, o];
	};
	return fitArea;
});
