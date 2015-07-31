/*
 * ------------------------------------------
 * 散点|气泡(布局器)
 * @version  0.0.1
 * @author   zjy(zhangjianyi@corp.netease.com)
 * ------------------------------------------
 */
/** @module layouter */
define(['{pro}/libs/colortraits.js',
        '{pro}/tools/assert.js',
        '{pro}/tools/utils.js',
        '{pro}/tools/point.js',
        '{pro}/tools/sum.js',
        '{pro}/scale/linear.js',
        '{pro}/libs/colorbox.js',
        '{pro}/layouter/layouter.js'],function(mColortraits,mAssert,mUtils,mPoint,mSum,mLinear,mColorbox,mLayouter){
    var PRIVATE = mColortraits.PRIVATE;
    var selection = mColorbox.selection;
    /**
     * 散点|气泡(布局器)
     * @class   module:layouter/scatterlayouter.ScatterLayouter
     * @extends module:layouter/layouter.Layouter
     * @return  {ScatterLayouter} 散点(气泡)布局器
     */
    var ScatterLayouter = mLayouter.extend({
        /**
         * 应用布局设置进行散点图series的布局
         * @method  module:layouter/scatterlayouter.ScatterLayouter#layout
         * @param  {seriesInfo} seriesInfo - series信息
         * @param {Rect} resource - 可用的矩形区域资源
         * @param {Selection} seriesesSelection - series的场景树根节点selection
         * @return {Object} result - 布局完成之后的布局状态及剩余资源信息
         */
        layout : function(seriesInfo, resource, seriesesSelection){

            var layoutData = [];

            var xScale = seriesInfo.hAxisScale;

            var yScale = seriesInfo.vAxisScale;

            var xData  = seriesInfo.xData;

            var yData  = seriesInfo.yData;

            var length = xData ? xData.length : (yData ? yData.length : 0);
                        
            var sizeValues = seriesInfo.size;
            
            if(sizeValues){
                var linear = mLinear.create()
                            .domain([Math.min.apply(null,sizeValues),Math.max.apply(null,sizeValues)])
                            .range([0.1,1]);
                linear.ticks();
            }
            
            for(var i = 0;i < length;i++){
                var xValue = xData ? xData[i] : 0;
                var yValue = yData ? yData[i] : 0;
                var rValue;
                var pValue;
                var ratio;
                if(yScale && !xScale){
                    rValue = yValue;
                    pValue = mPoint(0,yScale.exec(rValue));
                }else if(xScale && !yScale){
                    rValue = xValue;
                    pValue = mPoint(xScale.exec(rValue),0);
                }else if(xScale && yScale){
                    if(xScale.rangeBand && !yScale.rangeBand){
                        rValue = yValue;
                        pValue = mPoint(xScale.exec(xValue.id),yScale.exec(yValue.data));
                    }else if(!xScale.rangeBand && yScale.rangeBand){
                        rValue = xValue;
                        pValue = mPoint(xScale.exec(xValue.data), yScale.exec(yValue.id));
                    }else if(!xScale.rangeBand && !yScale.rangeBand){
                        rValue = seriesInfo.monotonicAxis === "Y"? yValue:xValue;
                        pValue = mPoint(xScale.exec(xValue.data),yScale.exec(yValue.data));
                    }
                }
                ratio = linear ? linear.exec(sizeValues[i]) : 1;
                layoutData.push({value : rValue, point : pValue, ratio : Math.abs(ratio)});
            }
          this._t.__applyScene(layoutData,seriesesSelection);
          return {ok: true,
									remainingSpace: resource,
									info: [],
									scene: seriesesSelection};            
        },

        /**
         * 应用场景节点布局
         * @method  module:layouter/scatterlayouter.ScatterLayouter#__applyScene
         * @param   {Object} layoutData - scatter的布局器数据
         * @param   {Selection} seriesesSelection - scatter场景根节点selection
         * @return  {Void}
         */
        __applyScene: function(layoutData, seriesesSelection){

            seriesesSelection.selectAll(function(actor){
                                        return actor.dynamicProperty("kind") == "text";
                                    })
                         .each(function(actor, index) {
                            var data = layoutData[index];
                            actor.setDynamicProperty("data", data);
                            // actor.setx(Math.round(data.point.x));
                            // actor.sety(Math.round(data.point.y));
                         });
            seriesesSelection.selectAll(function(actor){
                                        return actor.dynamicProperty("kind") == "scatter";
                                    })
                         .each(function(actor, index) {
                            var data = layoutData[index];
                            actor.setDynamicProperty("data", data);
                            actor.setx(Math.round(data.point.x));
                            actor.sety(Math.round(data.point.y));
                        //  actor.setscale({sx:data.ratio, sy: data.ratio});
                         });
        }
    },[]);

    return ScatterLayouter;
});