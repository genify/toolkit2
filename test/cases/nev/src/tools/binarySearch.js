define([], function() {
	var binarySearch;
	binarySearch = function(f, arg, eps) {
		var iter, ref, xs, xt, ys, yt;
		xs = arg[0], xt = arg[1];
		iter = function(xl, xu, yl, yu) {
			var xm, ym;
			if (Math.abs(xl - xu) < eps) {
				return xl;
			} else {
				xm = (xl + xu) / 2;
				ym = f(xm);
				if (ym !== yl) {
					return iter(xl, xm, yl, ym);
				} else {
					return iter(xm, xu, ym, yu);
				}
			}
		};
		ref = [f(xs), f(xt)], ys = ref[0], yt = ref[1];
		if (!(typeof ys === 'boolean' && typeof yt === 'boolean' && ys !== yt)) {
			throw Error("binarySearch: invalid ends (" + ys + ", " + yt + ")");
		}
		return iter(xs, xt, ys, yt);
	};
	return binarySearch;
});
