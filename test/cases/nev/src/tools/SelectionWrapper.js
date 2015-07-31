define(['{pro}/libs/colorbox.js'], function(Colorbox) {
	var $;
	$ = (function() {
		var GotWrapper, SelectorWrapper;
		SelectorWrapper = function(selector) {
			var h, ref, t;
			if (typeof selector === 'string') {
				ref = [selector[0], selector.slice(1)], h = ref[0], t = ref[1];
				if (h === '#') {
					return function(x) {
						return x.dynamicProperty("id") === t;
					};
				} else if (h === '.') {
					return function(x) {
						return x.dynamicProperty("kind") === t;
					};
				} else {
					console.info({
						h: h,
						t: t
					});
					throw "Invalid Selector: " + selector;
					return function(x) {
						return x.property("type") === selector;
					};
				}
			} else {
				return selector;
			}
		};
		GotWrapper = function(got, lds, lcs) {
			return {
				children: function(selector) {
					var lcs2;
					return GotWrapper((lcs2 = lcs.selectAll(SelectorWrapper(selector, 1))), lds, lcs2);
				},
				child: function(selector) {
					var lcs2;
					return GotWrapper((lcs2 = lcs.select(SelectorWrapper(selector, 1))), lds, lcs2);
				},
				attr: function(k, v) {
					if (k === 'id' || k === 'kind') {
						return GotWrapper(got.setDynamicProperty(k, v), lds, lcs);
					} else {
						return GotWrapper(got.setProperty(k, v), lds, lcs);
					}
				},
				attrs: function(attrs) {
					var k, r, v;
					r = GotWrapper(got, lds, lcs);
					if (attrs != null) {
						for (k in attrs) {
							v = attrs[k];
							r = r.attr(k, v);
						}
					}
					return r;
				},
				enter: function() {
					return GotWrapper(lds.enter(), lds, lcs);
				},
				exit: function() {
					return GotWrapper(lds.exit(), lds, lcs);
				},
				remove: function() {
					return GotWrapper(got.remove(), lds, lcs);
				},
				data: function(d) {
					var r;
					return GotWrapper((r = got.data(d)), r, lcs);
				},
				append: function(x, attrs) {
					var lcs2;
					return GotWrapper((lcs2 = got.append(x)), lds, lcs2).attrs(attrs);
				},
				at: function(i) {
					var lcs2;
					return GotWrapper((lcs2 = got.at(i)), lds, lcs2);
				},
				filter: function(f) {
					var lcs2;
					return GotWrapper((lcs2 = got.filter(f)), lds, lcs2);
				},
				each: function(callback) {
					return got.each(callback);
				},
				first: function() {
					var r;
					r = [];
					got.each(function(e) {
						return r.push(e);
					});
					return r[0];
				},
				map: function(f) {
					var r;
					r = [];
					got.each(function(e) {
						return r.push(f(e));
					});
					return r;
				},
				length: got != null ? got.size() : void 0,
				raw: got,
				lds: lds,
				lcs: lcs
			};
		};
		return function(selector) {
			var r;
			if (typeof selector.select === 'function') {
				r = selector;
			} else {
				r = Colorbox.selection.select(SelectorWrapper(selector));
			}
			return GotWrapper(r, null, r);
		};
	})();
	return $;
});
