/*
 * ------------------------------------------
 * 柱状|条状(布局器)
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
        '{pro}/layouter/layouter.js'],function(mColortraits,mAssert,mUtils,mPoint,mColorbox, mLayouter){
    var PRIVATE = mColortraits.PRIVATE;
    var selection = mColorbox.selection;
    /**
     * 柱状|条状(布局器)
     * @class   module:layouter/barlayouter.BarLayouter
     * @extends module:layouter/layouter.Layouter
     * @return  {BarLayouter} 柱状|条状布局器
     */
    var BarLayouter = mLayouter.extend({
        /**
         * 应用布局设置进行bar series的布局
         * @method  module:layouter/barlayouter.BarLayouter#layout
         * @param  {seriesInfo} seriesInfo - series信息
         * @param {Rect} resource - 可用的矩形区域资源
         * @param {Selection} seriesesSelection - series的场景树根节点selection
         * @return {Object} result - 布局完成之后的布局状态及剩余资源信息
         */
        layout: function(seriesInfo, resource, seriesesSelection){

            var layoutData = [];

            var xScale = seriesInfo.hAxisScale;

            var yScale = seriesInfo.vAxisScale;

            var xData  = seriesInfo.xData;

            var yData  = seriesInfo.yData;
            // console.log('%%%$%$%^%^%^%^%^%^%^%^%^%^^$$%$%$%');
            // console.log(seriesInfo.name);
            // console.log(xData,' , ',yData);
            // console.log(yScale.domain());
            var length = xData ? xData.length : (yData ? yData.length : 0);

            var rValue;
            var pValue;

            if(xScale && yScale){
                var x_domain = xScale.domain();
                var x_tickValues = seriesInfo.hTickValues;
                var x_ticks = x_tickValues ? x_tickValues : xScale.ticks(); //xScale.ticks(xAxis.ticks()) 
                var xRange = xScale.ticks ? [xScale.exec(x_ticks[0]),xScale.exec(x_ticks[x_ticks.length - 1])]: xScale.scaleRange(xScale); 

                var y_domain = yScale.domain();
                var y_tickValues = seriesInfo. vTickValues;
                var y_ticks = y_tickValues ? y_tickValues : yScale.ticks();//yScale.ticks(yAxis.ticks())
                var yRange = yScale.ticks ? [yScale.exec(y_ticks[0]),yScale.exec(y_ticks[y_ticks.length - 1])]: yScale.scaleRange(yScale);

                var xRangeValue = Math.min.apply(null,xScale.domain()) < 0 ? xScale.exec(0) : Math.min.apply(null,xRange);
                // Math.min.apply(null,xRange);
                // Math.min.apply(null,xScale.domain()) < 0 ? xScale.exec(0) : Math.min.apply(null,xRange);
                var yRangeValue = Math.min.apply(null,yScale.domain()) < 0 ? yScale.exec(0) : Math.max.apply(null,yRange);
                // Math.max.apply(null,yRange);
                // Math.min.apply(null,yScale.domain()) < 0 ? yScale.exec(0) : Math.max.apply(null,yRange);
              //  console.log("barXData",xData);
                for(var i = 0;i < length;i++){
                    // var xValue = xData ? xData[i] : 0;
                    // var yValue = yData ? yData[i] : 0;
                    var xValue = xData[i];
                    var yValue = yData[i];
                    //这里没有考虑到双轴都是数值的情况
                    if(xScale.rangeBand){
                        xValue = xValue.id; //类目轴要使用索引值，防止出现重复的类目
                        rValue = yValue.data;
                        yValue = yValue.data;
                        if(yValue === null)
                            continue;
                        pValue = mPoint(xScale.exec(xValue),[yRangeValue,yScale.exec(yValue)]);
                            //}
                        
                    }else{ //这里y为类目轴的情况下
                        yValue = yValue.id;
                        rValue = xValue.data;
                        xValue = xValue.data;
                        
                        if(xValue === null)
                            continue;
                        pValue = mPoint([xRangeValue,xScale.exec(xValue)],yScale.exec(yValue))
                    }
                    layoutData.push({value : rValue,point : pValue});
                }
            }else{
                //单轴对于相同类目的还未处理
                for(var i = 0;i < length;i++){
                    if(yScale && yData){
                        rValue = yData[i];
                        pValue = mPoint(0,[yScale.exec(yData[0]),yScale.exec(rValue)]);
                    }else if(xScale && xData){
                        rValue = xData[i];
                        pValue = mPoint([xScale.exec(xData[0]),xScale.exec(rValue)],0);
                    }
                    layoutData.push({value : rValue,point : pValue});
                }
            }
           // console.log(layoutData);
            this._t.__applyScene(layoutData, seriesesSelection);
            return {ok: true,
					remainingSpace: resource,
					info: [],
					scene: seriesesSelection};
        },


        /**
         * 应用场景节点布局
         * @method  module:layouter/bar.Bar#__applyScene
         * @param   {Object} layoutData - bar的布局数据
         * @param   {Selection} seriesesSelection - bar场景根节点selection
         * @return  {Void}
         */
        __applyScene: function(layoutData, seriesesSelection){

            //数值为null的bar和text要删除
            var nullBarsTexts = seriesesSelection.selectAll(function(actor){
                var data = actor.dynamicProperty('data');
                return actor.dynamicProperty("kind") === "bar" && (data.xData === null || data.yData === null);
            });
            nullBarsTexts.remove();

            seriesesSelection.selectAll(function(actor){
                                        return actor.dynamicProperty("kind") === "bar";
                                    })
                         .each(function(actor, index) {
                            
                            var data = layoutData[index];
                            //actor.setDynamicProperty("data", data);
                            var d = data.point;
                            //这里一定有个数据number一个是array
                            if(typeof(d.x) === "number" && typeof(d.y) !== "number") {
                                actor.setx(d.x);
                                actor.sety(Math.min(d.y[0], d.y[1]));
                                actor.setheight(Math.abs(d.y[0] - d.y[1]));
                                actor.setratioAnchor({ratiox: 0.5, ratioy: 0});
                            }else if(typeof(d.x) !== "number" && typeof(d.y) === "number"){
                                actor.setx(Math.min(d.x[0], d.x[1]));
                                actor.sety(d.y);
                                actor.setwidth(Math.abs(d.x[1] - d.x[0]));
                                actor.setratioAnchor({ratiox: 0, ratioy: 0.5});
                            }else {
                                debugger;
                            }
                         });
            seriesesSelection.selectAll(function(actor){
                                        return actor.dynamicProperty("kind") === "text";
                                    })
                         .each(function(actor, index) {
                            //return;
                            var data = layoutData[index];
                            //actor.setDynamicProperty("data", data);
                            var d = data.point;
                            //这里一定有个数据number一个是array
                            if(typeof(d.x) === "number" && typeof(d.y) !== "number") {
                                actor.setx(5);
                                actor.setratioAnchor({ratiox: 0.5, ratioy: 1});
                            }else if(typeof(d.x) !== "number" && typeof(d.y) === "number"){
                                actor.setx(Math.abs(d.x[0] - d.x[1]) + 5);
                                actor.setratioAnchor({ratiox: 0, ratioy: 0.5});
                            }else {
                                debugger;
                            }
                         });
        }
    },[])
    
    return BarLayouter;
});