define([], function() {
	var vec;
	vec = function(a, b) {
		var _x, _y, err, ref, ref1, ref2, ref3, ref4, xa, xb, ya, yb;
		try {
			if (typeof a === 'number' && typeof b === 'number') {
				ref = [a, b], _x = ref[0], _y = ref[1];
			} else if (b == null) {
				_x = a.x, _y = a.y;
			} else {
				ref1 = [a, b], (ref2 = ref1[0], xa = ref2.x, ya = ref2.y), (ref3 = ref1[1], xb = ref3.x, yb = ref3.y);
				ref4 = [xb - xa, yb - ya], _x = ref4[0], _y = ref4[1];
			}
			if (typeof _x !== 'number' || typeof _y !== 'number' || isNaN(_x) || isNaN(_y)) {
				throw "Coordinate Error";
			}
		} catch (_error) {
			err = _error;
			console.error({
				a: a,
				b: b,
				err: err
			});
			throw Error("invalid vector: (" + a + ", " + b + ")");
		}
		return {
			x: _x,
			y: _y,
			add: (function(p) {
				var ref5, x, y;
				ref5 = vec(p), x = ref5.x, y = ref5.y;
				return vec(_x + x, _y + y);
			}),
			sub: (function(p) {
				var ref5, x, y;
				ref5 = vec(p), x = ref5.x, y = ref5.y;
				return vec(_x - x, _y - y);
			}),
			mul: (function(k) {
				return vec(_x * k, _y * k);
			}),
			raw: (function() {
				return {
					x: _x,
					y: _y
				};
			}),
			toPolar: function() {
				var alpha, rho;
				rho = Math.sqrt(_x * _x + _y * _y);
				if (rho < 1e-8) {
					return {
						rho: 0,
						theta: NaN
					};
				} else {
					alpha = Math.acos(-_y / rho);
					return {
						rho: rho,
						theta: _x >= 0 ? alpha : 2 * Math.PI - alpha
					};
				}
			}
		};
	};
	vec.rotate = function(arg) {
		var x, y;
		x = arg.x, y = arg.y;
		return vec(-y, x);
	};
	vec.fromPolar = function(arg) {
		var rho, theta;
		theta = arg.theta, rho = arg.rho;
		if (rho < 1e-8) {
			return vec(0, 0);
		} else {
			return vec(rho * Math.sin(theta), -rho * Math.cos(theta));
		}
	};
	return vec;
});
