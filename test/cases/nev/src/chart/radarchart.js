/*
------------------------------------------
雷达图表
@version 0.0.1
@author luochen(hzluochen2015@corp.netease.com)
------------------------------------------
*/


/** @module chart */
define(['./commonchartbase.js', '{pro}/interactencoder/interactencoder.js', '{pro}/visualencoder/visualencoder.js', '{pro}/config/visualencoding/radar.js', '{pro}/libs/colorbox.js', '{pro}/tools/fp.js', '{pro}/tools/fp2.js', '{pro}/tools/Vector.js', '{pro}/tools/fitArea.js', '{pro}/tools/moveInsideArea.js', '{pro}/tools/paddedArea.js', '{pro}/theme/radar.js', '{pro}/config/userconfig/optionVisualEncoding.js', '{pro}/tools/SelectionWrapper.js'], function(CommonChartBase, InteractEncoder, VisualEncoder, RadarIE, Colorbox, FPUtils, FPUtils2, vec, fitArea, moveInsideArea, paddedArea, radarthemeMap, mParseOptionToVE, $) {
	var BubbleReceiver, Circle, Container, Line, MultilineText, Polygon, RadarChart, Rect, Text, assert, best, bestOn, build, concat, cons, copy, deepcopy, defaultInteractionEncoding, dict, enumerate, extend, filter, foldl, foreach, getBBox, getSolvers, id, identity, iterate, json, kind, last, layout, list, log, map, max, min, pluck, precise, preprocess, range, ref, render, seriesColors, sortOn, streak, streak2, take, takeWhile, unique, zip;
	log = FPUtils.log, assert = FPUtils.assert, dict = FPUtils.dict, copy = FPUtils.copy, deepcopy = FPUtils.deepcopy, json = FPUtils.json, extend = FPUtils.extend, pluck = FPUtils.pluck, precise = FPUtils.precise;
	range = FPUtils.range, take = FPUtils.take, takeWhile = FPUtils.takeWhile, iterate = FPUtils.iterate, map = FPUtils.map, foreach = FPUtils.foreach, foldl = FPUtils.foldl, filter = FPUtils.filter;
	cons = FPUtils.cons, concat = FPUtils.concat, best = FPUtils.best, last = FPUtils.last, zip = FPUtils.zip, list = FPUtils.list, streak = FPUtils.streak, enumerate = FPUtils.enumerate, sortOn = FPUtils.sortOn;
	unique = FPUtils2.unique, max = FPUtils2.max, min = FPUtils2.min, bestOn = FPUtils2.bestOn, identity = FPUtils2.identity, streak2 = FPUtils2.streak2, getBBox = FPUtils2.getBBox;
	Container = Colorbox.ContainerSprite, Line = Colorbox.Line, Circle = Colorbox.Circle, Rect = Colorbox.Rect, Polygon = Colorbox.Polygon, Text = Colorbox.Text, MultilineText = Colorbox.MultilineText, BubbleReceiver = Colorbox.BubbleReceiver, (ref = Colorbox.selector, id = ref.id, kind = ref.kind);
	getSolvers = function(labelbboxs, isCircleGrid) {
		var circlePadding, getLabelPos, getReferencePoints, getSpokeEnds, labelbboxh, n, solveProblem1, solveProblem2;
		n = labelbboxs.length;
		labelbboxh = labelbboxs[0].height;
		circlePadding = labelbboxh / Math.sqrt(2) + 5;
		getSpokeEnds = function(r) {
			var angles, points;
			angles = map(function(i) {
				return i * 2 * Math.PI / n;
			})(range(n));
			points = map(function(theta) {
				return vec.fromPolar({
					theta: theta,
					rho: r
				});
			})(angles);
			return points;
		};
		getReferencePoints = function(r) {
			var angles, points, r2;
			r2 = r + circlePadding;
			angles = map(function(i) {
				return i * 2 * Math.PI / n;
			})(range(n));
			points = map(function(theta) {
				return vec.fromPolar({
					theta: theta,
					rho: r2
				});
			})(angles);
			return points;
		};
		getLabelPos = function(i, p, arg) {
			var height, ref1, width;
			width = arg.width, height = arg.height;
			if ((ref1 = 2 * i) === 0 || ref1 === n) {
				return vec(-width / 2, -height / 2).add(p);
			} else if (2 * i < n) {
				return vec(-labelbboxh / 2, -labelbboxh / 2).add(p);
			} else {
				return vec(labelbboxh / 2 - width, -labelbboxh / 2).add(p);
			}
		};
		solveProblem2 = function(r) {
			var corners, getCorners, points;
			points = getReferencePoints(r);
			getCorners = function(arg) {
				var a, b, height, i, p, ref1, width;
				i = arg[0], p = arg[1], (ref1 = arg[2], width = ref1.width, height = ref1.height);
				a = getLabelPos(i, p, {
					width: width,
					height: height
				});
				b = vec(width, height).add(a);
				return [a, b];
			};
			corners = concat(map(getCorners)(zip(range(), points, labelbboxs)));
			if (isCircleGrid) {
				corners = cons({
					x: 0,
					y: r
				})(corners);
			}
			return getBBox(corners);
		};
		solveProblem1 = function(area) {
			return fitArea(area, solveProblem2, [0, area.height], 0.1);
		};
		return {
			solveProblem2: solveProblem2,
			solveProblem1: solveProblem1,
			getLabelPos: getLabelPos,
			getReferencePoints: getReferencePoints,
			getSpokeEnds: getSpokeEnds
		};
	};
	seriesColors = (function() {
		var arr;
		arr = list(map(function(i) {
			return function(a) {
				return {
					r: 0,
					g: 100 + i * 30,
					b: 250 - i * 30,
					a: a
				};
			};
		})(range(5)));
		return function(i) {
			return arr[i % arr.length];
		};
	})();
	preprocess = function(option, data) {
		var base, info, maxy, step;
		info = {
			data: option.data,
			thetaAxis: extend({})(option.thetaAxis, {
				caption: option.thetaAxis.field,
				label: option.thetaAxis.label && option.thetaAxis.label.format ? option.thetaAxis.label.format : {
					format: function(x) {
						return "" + x;
					}
				}
			}),

			rhoAxis: extend({})(option.rhoAxis, {
				tickLabel: (function(x) {
					return '' + x;
				}),
				caption: '值'
			}),
			series: list(map(function(d) {
				return extend({})(d, {
					caption: d.field,
					type: 'area'
				});
			})(option.series)),
			grid: extend({})(option.grid, {
				style: 'polygen'
			}),
			tooltip: extend({})(option.tooltip, {
				padding: {
					left: 5,
					top: 5,
					right: 5,
					bottom: 5
				},
				formatter: function(arg) {
					var item, rhoAxisCaption, series, spoke, thetaAxisCaption;
					thetaAxisCaption = arg.thetaAxisCaption, rhoAxisCaption = arg.rhoAxisCaption, spoke = arg.spoke, series = arg.series, item = arg.item;
					return [thetaAxisCaption + ": " + spoke.label, series.field + "的" + rhoAxisCaption + ": " + item];
				}
			})
		};
		//console.log("info.thetaAxis", info.thetaAxis)
		

		info.cache = {
			n: info.data.length,
			m: info.series.length,
			seriesDatas: list(map(function(arg) {
				var caption, field, i, ref1, type;
				i = arg[0], (ref1 = arg[1], caption = ref1.caption, field = ref1.field, type = ref1.type);
				return {
					caption: caption,
					field: field,
					type: type,
					index: i,
					seriesIndex:i,
					itemys: list(map(pluck(field))(info.data))
				};
			})(enumerate(info.series))),
			labelDatas: info.data.map(pluck(info.thetaAxis.field)),
			item: function(spoke_id, series_id) {
				return info.data[spoke_id][info.series[series_id].field];
			},
			spoke: function(spoke_id) {
				return {
					label: info.thetaAxis.label.format(info.data[spoke_id][info.thetaAxis.field])
				};
			},
			series: function(series_id) {
				return info.series[series_id];
			}
		};


		maxy = max(concat(map(pluck('itemys'))(info.cache.seriesDatas)));
		if ((base = info.rhoAxis).domainMin == null) {
			base.domainMin = 0;
		}
		if (info.rhoAxis.ticks != null) {
			info.rhoAxis.ticks = filter(function(y) {
				return info.rhoAxis.domainMin <= y;
			})(info.rhoAxis.ticks);
			if (info.rhoAxis.domainMax != null) {
				info.rhoAxis.ticks = filter(function(y) {
					return y <= info.rhoAxis.domainMax;
				})(info.rhoAxis.ticks);
			} else {
				info.rhoAxis.domainMax = Math.max(maxy, max(info.rhoAxis.ticks));
			}
			info.rhoAxis.ticks = list(info.rhoAxis.ticks);
		} else {
			if (info.rhoAxis.domainMax != null) {
				step = precise(2)((info.rhoAxis.domainMax - info.rhoAxis.domainMin) / 3);
				info.rhoAxis.ticks = list(takeWhile(function(y) {
					return y < info.rhoAxis.domainMax;
				})(map(function(i) {
					return info.rhoAxis.domainMin + step * i;
				})(range())));
			} else {
				step = precise(4)(0.3 * precise(1)(maxy - info.rhoAxis.domainMin));
				info.rhoAxis.ticks = list(takeWhile(function(y) {
					return y < maxy;
				})(map(function(i) {
					return info.rhoAxis.domainMin + step * i;
				})(range())));
				info.rhoAxis.domainMax = (last(info.rhoAxis.ticks)) + step;
			}
		}
		info.cache.gridDatas = list(enumerate(streak(2)(unique(function(a, b) {
			return precise(2)(a) === precise(2)(b);
		})(sortOn(identity)((copy(info.rhoAxis.ticks)).concat([info.rhoAxis.domainMin, info.rhoAxis.domainMax]))))));
		console.log("gridDatas",info.cache.gridDatas)
		var temp = info.cache.seriesDatas.map(function(arg) {
			var caption;
			caption = arg.caption;
			return [
				caption, {
					hidden: false,
					color: {
						r: 0,
						g: 0,
						b: 0,
						a: 0.1
					}
				}
			];
		});

		info.seriesInfo = dict(temp);

		info.cache.seriesDatas = list(info.cache.seriesDatas);
		//	console.log("info",info)
		return info;
	};
	build = function(info, rootNode) {

		var N, background, bgrect, center, grids, labels, serieses, spokes, ticks;
		$(rootNode).children('#background').data([{}]).enter().append(BubbleReceiver).attrs({
			id: 'background'
		});
		background = $(rootNode).children('#background');
		background.children('#bgrect').data([{}]).enter().append(Rect).attrs({
			id: 'bgrect',
			z: 1
		});
		bgrect = background.child('#bgrect');
		background.children('#center').data([{}]).enter().append(Container).attrs({
			id: 'center',
			z: 2
		});
		center = background.child('#center');
		center.children('#grids').data([{}]).enter().append(Container).attrs({
			id: 'grids'
		});
		grids = center.child('#grids');
		center.children('#spokes').data([{}]).enter().append(Container).attrs({
			id: 'spokes',
			z: 100
		});
		spokes = center.child('#spokes');
		center.children('#ticks').data([{}]).enter().append(Container).attrs({
			id: 'ticks',
			z: 101
		});
		ticks = center.child('#ticks');
		center.children('#labels').data([{}]).enter().append(Container).attrs({
			id: 'labels',
			z: 102
		});
		labels = center.child('#labels');
		center.children('#serieses').data([{}]).enter().append(Container).attrs({
			id: 'serieses',
			z: 103
		});
		serieses = center.child('#serieses');
		N = info.cache.n;
		labels.children('.label').data(info.cache.labelDatas).enter().append(Text, {
			kind: 'label',
			text: info.thetaAxis.label.format
		}).exit().remove();
		assert(function() {
			return labels.children('.label').length === info.cache.labelDatas.length;
		});
		assert(function() {
			return labels.children('.label').first().parent() === labels.first();
		});
		spokes.children('.spoke').data(list(range(info.cache.n))).enter().append(Line, {
			kind: 'spoke'
		}).exit().remove();
		assert(function() {
			return spokes.children('.spoke').length === info.cache.n;
		});
		serieses.children('.series').data(info.cache.seriesDatas.filter(function(arg) {
			var caption;
			caption = arg.caption;
			return !info.seriesInfo[caption].hidden;
		})).enter().append(Line, {
			kind: 'series',
			z: function(arg) {
				var index;
				index = arg.index;
				return 5 * (N - index);
			},
			lineWidth: 3,
			strokeStyle: function(arg) {
				var index;
				index = arg.index;
				return seriesColors(index)(0.8);
			}
		}).exit().remove().children('.item').data((function(arg) {
			var index, itemys;
			index = arg.index, itemys = arg.itemys;
			return list(map(function(arg1) {
				var i, y;
				i = arg1[0], y = arg1[1];
				return {
					i: i,
					y: y,
					index: index,
					seriesIndex:index
				};
			})(enumerate(itemys)));
		})).enter().append(Circle, {
			kind: 'item',
			z: 1,
			radius: 3,
			strokeStyle: function() {
				return seriesColors(0)(0.8);
			},
			fillStyle: function() {
				return seriesColors(0)(0.4);
			},
			ratioAnchor: {
				ratiox: 0.5,
				ratioy: 0.5
			}
		}).exit().remove();
		serieses.children('.series').filter(function(e) {
			return e.dynamicAttrs.data.type === 'area';
		}).children('.area').data(function(d) {
			return [d];
		}).enter().append(Polygon, {
			kind: 'area',
			z: -1,
			fillStyle: function(arg) {
				var index, type;
				type = arg.type, index = arg.index;
				return seriesColors(index)(type === 'area' ? 0.4 : 0);
			}
		});
		grids.children('.grid').data(info.cache.gridDatas).enter().append(function() {
			if (info.grid.style === 'polygen') {
				return Polygon;
			} else {
				return Circle;
			}
		}).attrs({
			kind: 'grid',
			z: function(arg) {
				var i;
				i = arg[0];
				return N - i;
			},
			fillStyle: {
				r: 255,
				g: 255,
				b: 255,
				a: 0
			},
			strokeStyle: {
				r: 100,
				g: 100,
				b: 100,
				a: 0.5
			}
		}).exit().remove();
		assert(function() {
			return grids.children('.grid').length === info.cache.gridDatas.length;
		});
		ticks.children('.tick').data(info.rhoAxis.ticks).enter().append(Text, {
			kind: 'tick',
			ratioAnchor: {
				ratiox: 0,
				ratioy: 1
			},
			text: info.rhoAxis.tickLabel
		});
		assert(function() {
			return ticks.children('.tick').length === info.rhoAxis.ticks.length;
		});
		return rootNode;
	};
	layout = function(info, origin_area, rootNode) {
		var N, area, background, bgrect, center, getItemsOnSpoke, getLabelPos, getPointOnSpoke, getReferencePoints, getSpokeEnds, grids, labelPoses, labelbboxs, labels, o, r, ref1, ref2, refPoints, serieses, solveProblem1, spokeEnds, spokes, ticks;
		background = $(rootNode).children('#background');
		bgrect = background.child('#bgrect');
		center = background.child('#center');
		labels = center.child('#labels');
		spokes = center.child('#spokes');
		serieses = center.child('#serieses');
		grids = center.child('#grids');
		ticks = center.child('#ticks');
		assert(function() {
			return labels.length === 1;
		});
		assert(function() {
			return spokes.length === 1;
		});
		assert(function() {
			return serieses.length === 1;
		});
		assert(function() {
			return grids.length === 1;
		});
		assert(function() {
			return ticks.length === 1;
		});
		N = info.cache.n;
		area = paddedArea({
			left: 5,
			top: 5,
			right: 5,
			bottom: 5
		}, origin_area);
		labelbboxs = labels.children('.label').map(function(e) {
			return e.bbox();
		});
		ref1 = getSolvers(labelbboxs, info.grid.style === 'circle'), solveProblem1 = ref1.solveProblem1, getLabelPos = ref1.getLabelPos, getReferencePoints = ref1.getReferencePoints, getSpokeEnds = ref1.getSpokeEnds;
		ref2 = solveProblem1(area), r = ref2[0], o = ref2[1];
		refPoints = getReferencePoints(r);
		labelPoses = list(map(function(arg) {
			var i, p, sz;
			i = arg[0], p = arg[1], sz = arg[2];
			return getLabelPos(i, p, sz);
		})(zip(range(), refPoints, labelbboxs)));
		spokeEnds = getSpokeEnds(r);
		bgrect.attrs({
			width: area.width - 2,
			height: area.height - 2,
			x: area.left + 1,
			y: area.top + 1
		});
		center.attrs(o.raw());
		getPointOnSpoke = function(y, i) {
			var maxy, miny, p, ref3, rho, theta;
			theta = (i % N) * 2 * Math.PI / N;
			ref3 = [info.rhoAxis.domainMin, info.rhoAxis.domainMax], miny = ref3[0], maxy = ref3[1];
			rho = r * (y - miny) / (maxy - miny);
			p = vec.fromPolar({
				theta: theta,
				rho: rho
			});
			return p;
		};
		getItemsOnSpoke = function(i) {
			return serieses.children('.series').map(function(e) {
				return $(e).children('.item').at(i).first();
			});
		};
		info.layout = {
			area: {
				x: area.left,
				y: area.top,
				width: area.width,
				height: area.height
			},
			getPointOnSpoke: getPointOnSpoke,
			getItemsOnSpoke: getItemsOnSpoke,
			center: center.map(function(e) {
				return vec({
					x: e.worldX(),
					y: e.worldY()
				});
			})[0],
			radius: r
		};
		labels.children('.label').data(info.data.map(pluck(info.thetaAxis.field))).attrs({
			x: function(_, i) {
				return labelPoses[i].x;
			},
			y: function(_, i) {
				return labelPoses[i].y;
			}
		});
		spokes.children('.spoke').data(list(spokeEnds)).attrs({
			kind: 'spoke',
			vertexes: function(p) {
				return [{
					x: 0,
					y: 0
				}, p];
			}
		});
		serieses.children('.series').data(info.cache.seriesDatas.filter(function(arg) {
			var caption;
			caption = arg.caption;
			return !info.seriesInfo[caption].hidden;
		})).enter().append(Line).attrs({
			kind: 'series',
			z: function(arg) {
				var index;
				index = arg.index;
				return 5 * (N - index);
			},
			vertexes: function(d) {
				return list(map(function(arg) {
					var i, y;
					i = arg[0], y = arg[1];
					return getPointOnSpoke(y, i);
				})(enumerate(concat([d.itemys, [d.itemys[0]]]))));
			}
		}).exit().remove().children('.item').data((function(arg) {
			var index, itemys;
			index = arg.index, itemys = arg.itemys;
			return list(map(function(arg1) {
				var i, y;
				i = arg1[0], y = arg1[1];
				return {
					i: i,
					y: y,
					index: index,
					seriesIndex:index
				};
			})(enumerate(itemys)));
		})).enter().append(Circle, {
			kind: 'item',
			z: 1,
			radius: 3,
			ratioAnchor: {
				ratiox: 0.5,
				ratioy: 0.5
			},
			x: function(arg) {
				var i, y;
				i = arg.i, y = arg.y;
				return getPointOnSpoke(y, i).x;
			},
			y: function(arg) {
				var i, y;
				i = arg.i, y = arg.y;
				return getPointOnSpoke(y, i).y;
			}
		}).exit().remove();
		serieses.children('.series').data(info.cache.seriesDatas.filter(function(arg) {
			var caption;
			caption = arg.caption;
			return !info.seriesInfo[caption].hidden;
		})).attrs({
			vertexes: function(arg) {
				var caption, field, itemys, type;
				caption = arg.caption, field = arg.field, type = arg.type, itemys = arg.itemys;
				return list(map(function(arg1) {
					var i, y;
					i = arg1[0], y = arg1[1];
					return getPointOnSpoke(y, i);
				})(enumerate(concat([itemys, [itemys[0]]]))));
			}
		}).children('.item').data((function(arg) {
			var index, itemys;
			index = arg.index, itemys = arg.itemys;
			return list(map(function(arg1) {
				var i, y;
				i = arg1[0], y = arg1[1];
				return {
					i: i,
					y: y,
					index: index,
					seriesIndex:index
				};
			})(enumerate(itemys)));
		})).attrs({
			x: function(arg) {
				var i, y;
				i = arg.i, y = arg.y;
				return getPointOnSpoke(y, i).x;
			},
			y: function(arg) {
				var i, y;
				i = arg.i, y = arg.y;
				return getPointOnSpoke(y, i).y;
			}
		});
		serieses.children('.series').filter(function(e) {
			return e.dynamicAttrs.data.type === 'area';
		}).children('.area').data(function(d) {
			return [d];
		}).enter().append(Polygon, {
			kind: 'area',
			z: -1,
			fillStyle: function(arg) {
				var index, type;
				type = arg.type, index = arg.index;
				return seriesColors(index)(type === 'area' ? 0.4 : 0);
			}
		});
		serieses.children('.series').children('.area').attrs({
			vertexes: function(arg) {
				var caption, field, itemys, type;
				caption = arg.caption, field = arg.field, type = arg.type, itemys = arg.itemys;
				return list(map(function(arg1) {
					var i, y;
					i = arg1[0], y = arg1[1];
					return getPointOnSpoke(y, i);
				})(enumerate(itemys)));
			}
		});
		if (info.grid.style === 'polygen') {
			grids.children('.grid').data(info.cache.gridDatas).attrs({
				vertexes: function(arg) {
					var i, ref3, y1, y2;
					i = arg[0], (ref3 = arg[1], y1 = ref3[0], y2 = ref3[1]);
					return list(map(function(j) {
						return getPointOnSpoke(y2, j);
					})(range(N)));
				}
			});
	
		} else {
			grids.children('.grid').data(info.cache.gridDatas).attrs({
				ratioAnchor: {
					ratiox: 0.5,
					ratioy: 0.5
				},
				radius: function(arg) {
					var i, ref3, y1, y2;
					i = arg[0], (ref3 = arg[1], y1 = ref3[0], y2 = ref3[1]);
					return Math.abs(getPointOnSpoke(y2, 0).y);
				}
			});
		}
		ticks.children('.tick').data(info.rhoAxis.ticks).attrs({
			x: function(y) {
				return getPointOnSpoke(y, 0).x;
			},
			y: function(y) {
				return getPointOnSpoke(y, 0).y;
			}
		});
		return rootNode;
	};
	render = function(info, origin_area, rootNode) {
		build(info, rootNode);
		return layout(info, origin_area, rootNode);
	};
	defaultInteractionEncoding = function(info) {
		var activeItem, activeSeries, getNearbySpoke, inactiveItem, inactiveSeries, incAlpha;
		getNearbySpoke = function(theta) {
			return Math.floor(theta / (2 * Math.PI / info.cache.n) + 0.5) % info.cache.n;
		};
		activeItem = function(nearbyItem) {
			var base, base1, base2, base3, moveInside, ref1, ref2, ref3, ref4, tipBbox;
			$(nearbyItem.elem).attrs({
				shadowBlur: 10,
				shadowColor: incAlpha((ref1 = (ref2 = typeof(base = nearbyItem.elem).strokeStyle === "function" ? base.strokeStyle() : void 0) != null ? ref2 : typeof(base1 = nearbyItem.elem).fillStyle === "function" ? base1.fillStyle() : void 0) != null ? ref1 : {
					r: 0,
					g: 0,
					b: 0
				})
			});
			$(nearbyItem.elem).children('.tip').data([{
				thetaAxisCaption: info.thetaAxis.caption,
				rhoAxisCaption: info.rhoAxis.caption,
				spoke: info.cache.spoke(nearbyItem.data.i),
				series: info.cache.series(nearbyItem.data.index),
				item: info.cache.item(nearbyItem.data.i, nearbyItem.data.index)
			}]).enter().append(MultilineText, {
				kind: 'tip',
				texts: info.tooltip.formatter,
				x: info.tooltip.padding.left,
				y: info.tooltip.padding.top,
				z: 1000,
				styles: [{
					font: {
						size: 12,
						family: "微软雅黑"
					},
					fillStyle: {
						r: 80,
						g: 80,
						b: 80
					},
					lineSpacing: 5
				}]
			}).append(Rect, {
				kind: 'tip-bg',
				x: -info.tooltip.padding.left,
				y: -info.tooltip.padding.top,
				z: -1,
				width: $(nearbyItem.elem).children('.tip').map(function(e) {
					return e.bbox();
				})[0].width + info.tooltip.padding.left + info.tooltip.padding.right,
				height: $(nearbyItem.elem).children('.tip').map(function(e) {
					return e.bbox();
				})[0].height + info.tooltip.padding.top + info.tooltip.padding.bottom,
				fillStyle: {
					r: 255,
					g: 255,
					b: 255,
					a: 1
				},
				strokeStyle: incAlpha((ref3 = (ref4 = typeof(base2 = nearbyItem.elem).strokeStyle === "function" ? base2.strokeStyle() : void 0) != null ? ref4 : typeof(base3 = nearbyItem.elem).fillStyle === "function" ? base3.fillStyle() : void 0) != null ? ref3 : {
					r: 0,
					g: 0,
					b: 0
				})
			});
			tipBbox = $(nearbyItem.elem).children('.tip').map(function(e) {
				return e.bbox();
			})[0];
			log.info(function() {
				return tipBbox;
			});
			log.info(function() {
				return info.layout.area;
			});
			moveInside = moveInsideArea(tipBbox, info.layout.area);
			log.info(function() {
				return moveInside;
			});
			$(nearbyItem.elem).children('.tip').attrs(vec({
				x: info.tooltip.padding.left,
				y: info.tooltip.padding.top
			}).add(moveInside).raw());
			return info.active = nearbyItem;
		};
		inactiveItem = function() {
			if (info.active != null) {
				$(info.active.elem).attrs({
					shadowBlur: 0
				});
				return $(info.active.elem).children('.tip').data([]).exit().remove();
			}
		};
		activeSeries = function(seriesNode) {
			return $(seriesNode).attrs({
				shadowBlur: 10,
				shadowColor: seriesNode.strokeStyle()
			}).children('.area').attrs({
				shadowBlur: 10,
				shadowColor: seriesNode.strokeStyle()
			});
		};
		inactiveSeries = function(seriesNode) {
			return $(seriesNode).attrs({
				shadowBlur: 0
			}).children('.area').attrs({
				shadowBlur: 0
			});
		};
		incAlpha = function(color) {
			if (color == null) {
				return void 0;
			} else {
				return {
					r: color.r,
					g: color.g,
					b: color.b,
					a: 1
				};
			}
		};
		return [{
			selector: (id("serieses")).then(kind("series")),
			interaction: {
				mouseOver: function(ev) {
					return activeSeries(ev.actor);
				},
				mouseOut: function(ev) {
					return inactiveSeries(ev.actor);
				},
				mouseMoved: function(ev) {
					return activeSeries(ev.actor);
				}
			}
		}, {
			selector: (id("serieses")).then(kind("series")).then(kind("area")),
			interaction: {
				mouseOver: function(ev) {
					return activeSeries(ev.actor.parent());
				},
				mouseOut: function(ev) {
					return inactiveSeries(ev.actor.parent());
				},
				mouseMoved: function(ev) {
					return activeSeries(ev.actor.parent());
				}
			}
		}, {
			selector: id("background"),
			interaction: {
				mouseOver: function(ev) {},
				mouseOut: function(ev) {},
				mouseMoved: function(ev) {
					var items, mousePos, n, nearbyItem, ref1, ref2, rho, theta;
					mousePos = {
						x: ev.mouseX,
						y: ev.mouseY
					};
					ref1 = vec(info.layout.center, mousePos).toPolar(), rho = ref1.rho, theta = ref1.theta;
					n = getNearbySpoke(theta);
					items = info.layout.getItemsOnSpoke(n).map(function(e) {
						return {
							x: e.worldX(),
							y: e.worldY(),
							data: e.dynamicAttrs.data,
							elem: e
						};
					});
					nearbyItem = bestOn(function(a) {
						return -vec(a, mousePos).toPolar().rho;
					})(items);
					if (rho > info.layout.radius || (nearbyItem == null)) {
						return inactiveItem();
					} else if (((ref2 = info.active) != null ? ref2.elem : void 0) !== nearbyItem.elem) {
						inactiveItem();
						return activeItem(nearbyItem);
					}
				}
			}
		}];
	};


	/**
	 * 雷达图
	 * @class module:chart/radarchart.RadarChart
	 * @extends module:chart/commonchartbase.CommonChartBase
	 * @param option {Object} 用户配置信息
	 * @description
	 * option
	 *
	 *| 名称           | 类型           | 属性  |  默认值  | 描述  |
	 *| :-------------: |:-------------:| :-----:| :-----:| :-----|
	 *| size      | {width: num, height: num} | optional |{width: 900, height: 560} |图表尺寸区域，用于内部相对布局和约束布局的计算|
	 *| data     | [Object] / Object     |  required | - |图表数据|
	 *| thetaAxis  | [[thetaAxisInfo](#thetaAxisInfo)] |  required |-|极角轴信息|
	 *| rhoAxis  | [[rhoAxisInfo](#rhoAxisInfo)] |  required |-|极径轴信息|
	 *| series  | [[SeriesInfo](#SeriesInfo)]|    optional |-|数据展示图形信息，可在数组中配置多个图形|
	 *| title   | Object |optional | - | 标题信息,参见：[点我](./commonInfo/title.html)|
	 *| legend | Object| optional | - | 图例信息,参见：[点我](./commonInfo/legend.html) |
	 *| tooltip | Object| optional | - | 提示框信息,参见：[点我](./commonInfo/tooltip.html) |
	 *| visualEncoding  | [VisualEncodingItem]|    optional |config中的配置|根据Selection机制进行定制图表样式,参见:[点我](./commonInfo/visualencoder-design.html)|
	 *| interactEncoding  | [InteractEncodingItem]|    optional |config中的配置|根据Selection机制进行定制图表交互,参见:[点我](./commonInfo/interactencoder-design.html)|
	 *| grid             |    String| optional | 设置雷达图的网格式样,"circle"或者"polygen"
	 * @example
	 * option = {
	 *			size: {width:800, height:600},
	 *			data: [
	 *			{subject: "math", xiaoA: 89, xiaoB: 73},
	 *				{subject: "chinese", xiaoA: 80, xiaoB: 91},
	 *				{subject: "english", xiaoA: 71, xiaoB: 79},
	 *			],
	 *			thetaAxis: { //极坐标theta轴（极角轴）
	 *				caption: '科目',
	 *				field: 'subject',
	 *				//offsetAngle: 0 //第一根辐条起始角度
	 *			},
	 *			rhoAxis: {//极坐标rho轴（极径轴）
	 *				caption: '分数',
	 *				tickLabel: function(x){return '' + x + '分';},
	 *				ticks: [40, 70, 100] // 网格密度 （即 同心圆或多边形的数目）
	 *				domainMax: 100,
	 *				domainMin: 10
	 *			},
	 *			series: [
	 *				{
	 *					caption: 'xiaoA各科成绩',
	 *					field: 'xiaoA',
	 *					type: 'line'
	 *				}, {
	 *					caption: 'xiaoB各科成绩',
	 *					field: 'xiaoB',
	 *					type: 'line'
	 *				}
	 *			],
	 *			grid: {
	 *				style: 'circle', // or 'polygen' 表示网格的样式为圆还是多边形
	 *			}
	 *
	 *		}
	 */
	RadarChart = CommonChartBase.extend({
    initialize:function(option)
    {
      this.execProto("initialize",option);
    },
		_preProcessG: function(option)
		{
			var info = preprocess(option);
			info.optionVEs = mParseOptionToVE.parseRadarOption(option);
			return info;
		},
		_buildG: function(root, info) {
			return render(info, {
				x: 0,
				y: 0,
				width: 1000,
				height: 1000
			}, root);
		},
		_layoutG: function(root, info, area) {
			info.graphArea = area;
			return render(info, info.graphArea, root);
		},
		_getLegendItems: function(info) {
			var legendItems = list(map(function(arg) {
				var caption, type;
				caption = arg.caption, type = arg.type;
				return {
					name: caption,
					type: type
				};
			})(info.series));
			console.log("legendItems",legendItems)
			return legendItems;
		},
		_legendClicked: function(root, info, nameObj, opt) {
			var name = nameObj.name;
			info.seriesInfo[name].hidden = !info.seriesInfo[name].hidden;
			return this.updateInfo();
		},
		_getSeriesInfo: function(rootSelection,  option, info) {
			var root = rootSelection.getElement(0, 0);
			var r;
			r = extend(dict($(root).children('.series').map(function(e) {
				var k, ref1;
				return [
					(k = e.dynamicAttrs.data.caption), {
						color: (ref1 = typeof e.strokeStyle === "function" ? e.strokeStyle() : void 0) != null ? ref1 : typeof e.fillStyle === "function" ? e.fillStyle() : void 0,
						hidden: false
					}
				];
			})))(info.seriesInfo);
			return deepcopy(r);
		},
		_updateG: function(root, info) {
			return render(info, info.graphArea, root);
		},
		_applyGDefaultVisualEncoding: function(root, info) {
			var radarVs;
			radarVs = RadarIE.create().next();
			return VisualEncoder.apply(root, radarVs);
		},
		_applyGDefaultInteractEncoding: function(root, info) {
			return InteractEncoder.apply(root, defaultInteractionEncoding(info));
		},
		_getThemeTemplate:function(themeString)
    {
      return radarthemeMap[themeString];
    }
	});
	return RadarChart;
});