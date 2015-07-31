/*
 * ------------------------------------------
 * bar重叠布局(布局器)
 * @version  0.0.1
 * @author   Acker(hzwanggaige@corp.netease.com)
 * ------------------------------------------
 */
/** @module layouter */
define(['{pro}/libs/colorbox.js',
        '{pro}/libs/colortraits.js',
        '{pro}/tools/assert.js',
        '{pro}/tools/utils.js',
        '{pro}/libs/colorbox.js'],function(
            mColorbox,
            mColortraits,mAssert,mUtils,mColorbox){

    var PRIVATE = mColortraits.PRIVATE;
    var selection = mColorbox.selection;
    var id = mColorbox.selector.id;

    /**
     * 重叠bar布局器
     * @class module:layouter/adjustbarlayouter.AdjustBarLayouter
     * @extends colorTraits.Klass
     * @return  {AdjustBarLayouter} 重叠布局器
     * 
    */
    var AdjustBarLayouter = mColortraits.Klass.extend({
      /**
       * 初始化
       * @return  {AdjustBarLayouter} 返回AdjustBarLayouter实例
      */
      initialize : function(){
       // this._t.set_seriesInfos(info);

      },
    
        /**
         * 应用布局设置进行区域series的布局
         * @method  module:layouter/adjustbarlayouter.AdjustBarLayouter#layout
         * @param  {Array} seriesInfoArray - series信息数组
         * @param {Rect} resource - 可用的矩形区域资源
         * @param {Selection} rootSelection - series的场景树根节点selection
         * @return {Object} result - 布局完成之后的布局状态及剩余资源信息
         */
      layout: function(seriesInfoArray, resource, rootSelection){
        var seriesInfos = seriesInfoArray;
     // var coordinate = this._t._coordinate();
        var xScale = seriesInfoArray[0].hAxisScale;
        var yScale = seriesInfoArray[0].vAxisScale;
        var mode = seriesInfoArray[0].stackBar;
        //console.log('composeArray:',composeArray);
        if(xScale.rangeBand){
          var step = xScale.step();
          var composeArray = this._adjustCompose(seriesInfos, true);
          if( !mode ){
            this._adjustBarWidth(step, composeArray);
          }
        }
        else{
          var composeArray = this._adjustCompose(seriesInfos, false);
          console.log(composeArray);
         try{ var step = yScale.step();}catch(error){var step = 0}
          if( !mode ){
            //this._adjustBarHeightOld(seriesInfos, step, rootSelection);
            this._adjustBarHeight(step, composeArray);
          }
        }

  		  return {ok: true,
          			remainingSpace: resource,
          			info: [],
          			scene: rootSelection};
      },

      _adjustCompose : function(seriesInfos,isH){
        var composeArray = [];
        var index = 0;
        var used = [];
        var length = seriesInfos.length;
        for (var i = 0; i < length; i++) {
          used[i] = false;
        };
        //分组
        for (var i = 0; i < seriesInfos.length; i++) {
          //如果已经被其他堆叠,则used[i]为true;
          if(used[i]) continue;
          //没有数据说明已经被过滤掉或者隐藏，所以不用记录
          if(seriesInfos[i].xData.length <= 0)  continue;
          if(seriesInfos[i].hidden) continue;
          var seriesInfo = seriesInfos[i];
          var type = seriesInfo.compose.type;
          var groupId = seriesInfo.compose.groupId;
          //如果type为null的说明不会进行堆叠或者重叠
          if(type === null){
            composeArray.push({});
            composeArray[index].data = [];
            composeArray[index].type = null;
            composeArray[index++].data.push(seriesInfo);
            used[i] = true;
            continue;
          };
          composeArray.push({});
          composeArray[index].type = type;
          composeArray[index].data = [];
          composeArray[index].data.push(seriesInfo);

          used[i] = true;
          for (var j = i+1; j < length; j++) {
            if(used[j])
              continue;
            if(seriesInfos[j].compose.type === type && seriesInfos[j].compose.groupId === groupId){
              composeArray[index].data.push(seriesInfos[j]);
              used[j] = true;
            }
          };
          index++;
        };
        //console.log('*&*&*&*&*&*&*&*&:',composeArray.length);
        if(isH)
          this._composeApplyToH(composeArray);
        else
          this._composeApplyToV(composeArray);
        return composeArray;
      },
      //水平轴的时候调整堆叠的高度
      _composeApplyToH : function(composeArray){
        if(composeArray.length <= 0 ) return;
        var xScale = composeArray[0].data[0].hAxisScale;
        var ids = xScale.ids();
        
        for (var i = 0; i < composeArray.length; i++) {
          if(composeArray[i].type !== "stack")
            continue;
          //构造heightArray,用于记录数组
          var heightArray = [];
          for (var j = 0; j < ids.length; j++) {
            heightArray.push({});
            heightArray[j].id = ids[j];
            heightArray[j].topL = 0;
            heightArray[j].bottomL = 0;
          };

          var stackInfos = composeArray[i].data;
          for (var k = 0; k < stackInfos.length; k++) {
            if(stackInfos[k].hidden) continue;
            var stackInfo = stackInfos[k];
            var rootSel = selection.select(stackInfo.scene);
            var bars = rootSel.selectAll(function(actor){
              return actor.dynamicProperty('kind') === 'bar';
            });
            bars.each(function(actor, index){
              var data = actor.dynamicProperty('data');
              var configData,suffix=-1;
              for (var j = 0; j < heightArray.length; j++) {
                if(data.id === heightArray[j].id){
                  configData = heightArray[j];
                  suffix = j;
                  break;
                }
              };
              if(data.yData >= 0){
                actor.sety(actor.y() + configData.topL);
                heightArray[suffix].topL -= actor.height();
              }
              else{
                actor.sety(actor.y() + configData.bottomL);
                heightArray[suffix].bottomL += actor.height();
              }
            });
          };
        };
      },
      //垂直轴调整堆叠宽度
      _composeApplyToV : function(composeArray){
        if(composeArray.length <= 0) return;
        var yScale = composeArray[0].data[0].vAxisScale;
        var ids = yScale.ids();
        for (var i = 0; i < composeArray.length; i++) {
          if(composeArray[i].type !== "stack")
            continue;
          //构造widthArray,用于记录数组
          var widthArray = [];
          for (var j = 0; j < ids.length; j++) {
            widthArray.push({});
            widthArray[j].id = ids[j];
            widthArray[j].rightL = 0;
            widthArray[j].leftL = 0;
          };

          var stackInfos = composeArray[i].data;
          for (var k = 0; k < stackInfos.length; k++) {
            var stackInfo = stackInfos[k];
            var rootSel = selection.select(stackInfo.scene);
            var bars = rootSel.selectAll(function(actor){
              return actor.dynamicProperty('kind') === 'bar';
            });
            bars.each(function(actor, index){
              var data = actor.dynamicProperty('data');
              var configData,suffix=-1;
              for (var j = 0; j < widthArray.length; j++) {
                if(data.id === widthArray[j].id){
                  configData = widthArray[j];
                  suffix = j;
                  break;
                }
              };
              if(data.xData >= 0){
                actor.setx(actor.x() + configData.rightL);
                widthArray[suffix].rightL += actor.width();
              }
              else{
                actor.setx(actor.x() + configData.leftL);
                widthArray[suffix].bottomL -= actor.width();
              }
            });
          };
        };
        
      },
      /**
         * 调整x轴为类目轴时的重叠bar的并排布局
         * @protected
         * @method  module:layouter/adjustbarlayouter.AdjustBarLayouter#_adjustBarWidth
         * @param {Array} seriesInfos - series信息
         * @param {Number} step - tick间距(需要根据实际两个bar之间的间距进行改变)
         * @param {Selection} rootSelection - series的场景树根节点selection
         * @return void
         */
      _adjustBarWidth : function(step, composeArray){
        var showBars = [];
        var coord = [];
        var ratio;
        for (var i = 0; i < composeArray.length; i++) {
          var stackInfos = composeArray[i].data;
          showBars.push([]);
          for (var j = 0; j < stackInfos.length; j++) {
            ratio = stackInfos[j].padding;
            var stackInfo = stackInfos[j];
            var rootSel = selection.select(stackInfo.scene).selectAll(function(actor){
              return actor.dynamicProperty('kind') === 'bar';
            })
            showBars[i].push(rootSel);
          };
        };
        var num = showBars.length;
        if(!num) return;
        showBars[0][0].each(function(actor,index){
          coord.push(actor.x());
        })
        //这里的step使用从scale输出的两个类目之间的间距可能更佳的符合常理，或者遍历所有的coord[i+1]-coord[i]取得最小值
        //step = isNaN(coord[1]-coord[0]) ? step : Math.abs(coord[1]-coord[0]);
        for (var i = 1; i < coord.length; i++) {
          if(isNaN(coord[i]-coord[i-1]))
            continue;
          step = Math.min(step,Math.abs(coord[i]-coord[i-1]));
        };

        var width = step/(num+(num+1)*ratio);
        var padding = width*ratio;
        var totalWidth = num*width + (num-1)*padding;
        for (var i = 0; i < showBars.length; i++) {
          var stackBars = showBars[i];
          for (var j = 0; j < stackBars.length; j++) {
            var showBar = stackBars[j];
            showBar.each(function(actor, index){
            actor.setx(actor.x() - totalWidth/2 + i*(width+padding) + width/2);
            if(actor.height()!=0){
              actor.setwidth(width);  
            }
            else{
              //如果高度为0，宽度显示为0
              actor.setwidth(0);
            }
            actor.setratioAnchor({ratiox: 0.5, ratioy: 0});
          })
          };
          
        };
      },
      _adjustBarHeight : function(step, composeArray){
        var showBars = [];
        var coord = [];
        var ratio;
        for (var i = 0; i < composeArray.length; i++) {
          var stackInfos = composeArray[i].data;
          showBars.push([]);
          for (var j = 0; j < stackInfos.length; j++) {
            var stackInfo = stackInfos[j];
            ratio = stackInfo.padding;
            var rootSel = selection.select(stackInfo.scene).selectAll(function(actor){
              return actor.dynamicProperty('kind') === 'bar';
            });
            showBars[i].push(rootSel);
          };
        };
        var num = showBars.length;
        if(!num) return;
        showBars[0][0].each(function(actor,index){
          coord.push(actor.y());
        })
        //这里的step使用从scale输出的两个类目之间的间距可能更佳的符合常理，或者遍历所有的coord[i+1]-coord[i]取得最小值
        //step = isNaN(coord[1]-coord[0]) ? step : Math.abs(coord[1]-coord[0]);
        for (var i = 1; i < coord.length; i++) {
          if(isNaN(coord[i]-coord[i-1]))
            continue;
          step = Math.min(step,Math.abs(coord[i]-coord[i-1]));
        };
        var height = step/(num+(num+1)*ratio);
        var padding = height*ratio;
        var totalHeight = num*height + (num-1)*padding;
        for (var i = 0; i < showBars.length; i++) {
          var stackBars = showBars[i];
          for (var j = 0; j < stackBars.length; j++) {
            var showBar = stackBars[j];
            showBar.each(function(actor, index){
            actor.sety(actor.y() - totalHeight/2 + i*(height+padding) + height/2);
            if(actor.width()!=0){
              actor.setheight(height);  
            }
            else{
              //如果高度为0，宽度显示为0
              actor.setheight(0);
            }
            actor.setratioAnchor({ratiox: 0, ratioy: 0.5});
          })
          };
        };
      },
      _adjustBarWidthOld : function(seriesInfos, step, rootSelection){
        var showBars = [];
        var coord = [];
        var ratio;
        for(var i = 0, len = seriesInfos.length; i < len; i++){
          var seriesInfo = seriesInfos[i];
          if(seriesInfo.type == 'bar' && !seriesInfo.hidden){
            ratio = seriesInfo.padding;
            var seriesSelection = id(seriesInfo.id).apply(rootSelection);
            var rootSel = seriesSelection.selectAll(function(actor){
              return actor.dynamicProperty('kind') == 'bar';
            });
            showBars.push(rootSel);
          }
        };
        var num = showBars.length;
        if(!num) return;
        showBars[0].each(function(actor,index){
          coord.push(actor.x());
        })
        //这里的step使用从scale输出的两个类目之间的间距可能更佳的符合常理，或者遍历所有的coord[i+1]-coord[i]取得最小值
        step = isNaN(coord[1]-coord[0]) ? step : Math.abs(coord[1]-coord[0]);

        var width = step/(num+(num+1)*ratio);
        var padding = width*ratio;
        var totalWidth = num*width + (num-1)*padding;
        for (var i = 0; i < showBars.length; i++) {
          var showBar = showBars[i];
          showBar.each(function(actor, index){
            actor.setx(actor.x() - totalWidth/2 + i*(width+padding) + width/2);
            if(actor.height()!=0){
              actor.setwidth(width);  
            }
            else{
              //如果高度为0，宽度显示为0
              actor.setwidth(0);
            }
            actor.setratioAnchor({ratiox: 0.5, ratioy: 0});
          })
        };
      },
      /**
         * 调整y轴为类目轴时的重叠bar的并排布局
         * @protected
         * @method  module:layouter/adjustbarlayouter.AdjustBarLayouter#_adjustBarHeight
         * @param {Array} seriesInfos - series信息
         * @param {Number} step - tick间距(需要根据实际两个bar之间的间距进行改变)
         * @param {Selection} rootSelection - series的场景树根节点selection
         * @return null
         */
      _adjustBarHeightOld : function(seriesInfos, step, rootSelection){
        var showBars = [];
        var coord = [];
        var ratio;
        for(var i = 0, len = seriesInfos.length; i < len; i++){
          var seriesInfo = seriesInfos[i];
          if(seriesInfo.type == 'bar' && !seriesInfo.hidden){
            ratio = seriesInfo.padding;
            var seriesSelection = id(seriesInfo.id).apply(rootSelection);
            var rootSel = seriesSelection.selectAll(function(actor){
              return actor.dynamicProperty('kind') == 'bar';
            });
            showBars.push(rootSel);
          }
        };
        var num = showBars.length;
        if(!num) return;
        showBars[0].each(function(actor,index){
          coord.push(actor.y());
        })
        step = isNaN(coord[1]-coord[0]) ? step : Math.abs(coord[1]-coord[0]);
        
        var height = step/(num+(num+1)*ratio);
        var padding = height*ratio;
        var totalHeight = num*height + (num-1)*padding;
        for (var i = 0; i < showBars.length; i++) {
          var showBar = showBars[i];
          showBar.each(function(actor, index){
            actor.sety(actor.y() - totalHeight/2 + i*(height+padding) + height/2);
            if(actor.width()!=0){
              actor.setheight(height);
            }
            else{
              actor.setheight(0);
            }
            actor.setratioAnchor({ratiox: 0, ratioy: 0.5});
          })
        };
      },

    },[PRIVATE('_barNum'),PRIVATE('_seriesInfos')]);
  return AdjustBarLayouter;
});