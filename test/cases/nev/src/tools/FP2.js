define(['{pro}/tools/fp.js'], function(FPUtils) {
	var best, bestOn, concat, getBBox, identity, map, max, min, pluck, streak, streak2, take, unique;
	unique = (function() {
		var init;
		init = new Object;
		return function(equal) {
			return function(ls) {
				var i, j, k, l, len, len1, t, x;
				i = 0;
				t = init;
				if (equal == null) {
					for (j = k = 0, len = ls.length; k < len; j = ++k) {
						x = ls[j];
						if (!(x !== t)) {
							continue;
						}
						ls[i] = t = x;
						i += 1;
					}
				} else {
					for (j = l = 0, len1 = ls.length; l < len1; j = ++l) {
						x = ls[j];
						if (!(t === init || !equal(x, t))) {
							continue;
						}
						ls[i] = t = x;
						i += 1;
					}
				}
				ls.splice(i, Infinity);
				return ls;
			};
		};
	})();
	pluck = FPUtils.pluck, take = FPUtils.take, map = FPUtils.map, concat = FPUtils.concat, best = FPUtils.best, streak = FPUtils.streak;
	max = best(function(x, y) {
		return x > y;
	});
	min = best(function(x, y) {
		return x < y;
	});
	bestOn = function(f) {
		return best(function(a, b) {
			return f(a) > f(b);
		});
	};
	identity = function(x) {
		return x;
	};
	streak2 = function(n) {
		return function(xs) {
			return streak(n)(concat([xs, take(n - 1)(xs)]));
		};
	};
	getBBox = function(ps) {
		var bottom, left, right, top, xs, ys;
		xs = map(pluck('x'))(ps);
		ys = map(pluck('y'))(ps);
		left = min(xs);
		top = min(ys);
		right = max(xs);
		bottom = max(ys);
		return {
			x: left,
			y: top,
			left: left,
			top: top,
			right: right,
			bottom: bottom,
			width: right - left,
			height: bottom - top
		};
	};
	return {
		unique: unique,
		max: max,
		min: min,
		bestOn: bestOn,
		identity: identity,
		streak2: streak2,
		getBBox: getBBox
	};
});
