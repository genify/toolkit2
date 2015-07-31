/*
 * ------------------------------------------
 * 坐标轴(布局器)
 * @version  0.0.1
 * @author   zjy(zhangjianyi@corp.netease.com)
 * ------------------------------------------
 */
/** @module layouter */
define(['{pro}/libs/colortraits.js',
    '{pro}/tools/assert.js',
    '{pro}/tools/utils.js',
    '{pro}/tools/point.js',
    '{pro}/libs/colorbox.js',
    '{pro}/config/axislabelpolicy.js',
    '{pro}/config/labeladapter.js',
    '{pro}/layouter/layouter.js'
], function(mColortraits, mAssert, mUtils, mPoint, mColorbox, mAxisLabelPolicy, mLabelAdapter, mLayouter) {
    var PRIVATE = mColortraits.PRIVATE;
    var selection = mColorbox.selection;
    var labelPolicy = mAxisLabelPolicy;
    var line = mColorbox.Line;
    var getParentById = function(actor, id) {
            var actorFound = actor;
            do {
                if(actorFound.dynamicProperty("id") === id){
                   return actorFound;
                }
                else{
                    actorFound = actorFound.parent();
                }

            } while (actorFound);

            return actorFound;
        };
    /**
     * 坐标轴(布局器)
     * @class   module:layouter/axislayouter.AxisLayouter
     * @extends module:layouter/layouter.Layouter
     * @return  {AxisLayouter} 坐标轴布局器
     */
    var AxisLayouter = mLayouter.extend({
        /**
         * 初始化
         * @return  {Axis}  返回Axis实例
         */
        initialize: function() {
            //  this._t.set_root(root);
            this._t.set_scale(null);
            this._t.set_orient('bottom');
            this._t.set_defaultOrient({
                top: 1,
                right: 1,
                bottom: 1,
                left: 1
            });
            this._t.set_ticks(10);
            this._t.set_tickValues(null);
            this._t.set_tickFormat(null);
            this._t.set_labelRange(null);

        },
        /**
         * 应用布局设置进行单个轴的布局
         * @method  module:layouter/axislayouter.AxisLayouter#layout
         * @param  {Object} axisInfo - 轴信息
         * @param {Rect} resource - 可用的矩形区域资源
         * @param {Scene} root - series的场景树根节点
         * @return {Object} result - 布局完成之后的布局状态及剩余资源信息
         */
        layout: function(axisInfo, resource, axisSelection) {
            var captionPadding = 6;
            var tickSize = 6;
            var labelPadding = 4;
            var gridEndPadding = axisInfo.gridEndPadding ? 7 : 0;
            var root = axisSelection.getElement(0, 0);
            var orient = axisInfo.position;
            var scale = axisInfo.scale;
            this._t.set_scale(scale);
            this._t.set_root(root);
            this._t.set_id(axisInfo.id);
            this._t.set_orient(orient);
            this._t.set_labelOption(axisInfo.labelOption);
            this._t.set_tickValues(axisInfo.tickValues);
            this._t.set_tickFormat(axisInfo.format);
            this._t.set_orient(axisInfo.position);
            var area = resource;
            var lineAndCaptionWidth = 0;
            var lineAndCaptionHeight = 0;
            var tempHeight = 0;
            var tempWidth = 0;
            var hidden = axisInfo.hidden;
            var caption = axisInfo.caption;
            var captionAlign = caption.align;
            var rotation = caption.rotation;
            var gridEnd = isNaN(axisInfo.gridEnd) ? 0 : axisInfo.gridEnd;
            var labelAndCaptionBbox = {};
            var tempHeight, tempWidth;
            var captionOrient = axisInfo.caption.orient;
            var lastLabelActor;
            var isCaptionHori = (captionOrient === "horizontal");
            var t = 0;
            var outerPadding;
            var axisActor = axisSelection.getElement(0, 0);

            lastLabelActor = this.lastLabelActor();
            //防止最后一个label被截断
            if (scale.rangeBand && scale.step() && lastLabelActor) {
                 var parent = getParentById(root, "cartesian");
                if (axisInfo.isXAxis) {
                    var diff = lastLabelActor.treeBbox().x + lastLabelActor.treeBbox().width - axisInfo.range[1] - parent.worldX();
                } else {
                    var diff = axisInfo.range[1] - (lastLabelActor.treeBbox().y + lastLabelActor.treeBbox().height) + parent.worldY();
                }
                outerPadding = diff / scale.step();
                if (diff > 0) {
                    outerPadding += scale.outerPadding2() + 0.1;
                } else {
                    outerPadding = scale.outerPadding2();
                }

            } else {
                outerPadding = 0;
            }
            scale.rangeBand ? scale.rangeBands(axisInfo.range, 0.1, 0.0, outerPadding) : scale.range(axisInfo.range);
            //可能会需要根据密度动态改变tick数量
            if (axisInfo.tickCount == -1) {
                var ratio = axisInfo.tickDensity;
                if (axisInfo.isXAxis) {
                    scale.ticksCount(Math.round(resource.width * ratio / 100));
                } else {
                    scale.ticksCount(Math.round(resource.height * ratio / 100));
                }
            };
            var tickValues = this._t._tickValues() ?
                this._t._tickValues() :
                (scale.ticks ? scale.ticks() : scale.domain());
            this._t._tickValues(tickValues);

            var onlyLine = tickValues.length === 0 ? true : false;
            //删除由于tick变少而多余的节点
            var tickSel = axisSelection.selectAll(function(actor) {
                return actor.dynamicProperty("kind") == "tick";
            });
            tickSel.data(tickValues).exit().remove();
            var gridSel = axisSelection.selectAll(function(actor) {
                return actor.dynamicProperty("kind") == "grid";
            });
            gridSel.data(tickValues).exit().remove();
            var labelSel = axisSelection.selectAll(function(actor) {
                return actor.dynamicProperty("kind") == "label";
            });
            labelSel.data(tickValues).exit().remove();

            var range = scale.scaleRange(scale);

            this.setrange(range);
            var axisLine = axisSelection.select(function(actor) {
                return actor.dynamicProperty("kind") == "line";
            });
            var axisTicks = axisSelection.select(function(actor) {
                return actor.dynamicProperty("kind") == "ticks";
            });
            var tickActor;

            if (orient === 'left' || orient === 'top') {
                gridEnd = gridEnd - gridEndPadding + t;
            } else {
                gridEnd = gridEnd + gridEndPadding - t;
            }

            this._t.__labelBbox(axisSelection, resource, axisInfo);

            var param = {
                axisLine: axisLine,
                axisSelection: axisSelection,
                range: range,
                isCaptionHori: isCaptionHori,
                scale: scale,
                tickSize: tickSize,
                area: area,
                tickValues: tickValues,
                orient: orient,
                labelPadding: labelPadding,
                captionAlign: captionAlign,
                captionPadding: captionPadding,
                onlyLine: onlyLine,
                gridEnd: gridEnd
            }
            var labelAndCaptionBbox = this._t.__axisLayout(param);
            var t = labelAndCaptionBbox;
            var axisArea = {
                left: t.x,
                right: t.x + t.width,
                top: t.y,
                bottom: t.y + t.height,
                width: t.width,
                height: t.height
            };
            var result = this._t.__remainResource(axisInfo, resource, axisArea);

            if (result.ok) {
                return {
                    ok: true,
                    remainingSpace: result.remainingSpace,
                    info: {
                        treeBbox: axisArea,
                        axisLine: axisLine,
                        axisTicks: axisTicks
                    },
                    scene: axisSelection
                };
            } else {
                return {
                    ok: false,
                    msg: "The givenSpace is not enough",
                    remainingSpace: result.remainingSpace,
                    info: {
                        treeBbox: axisArea,
                        axisLine: axisLine,
                        axisTicks: axisTicks
                    },
                    scene: axisSelection
                };
            }
        },

        __axisLayout: function(paramObj) {
            var tickSize = paramObj.tickSize;
            var minBbox = {};
            var axisLine = paramObj.axisLine;
            var axisSelection = paramObj.axisSelection;
            var range = paramObj.range;
            var orient = paramObj.orient;
            var scale = paramObj.scale;
            var isCaptionHori = paramObj.isCaptionHori;
            var area = paramObj.area;
            var tickValues = paramObj.tickValues;
            var labelPadding = paramObj.labelPadding;
            var captionAlign = paramObj.captionAlign;
            var captionPadding = paramObj.captionPadding;
            var onlyLine = paramObj.onlyLine;
            var gridEnd = paramObj.gridEnd;
            var result = this._t.__initialParam(orient, range, gridEnd,tickSize);
            var dimension = result.dimension;
            var labelHorizRatioAncher = result.labelHorizRatioAncher;
            var labelRotationRatioAncher = result.labelRotationRatioAncher;
            var tickRatioAncher = result.tickRatioAncher;
            var axisStartPoint = result.axisStartPoint;
            var axisEndPoint = result.axisEndPoint;
            var tickStartPoint = result.tickStartPoint;
            var tickEndPoint = result.tickEndPoint;
            var gridStartPoint = result.gridStartPoint;
            var gridEndPoint = result.gridEndPoint;
            var anotherDimension = dimension == "height" ? "width" : "height";
            var lineAndCaptionMinSise = 0;
            var maxlabel = undefined;
            axisLine.setProperty("vertexes", [axisStartPoint, axisEndPoint]);
            lineAndCaptionMinSise += Number(axisLine.property(dimension));
            if (!onlyLine) {
                var tickSel = axisSelection.selectAll(function(actor) {
                    return actor.dynamicProperty("kind") == "tick";
                });
                tickSel.each(function(actor, index) {
                    if (dimension == "height") {
                        actor.setx(scale.exec(tickValues[index]));
                        actor.sety(0);
                    } else {
                        actor.setx(0);
                        actor.sety(scale.exec(tickValues[index]));
                    }
                    actor.setvertexes([tickStartPoint,tickEndPoint])
                    actor.setratioAnchor(tickRatioAncher);
                });
                var gridSel = axisSelection.selectAll(function(actor) {
                    return actor.dynamicProperty("kind") == "grid";
                });
                gridSel.each(function(actor, index) {
                    if (dimension == "height") {
                        actor.setx(scale.exec(tickValues[index]));
                        actor.sety(0);
                    } else {
                        actor.setx(0);
                        actor.sety(scale.exec(tickValues[index]));
                    }
                    actor.setvertexes([gridStartPoint, gridEndPoint]);
                });

                var labelSel = axisSelection.selectAll(function(actor) {
                    return actor.dynamicProperty("kind") == "label";
                });
                labelSel.each(function(actor, index) {
                    if (orient == "bottom") {
                        actor.setx(scale.exec(tickValues[index]));
                        actor.sety(tickSize + labelPadding);
                    } else if (orient == "top") {
                        actor.setx(scale.exec(tickValues[index]));
                        actor.sety(-tickSize - labelPadding);
                    } else if (orient == "left") {
                        actor.setx(-tickSize - labelPadding);
                        actor.sety(scale.exec(tickValues[index]));
                    } else if (orient == "right") {
                        actor.setx(tickSize + labelPadding);
                        actor.sety(scale.exec(tickValues[index]));
                    }
                    var bbox = actor.bbox();
                    if (index == 0) {
                        maxlabel = actor;
                        maxDimension = bbox[dimension];
                    } else {
                        if (maxDimension < bbox[dimension]) {
                            maxlabel = actor;
                            maxDimension = bbox[dimension];
                        }
                    }
                    actor.setratioAnchor((!actor.rotation()) ? labelHorizRatioAncher : labelRotationRatioAncher);
                });
                lastLabelActor = labelSel.getElement(0, labelSel.size() - 1);
                this.setlastLabelActor(lastLabelActor);

            }
            var result = this._t.__calcuCaptionRatioAncher(range, orient, captionAlign, isCaptionHori);
            maxDimension = (maxlabel ? (maxlabel.treeBbox()[dimension] + labelPadding) : 0) + tickSize;
            axisSelection.select(function(actor) {
                return actor.dynamicProperty("kind") == "caption";
            }).each(function(actor, index) {
                var ratioAnchor = result.ratioAnchor;
                if (orient == "bottom") {
                    var y = captionPadding + (maxlabel ? (maxlabel.bbox()[dimension] + labelPadding + tickSize) : tickSize);
                    var x = result.x;
                } else if (orient == "top") {
                    var y = (maxlabel ? -(maxlabel.bbox()[dimension] + tickSize + labelPadding) : -tickSize) - captionPadding;
                    var x = result.x;
                } else if (orient == "right") {
                    var x = captionPadding + (maxlabel ? (maxlabel.bbox()[dimension] + tickSize + labelPadding) : tickSize);
                    var y = result.y;
                } else if (orient == "left") {
                    var x = (maxlabel ? -(maxlabel.bbox()[dimension] + tickSize + labelPadding) : -tickSize) - captionPadding;
                    var y = result.y;
                }
                lineAndCaptionMinSise += captionPadding + ((actor.bbox()[dimension] && actor.bbox()[anotherDimension]) ? actor.bbox()[dimension] : 0);
                maxDimension = maxDimension + captionPadding + ((actor.bbox()[dimension] && actor.bbox()[anotherDimension]) ? actor.bbox()[dimension] : 0);
                actor.setx(x);
                actor.sety(y);
                actor.setratioAnchor(ratioAnchor);
            });
            if (onlyLine) {
                minBbox[dimension] = lineAndCaptionMinSise;
                labelAndCaptionBbox = minBbox;
            } else {
                var root = this._t._root();
                labelAndCaptionBbox = {
                    x: root.treeBbox().x,
                    y: root.treeBbox().y
                };
                labelAndCaptionBbox[dimension] = maxDimension;
                labelAndCaptionBbox[anotherDimension] = root.treeBbox()[anotherDimension];
            }

            if (orient == "bottom") {
                var y = area.bottom - labelAndCaptionBbox.height;
                var x = area.left;
            } else if (orient == "top") {
                var y = area.top + labelAndCaptionBbox.height;
                var x = area.left;
            } else if (orient == "right") {
                var y = area.top;
                var x = area.right - labelAndCaptionBbox.width;
            } else {
                var y = area.top;
                var x = area.left + labelAndCaptionBbox.width;
            }
            axisSelection.setProperty('x', x);
            axisSelection.setProperty('y', y);
            return labelAndCaptionBbox;
        },

        __calcuCaptionRatioAncher: function(range, orient, align, isCaptionHori) {
            if (orient == "bottom" || orient == "top") {
                var ratioy = orient == "bottom" ? 0 : 1;
                switch (align) {
                    case "middle":
                        var x = (range[0] + range[1]) / 2;
                        ratioAnchor = {
                            ratiox: 0.5,
                            ratioy: ratioy
                        };
                        break;
                    case "high":
                        var x = range[1];
                        ratioAnchor = {
                            ratiox: 1,
                            ratioy: ratioy
                        };
                        break;
                    case "low":
                        var x = range[0];
                        ratioAnchor = {
                            ratiox: 0,
                            ratioy: ratioy
                        };
                        break;
                }

            } else {
                var ratiox = orient == "left" ? 1 : 0;
                var verticalRatioy = ratiox;
                switch (align) {
                    case "middle":
                        var y = (range[0] + range[1]) / 2;
                        ratioAnchor = isCaptionHori ? {
                            ratiox: ratiox,
                            ratioy: 0.5
                        } : {
                            ratiox: 0.5,
                            ratioy: verticalRatioy
                        };
                        break;
                    case "high":
                        var y = range[0];
                        ratioAnchor = isCaptionHori ? {
                            ratiox: ratiox,
                            ratioy: 0
                        } : {
                            ratiox: 1,
                            ratioy: verticalRatioy
                        };
                        break;
                    case "low":
                        var y = range[1];
                        ratioAnchor = isCaptionHori ? {
                            ratiox: ratiox,
                            ratioy: 1
                        } : {
                            ratiox: 0,
                            ratioy: verticalRatioy
                        };
                        break;
                }
            }
            return {
                ratioAnchor: ratioAnchor,
                x: x,
                y: y

            }
        },

        __initialParam: function(orient, range, gridEnd,tickSize) {
            var dimension;
            var anotherDimension;
            var labelHorizRatioAncher;
            var labelRotationRatioAncher;
            var axisStartPoint;
            var axisEndPoint;
            var gridStartPoint;
            var gridEndPoint;
            var tickRatioAncher;
            var tickStartPoint;
            var tickEndPoint;
            var result = {};

            if (orient == "bottom") {
                dimension = "height";
                labelHorizRatioAncher = {
                    ratiox: 0.5,
                    ratioy: 0
                };
                labelRotationRatioAncher = {
                    ratiox: 1,
                    ratioy: 0
                };
                tickRatioAncher = {
                    ratiox: 0,
                    ratioy: 0
                };
                axisStartPoint = mPoint(range[0], 0);
                axisEndPoint = mPoint(range[1], 0);
                gridStartPoint = mPoint(0, 0);
                gridEndPoint = mPoint(0, gridEnd);
                tickStartPoint = mPoint(0,0);
                tickEndPoint = mPoint(0,tickSize);

            } else if (orient == "top") {
                dimension = "height";
                labelHorizRatioAncher = {
                    ratiox: 0.5,
                    ratioy: 1
                };
                labelRotationRatioAncher = {
                    ratiox: 1,
                    ratioy: 1
                };
                tickRatioAncher = {
                    ratiox: 0,
                    ratioy: 1
                };
                axisStartPoint = mPoint(range[0], 0);
                axisEndPoint = mPoint(range[1], 0);
                gridStartPoint = mPoint(0, 0);
                gridEndPoint = mPoint(0, gridEnd);
                tickStartPoint = mPoint(0,0);
                tickEndPoint = mPoint(0,-tickSize);

            } else if (orient == "left") {
                dimension = "width";
                labelHorizRatioAncher = {
                    ratiox: 1,
                    ratioy: 0.5
                };
                labelRotationRatioAncher = {
                    ratiox: 1,
                    ratioy: 1
                };
                tickRatioAncher = {
                    ratiox: 0,
                    ratioy: 0
                }
                axisStartPoint = mPoint(0, range[0]);
                axisEndPoint = mPoint(0, range[1]);
                gridStartPoint = mPoint(0, 0);
                gridEndPoint = mPoint(gridEnd, 0);
                tickStartPoint = mPoint(0,0);
                tickEndPoint = mPoint(-tickSize,0);
            } else if (orient == "right") {
                dimension = "width";
                labelHorizRatioAncher = {
                    ratiox: 0,
                    ratioy: 0.5
                };
                labelRotationRatioAncher = {
                    ratiox: 0,
                    ratioy: 1
                };
                tickRatioAncher = {
                    ratiox: -0.5,
                    ratioy: 0
                }
                axisStartPoint = mPoint(0, range[0]);
                axisEndPoint = mPoint(0, range[1]);
                gridStartPoint = mPoint(0, 0);
                gridEndPoint = mPoint(gridEnd, 0);
                tickStartPoint = mPoint(0,0);
                tickEndPoint = mPoint(tickSize,0);
            }
            result.dimension = dimension;
            result.labelHorizRatioAncher = labelHorizRatioAncher;
            result.labelRotationRatioAncher = labelRotationRatioAncher;
            result.axisStartPoint = axisStartPoint;
            result.axisEndPoint = axisEndPoint;
            result.gridStartPoint = gridStartPoint;
            result.gridEndPoint = gridEndPoint;
            result.tickRatioAncher = tickRatioAncher;
            result.tickStartPoint = tickStartPoint;
            result.tickEndPoint = tickEndPoint;
            return result;
        },

        /**
         * 计算留给legend和坐标系的区域
         * @protected
         * @method  module:layouter/axislayouter.AxisLayouter#__remainResource
         * param {Object} axisInfo - axis信息
         * param {area} area - 用户设置的区域
         * param {area} axisArea - title的colorBbox区域
         * @return  {area}   - 返回剩下的区域
         */
        __remainResource: function(axisInfo, area, axisArea) {
            var remainingSpace;
            if (!axisArea || axisInfo.position == 'center') {
                remainingSpace = area;
            } else if (axisInfo.position == 'top') {
                remainingSpace = {
                    left: area.left,
                    right: area.width,
                    top: area.top + axisArea.height,
                    bottom: area.bottom,
                    width: area.width,
                    height: area.height - axisArea.height
                };
            } else if (axisInfo.position == 'bottom') {
                remainingSpace = {
                    left: area.left,
                    right: area.right,
                    top: area.top,
                    bottom: area.bottom - axisArea.height,
                    width: area.width,
                    height: area.height - axisArea.height
                };
            } else if (axisInfo.position == 'left') {
                remainingSpace = {
                    left: area.left + axisArea.width,
                    right: area.right,
                    top: area.top,
                    bottom: area.bottom,
                    width: area.width - axisArea.width,
                    height: area.height
                };
            } else if (axisInfo.position == 'right') {
                remainingSpace = {
                    left: area.left,
                    right: area.right - axisArea.width,
                    top: area.top,
                    bottom: area.bottom,
                    width: area.width - axisArea.width,
                    height: area.height
                };
            }
            if ((remainingSpace.left - area.left > -1) && (remainingSpace.right - area.right < 1) && (remainingSpace.bottom - area.bottom < 1) && (remainingSpace.top - area.top > -1)) {
                return {
                    ok: true,
                    remainingSpace: remainingSpace
                };
            } else {
                return {
                    ok: false,
                    remainingSpace: remainingSpace
                };
            }
        },



        /**
         * 布局axis的label，做了label的自适应布局
         * @method  module:layouter/axislayouter.AxisLayouter#__labelBbox
         * @param   {Object} area - label可放置的区域
         * @return  {Object} labelarea- label所占的区域
         */
        __labelBbox: function(axisSelection, area, axisInfo) {
            var range = this._t.range();
            var xpercent = 1 / 5,
                ypercent = 1 / 6;
            var isCategory = axisInfo.isCategory; //是否为类目轴
            var scale = axisInfo.scale;
            var tickFormat = this._t._tickFormat();
            var orient = this._t._orient();
            var range = this.range();
            var maxlabel = null;
            var maxWidth;
            var ticklength = 0;
            var tickSelection = axisSelection.select(function(actor) {
                if (actor.dynamicProperty("kind") === "tick") {
                    var vertexes = actor.vertexes();
                    ticklength = Math.max(Math.abs(vertexes[0].x - vertexes[1].x), Math.abs(vertexes[0].y - vertexes[1].y));
                }
            });
            var labelSelection = axisSelection.selectAll(function(actor) {
                return actor.dynamicProperty("kind") === "label";
            }).each(function(actor, index) {
                var data = actor.dynamicProperty("data");
                data = isCategory ? scale.getCategoryByIndex(data) : data;
                actor.settext(tickFormat(data));
                actor.setDynamicProperty("originTexts", tickFormat(data) + '');
                actor.setrotation(0);
                actor.setmaxWidth(Infinity);
                var bbox = actor.bbox();
                if (index == 0) {
                    maxlabel = actor;
                    maxWidth = bbox.width;
                } else {
                    if (maxWidth < bbox.width) {
                        maxlabel = actor;
                        maxWidth = bbox.width;
                    }
                }
            });
            var maxbbox;
            maxbbox = maxlabel == null ? {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            } : maxlabel.bbox();

            var labelsBbox = {
                ticklength: ticklength
            };
            switch (orient) {
                case "bottom":
                    if (labelSelection.size() && maxbbox.width > Math.abs(range[1] - range[0]) / (labelSelection.size() + 0.5)) {
                        var labelarea = {
                            x: area.left,
                            y: area.bottom,
                            width: Math.abs(range[1] - range[0]),
                            height: area.height * xpercent
                        };
                        this._t.__execXLabel(labelSelection, maxlabel, labelarea);
                    }

                    break;
                case "top":
                    if (labelSelection.size() && maxbbox.width > Math.abs(range[1] - range[0]) / (labelSelection.size() + 0.5)) {
                        var labelarea = {
                            x: range[0],
                            y: area.top,
                            width: Math.abs(range[1] - range[0]),
                            height: -area.height * xpercent
                        };
                        this._t.__execXLabel(labelSelection, maxlabel, labelarea);
                    }
                    break;
                case "left":
                    if (maxbbox.width > area.width * ypercent && maxbbox.width > 30) {
                        var labelarea = {
                            x: area.left,
                            y: range[0],
                            width: area.width * ypercent,
                            height: Math.abs(range[1] - range[0])
                        }
                        this._t.__execYLabel(labelSelection, maxlabel, labelarea);
                    }
                    break;
                case "right":
                    if (maxbbox.width > area.width * ypercent && maxbbox.width > 30) {
                        var labelarea = {
                            x: area.right,
                            y: range[0],
                            width: area.width * ypercent,
                            height: Math.abs(range[1] - range[0])
                        }
                        this._t.__execYLabel(labelSelection, maxlabel, labelarea);
                    }
                    break;
            }

        },
        __execXLabel: function(labelSelection, maxlabel, labelarea) {
            var scaletype = this._t._scale().type;
            var label0_x = scaletype == "linear" ? 0 : labelarea.width / (labelSelection.size() + 1) / 2;

            var interwidth = labelarea.width / (labelSelection.size() + 2);
            var width = interwidth;
            var judge = {
                width: width,
                height: labelarea.height,
                rotationWidth: 1.7 * width
            };

            var labelOption = this._t._labelOption();
            var labelAdapter = new mLabelAdapter();
            labelAdapter.configLabelAdapter(labelOption);
            var adaptiveLabel = labelAdapter.tryAdaptLabel.call(labelAdapter, labelSelection, maxlabel, judge);
        },
        __execYLabel: function(labelSelection, maxlabel, labelarea) {
            var scaletype = this._t._scale().type;
            var tickInterSpace = labelarea.height / (labelSelection.size() + 1.5);
            var label0_y = scaletype == "linear" ? 0 : labelarea.height / (labelSelection.size() + 1) / 2;
            var judge = {
                width: labelarea.width + 1,
                height: tickInterSpace,
                rotationHeight: 2 * tickInterSpace
            }

            var labelOption = this._t._labelOption();
            var labelAdapter = new mLabelAdapter();
            labelAdapter.configLabelAdapter(labelOption);
            var adaptiveLabel = labelAdapter.tryAdaptLabel.call(labelAdapter, labelSelection, maxlabel, judge);

        },
        __tryAdaptLabel: function(policyArray) {
            return function(labelSelection, maxlabel, judge) {
                for (var i = 0, len = policyArray.length; i < len; ++i) {
                    if (policyArray[i].condition(maxlabel, judge)) {
                        return policyArray[i].adaptLabel(labelSelection, maxlabel, judge); //返回真实布局的高度
                    }
                }
                return Math.abs(height);
            };
        },


        /**
         * 获取Scale实例
         * @method  module:layouter/axislayouter.AxisLayouter#scale
         * @return  {Axis | Scale} - Scale实例
         */
        scale: function(scaleValue) {
            return this._t._scale();
        },

        /**
         * 获取轴的显示文本刻度值
         * @method  module:layouter/axislayouter.AxisLayouter#tickValues
         * @return  {Array} - 轴label的字符数组
         */
        tickValues: function(ticksArr) {
            return this._t._tickValues();
        },

        /**
         * 获取轴id
         * @method  module:layouter/axislayouter.AxisLayouter#id
         * @return  {string} - 轴的id
         */
        id: function(id) {
            return this._t._id();
        },

        /**
         * 获取轴的方位信息
         * @method  module:layouter/axislayouter.AxisLayouter#orient
         * @return  {string} - 轴的朝向
         */
        orient: function() {
            return this._t._orient();
        },


        /**
         * 获取轴的root
         * @method  module:layouter/axislayouter.AxisLayouter#root
         * @return  {Object} - 轴的精灵节点
         */
        root: function() {
            return this._t._root();
        },


        __getAxisLayoutById: function(ais, id) {
            //根据id（string || number）获取轴的信息
            var ai;
            if (typeof(id) === "number" && id >= 0 && id < ais.length) {
                ai = ais[id];
            } else if (typeof(id) === "string") {
                for (var i = 0; i < ais.length; i++) {
                    if (ais[i].id() === id) {
                        ai = ais[i];
                    }
                };
            }
            mAssert(ai, "can not find axis:" + id);
            return ai;
        },


    }, [PRIVATE("_scale"), PRIVATE("_orient"), PRIVATE("_defaultOrient"), PRIVATE("_ticks"),
        PRIVATE("_tickValues"), PRIVATE("_tickFormat"), PRIVATE("_labelOption"), PRIVATE("_labelRange"), PRIVATE("_root"), PRIVATE("_hidden"), PRIVATE("_caption"),
        PRIVATE("_id"), "range", 'maxbbox', "lastLabelActor"
    ]);

    return AxisLayouter;
});