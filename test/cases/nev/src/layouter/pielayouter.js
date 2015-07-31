/*
 * ------------------------------------------
 * 饼状|环状(布局器)
 * @version  0.0.1
 * @author   zjy(zhangjianyi@corp.netease.com)
 * ------------------------------------------
 */
/** @module layouter */
define(['{pro}/libs/colortraits.js',
    '{pro}/libs/colorbox.js',
    '{pro}/tools/assert.js',
    '{pro}/tools/utils.js',
    '{pro}/tools/point.js',
    '{pro}/tools/sum.js',
    '{pro}/tools/fitArea.js',
    '{pro}/layouter/layouter.js'
], function(mColortraits, mColorbox, mAssert, mUtils, mPoint, mSum, mFitArea, mLayouter) {
    var PRIVATE = mColortraits.PRIVATE;
    var ContainerSprite = mColorbox.ContainerSprite;
    var selection = mColorbox.selection;
    var constraintData = [];
    getInitArea = function(startAngle, endAngle, r) {
        //需要的点
        //1.startAngle的点
        //2.endAngle的点
        //3.startAngle和endAngle之间90度整数倍的点
        var angleArray = [];
        var k;
        var left = 0,
            right = 0,
            top = 0,
            bottom = 0;
        //console.log('startAngle:',startAngle,', endAngle:',endAngle);
        if (startAngle < 0) {
            k = parseInt(-startAngle / 360);
            startAngle += 360 * (k + 1);
            endAngle += 360 * (k + 1);
        }
        //var flagAngle = 0;
        angleArray.push(startAngle, endAngle);
        if (startAngle % 90 === 0) {
            var flagAngle = startAngle + 90;
            while (flagAngle < endAngle) {
                angleArray.push(flagAngle);
                flagAngle += 90;
            }
        } else {
            k = Math.ceil(startAngle / 90);
            var flagAngle = 90 * k;
            while (flagAngle < endAngle) {
                angleArray.push(flagAngle);
                flagAngle += 90;
            }
        }
        var angle, sin, cos, newLen;
        for (var i = 0; i < angleArray.length; i++) {
            angle = angleArray[i] / 180 * Math.PI;
            sin = Math.sin(angle);
            cos = Math.cos(angle);
            if (cos >= 0) {
                newLen = r * cos;
                right = Math.max(newLen, right);
            } else {
                newLen = r * cos;
                left = Math.min(newLen, left);
            };
            if (sin >= 0) {
                newLen = r * sin;
                bottom = Math.max(newLen, bottom);
            } else {
                newLen = r * sin;
                top = Math.min(newLen, top);
            }
        };
        //console.log('===============',{top:top,bottom:bottom,left:left,right:right,width:right-left,height:top-bottom});
        return {
            top: top,
            bottom: bottom,
            left: left,
            right: right,
            width: right - left,
            height: top - bottom
        };
    }
    var solveProblem2 = function(r) {

        var layoutData = constraintData;
        if (layoutData.length <= 0) {
            return {
                top: -r - 10,
                bottom: r + 10,
                left: -r - 10,
                right: r + 10,
                width: 2 * r + 20,
                height: 2 * r + 20,
                x: left,
                y: top
            };
        }
        var area = getInitArea(layoutData[0].startAngleDegree, layoutData[0].endAngleDegree, r);
        // console.log(area);
        var top = area.top - 10,
            bottom = area.bottom + 10,
            left = area.left - 10,
            right = area.right + 10;
        //position在内部或者layoutData没有数据
        if (layoutData[0].position === "inner") {
            return {
                top: top,
                bottom: bottom,
                left: left,
                right: right,
                width: right - left,
                height: bottom - top,
                x: left,
                y: top
            };
        }


        var sin, cos, newLen, info;
        for (var i = 0; i < layoutData.length; i++) {
            info = layoutData[i];
            cos = Math.cos(info.averageAngle);
            sin = Math.sin(info.averageAngle);
            if (cos >= 0) {
                newLen = r * cos + info.annotationLead + info.textInfo.width;
                right = Math.max(right, newLen);
            } else {
                newLen = r * cos - info.annotationLead - info.textInfo.width;
                left = Math.min(left, newLen);
            };
            if (sin >= 0) {
                newLen = (r + info.annotationLead) * sin + info.textInfo.height;
                bottom = Math.max(bottom, newLen);
            } else {
                newLen = (r + info.annotationLead) * sin - info.textInfo.height;
                top = Math.min(top, newLen);
            };
        };
        return {
            top: top,
            bottom: bottom,
            left: left,
            right: right,
            width: (right - left),
            height: (bottom - top),
            x: left,
            y: top
        };
    };
    var solveProblem1 = function(area) {
        return mFitArea(area, solveProblem2, [0, area.height], 0.1);
    };
    /**
     * 饼状|环状(布局器)
     * @class   module:layouter/pielayouter.PieLayouter
     * @extends module:layouter/layouter.Layouter
     * @return  {PieLayouter} 饼状|环状布局器
     */
    var PieLayouter = mLayouter.extend({
        /**
         * 应用布局设置或更新布局属性并返回布局数据
         * @method  module:layout/pie.Pie#exec
         * @example
         * var pieLayouter = mPieLayouter.create()
         *   .rootSel(rootSelection)
         *   .pieInfo(pieInfo)
         *   .pieResource(area);
         */
        exec: function() {
            var pieInfo = this._t._pieInfo();
            var seriesInfos = pieInfo.seriesInfos;
            var rootSelection = this._t._rootSelection();
            var resource = this._t._resource();
            var gap = pieInfo.gap;
            var rWeight = pieInfo.rWeight;
            var rWeightSum = mSum(rWeight);
            var layoutData = [];
            var emphasisActor;
            if (pieInfo.emphasis) {
                emphasisActor = rootSelection.selectAll(function(actor) {
                    return actor.dynamicProperty("kind") === "emphasis";
                }).getElement(0, 0);
            }

            if (pieInfo.seriesInfos.length <= 0) {
                return;
            }
            //通过最外围的点来解决约束布局的问题
            this._t.__processInfoOfLastPie(pieInfo, resource);
            var solver = solveProblem1(resource);
            // console.log('solver: ', solver);
            //如果用户指定半径大小
            if (pieInfo.outerRadius > 0) {
                solver[0] = pieInfo.outeRadius;
            }
            //如果用户指定圆心
            if (pieInfo.center != -1) {
                solver[1].x = pieInfo.center[0];
                solver[1].y = pieInfo.center[1];
            }
            if (emphasisActor) {
                var emphasisRaduis = pieInfo.emphasis.radius == -1? 40: pieInfo.emphasis.radius;
                emphasisActor.setDynamicProperty("radius", emphasisRaduis);
                emphasisActor.setx(solver[1].x);
                emphasisActor.sety(solver[1].y);
                emphasisActor.setratioAnchor({
                    ratiox: 0.5,
                    ratioy: 0.5
                });
                   // emphasisActor.setstyles([{font:{style: "normal",size:25,family: "Arial"}},{font:{style: "normal",size:10,family: "Arial"}}]);
                emphasisActor.setlineStyle(0, {
                    align: pieInfo.emphasis.align
                });
            }
            //******************************
            //计算布局数据半径，考虑legend隐藏布局自适应变化的情况
            var realWeight = [];
            var No = [];
            var realSeriesInfos = [];
            for (var i = 0; i < seriesInfos.length; i++) {
                if (!seriesInfos[i].hidden) {
                    No.push(i);
                    realSeriesInfos.push(seriesInfos[i]);
                    realWeight.push(rWeight[i]);
                }
            };
            var rWeightSum = mSum(realWeight);
            var seriesesLen = realWeight.length;
            var innerR = pieInfo.innerRadius < 0 ? 0:pieInfo.innerRadius;
            var remainR = solver[0] - innerR - (seriesesLen-1) * gap;
            for (var i = 0; i < realWeight.length; i++) {
                var width = realWeight[i] / rWeightSum * remainR;
                seriesInfos[No[i]].radius = [innerR, innerR + width];
                seriesInfos[No[i]].center = solver[1];
                innerR = innerR + width + gap;

            };
            for (var i = 0; i < seriesInfos.length; i++) {
                layoutData.push(this._t.__calculateSeries(seriesInfos[i]));
            };
            // console.log(layoutData);
            this._t.__applyScene(layoutData, seriesInfos);
        },
        __calculateSeries: function(seriesInfo) {
            if (seriesInfo.hidden) {
                return [];
            }
            var layoutData = [];

            var valueData = seriesInfo.valueData;
            var annotationData = seriesInfo.annotationData;
            var yData = [],xData = [], ratio = [];
            for (var i = 0; i < valueData.length; i++) {
                yData.push(valueData[i].data);
                xData.push(annotationData[i].data);
                ratio.push(valueData[i].ratio);
            };

            var rose = seriesInfo.rose;

            var center = seriesInfo.center;

            var leadValue = seriesInfo.annotationLead;

            var position = seriesInfo.position;

            var radiusRange = seriesInfo.radius;

            var angleRange = seriesInfo.angle;

            var totalAngle = Math.abs(angleRange[1] - angleRange[0]);

            var sAngle = angleRange[0];
            
            var eAngle = 0;

            var wholeAngle = Math.abs(angleRange[1] - angleRange[0]);

            //var totalValue = mSum(yData);

            var maxValue = Math.max.apply(null, yData);

            var ratioValue = 0;

            var reformRose = function(ratio, radius) {
                var arr = [];
                arr[0] = radius[0];
                arr[1] = (radius[1] - radius[0]) * 2 / 3 * ratio + (radius[1] - radius[0]) / 3;
                return arr;
            };

            for (var i = 0; i < yData.length; i++) {
                //ratioValue = yData[i] / totalValue;
                ratioValue = ratio[i];
                eAngle = sAngle + (totalAngle) * (ratioValue);
                if (rose) var roseRadius = reformRose(yData[i] / maxValue, radiusRange);
                var _ar = roseRadius ? roseRadius[1] : radiusRange[1];
                var rOuter = roseRadius ? roseRadius[1] : radiusRange[1];
                var rInner = roseRadius ? roseRadius[0] : radiusRange[0];

                var ag = ((eAngle - sAngle) / 2 + sAngle) / 180 * Math.PI;
                var cos = Math.cos(ag);
                var sin = Math.sin(ag);
                var tx, ty, px, py, cable;
                if (position == 'outer') {
                    tx = cos * (_ar) + center.x;
                    ty = sin * (_ar) + center.y;

                    px = cos < 0 ? tx - leadValue : tx + leadValue;
                    py = ty + sin * leadValue;
                    cable = [mPoint(tx, ty), mPoint(tx + cos * leadValue, ty + sin * leadValue), mPoint(px, py)];
                } else {
                    px = center.x + cos * ((rOuter - rInner) / 2 + rInner);
                    py = center.y + sin * ((rOuter - rInner) / 2 + rInner);
                    cable = [];
                }
                layoutData.push({
                    center: mPoint(center.x, center.y),
                    startAngle: sAngle / 180 * Math.PI,
                    endAngle: eAngle / 180 * Math.PI,
                    radius: roseRadius || radiusRange,
                    cable: cable,
                    ratio: ratioValue,
                    annotation: {
                        x: px,
                        y: py,
                        text: xData[i] || "",
                        annotation: seriesInfo.annotation
                    }
                });
                sAngle = eAngle;
            }
            // console.log(layoutData);
            return layoutData;
        },
        //处理最外围的圆环数据
        __processInfoOfLastPie: function(pieInfo, resource) {
            // console.log('************__processInfoOfLastPie****************');
            var seriesInfo;
            var seriesInfos = pieInfo.seriesInfos;
            for (var i = seriesInfos.length - 1; i >= 0; i--) {
                if (!seriesInfos[i].hidden && seriesInfos[i].valueData.length > 0) {
                    seriesInfo = seriesInfos[i];
                    break;
                }
            };
            //没有需要显示的series,找不到seriesInfo
            if (seriesInfo === undefined) {
                constraintData = [];
                return;
            }
            //var seriesInfo = pieInfo.seriesInfos[pieInfo.seriesInfos.length-1];
            var seriesSel = seriesInfo.sceneSelection;
            var valueData = seriesInfo.valueData;
            var annotationData = seriesInfo.annotationData;
            var yData = [],xData = [],ratio = [];
            for (var i = 0; i < valueData.length; i++) {
                yData.push(valueData[i].data);
                xData.push(annotationData[i].data);
                ratio.push(valueData[i].ratio);
            };

            var annotationLead = seriesInfo.annotationLead;
            var sAngle = seriesInfo.angle[0];
            var eAngle;
            var totalAngle = Math.abs(seriesInfo.angle[1] - seriesInfo.angle[0]);

            //var totalValue = mSum(yData);
            var maxValue = Math.max.apply(null, yData);

            var ratioValue = 0;
            var layoutData = [];


            for (var i = 0; i < yData.length; i++) {
                //ratioValue = yData[i] / totalValue;
                ratioValue = ratio[i];
                eAngle = sAngle + totalAngle * ratioValue; //角度，还需要转换为弧度
                var agAngle = (sAngle + eAngle) / 2;
                layoutData.push({
                    startAngle: (sAngle / 360) * 2 * Math.PI,
                    startAngleDegree: seriesInfo.angle[0],
                    endAngle: (eAngle / 360) * 2 * Math.PI,
                    endAngleDegree: seriesInfo.angle[1],
                    averageAngle: (agAngle / 360) * 2 * Math.PI,
                    value: yData[i],
                    annotation: xData[i],
                    annotationLead: annotationLead,
                    position: seriesInfo.position
                });
                sAngle = eAngle;
            };
            var annotationSel = seriesSel.selectAll(function(actor) {
                return actor.dynamicProperty('kind') == 'annotation';
            });
            annotationSel.each(function(actor, index) {
                actor.settext(xData[index]);
                layoutData[index].textInfo = {
                    width: actor.width(),
                    height: actor.height()
                };
            });
            constraintData = layoutData;
        },
        /**
         * 获取或设置需要的原始pie数据
         * @method  module:layout/pielayouter.Pie#pieInfo
         * @param   {Object} info - pie图的原始数据 
         * @return  {Pie | Object} - 当参数为空时返回原始数据否则返回Pie实例
         */
        pieInfo: function(info) {
            if (!info) return this._t._pieInfo();
            mAssert(mUtils.isObject(info), "pieInfo : parameter types error");
            this._t.set_pieInfo(info);
            return this;
        },
        pieResource: function(resource) {
            if (!resource) return this._t._resource();
            mAssert(mUtils.isObject(resource), "pie resource : parameter types error");
            this._t.set_resource(resource);
            return this;
        },
        rootSel: function(rootSel) {
            if (!rootSel) return this._t._rootSelection();
            this._t.set_rootSelection(rootSel);
            return this;
        },
        /**
         * 应用场景节点布局
         * @method  module:layouter/pielayouter.Pie#__applyScene
         * @param   {Object} layoutData - bar的布局数据
         * @param   {Selection} seriesInfos - pie的series信息
         * @return  {Void}
         */
        __applyScene: function(layoutData, seriesInfos) {
            // console.log('layoutData: ',layoutData);
            // console.log('seriesInfos: ',seriesInfos);
            for (var i = seriesInfos.length - 1; i >= 0; i--) {
                var seriesInfo = seriesInfos[i];
                var layout = layoutData[i];
                if (seriesInfo.hidden) {
                    continue;
                }
                //console.log('*************************************',seriesInfo.name);
                var seriesSel = seriesInfo.sceneSelection;

                var annulusSel = seriesSel.selectAll(function(actor) {
                    return actor.dynamicProperty('kind') == "pie";
                });

                annulusSel.each(function(actor, index) {
                    var data = layout[index];
                    actor.setx(data.center.x);
                    actor.sety(data.center.y);
                    actor.setProperty('startAngle', data.startAngle);
                    actor.setProperty('endAngle', data.endAngle);
                    actor.setProperty('innerradius', data.radius[0]);
                    actor.setProperty('outerradius', data.radius[1]);
                });

                var leadSel = seriesSel.selectAll(function(actor) {
                    return actor.dynamicProperty('kind') == 'lead';
                });

                leadSel.each(function(actor, index) {
                    var data = layout[index];
                    actor.setProperty('vertexes', data.cable);
                });

                var annotationSel = seriesSel.selectAll(function(actor) {
                    return actor.dynamicProperty('kind') == 'annotation';
                });

                annotationSel.each(function(actor, index) {
                    var data = layout[index];
                    actor.setProperty('text', data.annotation.text);
                    if (data.annotation.x > data.center.x) {
                        actor.setratioAnchor({
                            ratiox: 0,
                            ratioy: 0.5
                        });
                    } else {
                        actor.setratioAnchor({
                            ratiox: 1,
                            ratioy: 0.5
                        });
                    };
                    if (seriesInfo.position == 'inner')
                        actor.setratioAnchor({
                            ratiox: 0.5,
                            ratioy: 0.5
                        });
                    actor.setx(data.annotation.x);
                    actor.sety(data.annotation.y);
                });
            };
        },
    }, [PRIVATE("_resource"),
        PRIVATE("_pieInfo"),
        PRIVATE("_rootSelection")
    ]);
    return PieLayouter;
});