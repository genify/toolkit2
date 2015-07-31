/*
 * ------------------------------------------
 * 折线(布局器)
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
        '{pro}/tools/smooth.js',
        '{pro}/layouter/layouter.js'],function(mColortraits,mAssert,mUtils,mPoint, mColorbox,mSmooth,mLayouter){
    var PRIVATE = mColortraits.PRIVATE;
    var selection = mColorbox.selection;
      var  calcuNullPointsInfo = function(xData,yData){
        //确定null值的个数以及分布情况
        var validPointsIndex = [];
        var validDataPoints = [];
        var newXData = [];
        var newYData = [];
        for(var i=0;i<xData.length;i++){
          if(!(xData[i].data==null || yData[i].data==null)){
            validPointsIndex.push(i);
            newXData.push(xData[i]);
            newYData.push(yData[i]);
          }
        }
        //统计折断区的段数及位置
        var brokenLinesIndex = [];
        var normalLinesIndex = [];
        var preIndex = validPointsIndex[0];
        for(var i=1; i<validPointsIndex.length;i++){
          if((preIndex + 1)!== validPointsIndex[i]){
            brokenLinesIndex.push(i-1);
          }else{
            normalLinesIndex.push(i-1);
          }
          preIndex = validPointsIndex[i];
        }
        // console.log("broken",brokenLinesIndex);
         // console.log("normal",normalLinesIndex);
        return [newXData,newYData,brokenLinesIndex,normalLinesIndex];
      };


    /**
     * 折线(布局器)
     * @class   module:layouter/linelayouter.LineLayouter
     * @extends module:layouter/layouter.Layouter
     * @return  {LineLayouter} 折线布局器
     */
    var LineLayouter = mLayouter.extend({

        /**
         * 应用布局设置进行折线或者曲线series的布局
         * @method  module:layouter/linelayouter.LineLayouter#layout
         * @param  {seriesInfo} seriesInfo - series信息
         * @param {Rect} resource - 可用的矩形区域资源
         * @param {Selection} seriesesSelection - serieses的场景树根节点selection
         * @return {Object} result - 布局完成之后的布局状态及剩余资源信息
         */
       layout: function(seriesInfo, resource, seriesesSelection){

            var xScale = seriesInfo.hAxisScale;

            var yScale = seriesInfo.vAxisScale;

            var xData  = seriesInfo.xData;

            var yData  = seriesInfo.yData;

            var info = calcuNullPointsInfo(xData,yData);

            xData = info[0];
            yData = info[1];
            brokenLinesIndex = info[2];
            normalLinesIndex = info[3];




            var layoutData = [];

            var linesIndex = [];

            var length = xData ? xData.length : (yData ? yData.length : 0);

            var validPointsIndex = seriesInfo.validPointsIndex;

            if(seriesInfo.nullType === "dash"){
              for(var i=0;i<length-1;i++){
                linesIndex[i] = i; 
              }
            }else{
              linesIndex = normalLinesIndex;
              // console.log("lineIndex",linesIndex);
              
            }

            this._t.set_monotonicAxis(seriesInfo.monotonicAxis);
            for(var i = 0;i < length;i++){
                var xValue = xData ? xData[i] : 0;
                var yValue = yData ? yData[i] : 0;
                var rValue;
                var pValue;
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
                layoutData.push({value : rValue, point : pValue});
            }

            this._t.__applyScene(layoutData,seriesesSelection,{smooth: seriesInfo.smooth,linesIndex:linesIndex,validPointsIndex:validPointsIndex});

            return {ok: true,
					remainingSpace: resource,
					info: [],
					scene: seriesesSelection};

        },
  
        /**
         * 应用场景节点布局
         * @method  module:layouter/linelayouter.LineLayouter#__applyScene
         * @param   {Array}  layoutData - line的布局器数据
         * @param   {Selection} seriesesSelection - line场景根节点selection
         * @param   {Object} param - line style
         * @return  {Void}
         */
        __applyScene: function(layoutData, seriesesSelection, param) {
           // var layoutData = this.exec();
           var deletedLinesIndex = [];
           var validPointsIndex = param.validPointsIndex;
            var lineDatas = this._t.__calcutelineDatas(layoutData, param.smooth, param.linesIndex);
            var lineSelection =  seriesesSelection.selectAll(function(actor) {
                                        return actor.dynamicProperty("kind") == "line";
                                    })
                         .each(function(actor, index) {
                                var d = lineDatas[index];
                                param.smooth  ?  actor.setpathElements( [["M", d[0].x, d[0].y], ["C", d[1].x, d[1].y, d[2].x, d[2].y, d[3].x, d[3].y]]) : actor.setvertexes(d);                         
                              });
            
            var pointSelection = seriesesSelection.selectAll(function(actor) {
                                        return actor.dynamicProperty("kind") == "point";
                                    })
                         .each(function(actor, index) {
          var data = layoutData[index];
         // actor.setDynamicProperty("data", data);
          actor.setx(Math.round(data.point.x));
          actor.sety(Math.round(data.point.y));
         // actor.children()[0].setDynamicProperty("data", data);                             
                              });

        },
        
    __calcutelineDatas: function(layoutData, smooth, lineStartPointIndex) {
      var lineDatas = [];
      var len = lineStartPointIndex.length;
      // console.log("len",len)
      var pointDatas = layoutData.map(function(d) {return d.point;});
      if (!smooth) {
        for (var i = 0; i < len; i++) {
          var linesPointIndex = lineStartPointIndex[i];
          lineDatas.push([pointDatas[linesPointIndex], pointDatas[linesPointIndex + 1]]);
        }
      } else {
        var cps = mSmooth.smoothBezier(pointDatas, this._t._monotonicAxis() != "Y");
        for (var i = 0; i < len; i++) {
          var linesPointIndex = lineStartPointIndex[i];
          lineDatas.push([pointDatas[linesPointIndex], cps[2 * linesPointIndex], cps[2 * linesPointIndex + 1], pointDatas[linesPointIndex+ 1]]);
        }
      }
      return lineDatas;
    },

    },[PRIVATE("_monotonicAxis")]);
    return LineLayouter;
});