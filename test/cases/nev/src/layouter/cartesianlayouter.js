/*
 * ------------------------------------------
 * 直角坐标系(布局器)
 * @version  0.0.1
 * @author   whl(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module layouter */
define(['{pro}/layouter/adjustbarlayouter.js',
        '{pro}/layout/layout.js',
        '{pro}/libs/colorbox.js',
        '{pro}/layouter/axislayouter.js',
        '{pro}/layouter/cartcoordlayouter.js',
        '{pro}/layouter/layouter.js',
        '{pro}/layouter/linelayouter.js',
        '{pro}/layouter/barlayouter.js',
        '{pro}/layouter/arealayouter.js',
        '{pro}/layouter/scatterlayouter.js',
        '{pro}/layouter/pielayouter.js'],function(
            mLayoutAdjustBar,
            mLayout,
            mColorbox,
            mLayoutAxis,
            mCartCoordLayouter,
            mLayouter,
            mLayoutLine,
            mLayoutBar,
            mLayoutArea,
            mLayoutScatter,
            mLayoutPie){

    var selection = mColorbox.selection;
    var LayoutMap = {
      line: mLayoutLine,
      bar: mLayoutBar,
      area: mLayoutArea,
      scatter: mLayoutScatter,
      pie: mLayoutPie
    }
    /**
     * 直角坐标系图表布局器
     * @class   module:layouter/cartesianlayouter.CartesianLayouter
     * @extends module:layouter/layouter.Layouter
     * @return  {CartesianLayouter} 直角坐标系图表布局器
     */
    var CartesianLayouter = mLayouter.extend({
        /**
         * 初始化
         * @return  {Layouter}  返回CartesianLayouter实例
         */
        initialize : function(){
          this.execProto("initialize");

          this.settypeId('cartesian');

          this.setcartCoordLayouter(null);

          
        },
        /**
         * 应用布局设置进行直角坐标系的布局
         * @method  module:layouter/cartesianlayouter.CartesianLayouter#layout
         * @param  {Object} cartesianInfo - 直角坐标系信息
         * @param {Rect} resource - 可用的矩形区域资源
         * @param {Scene} root - 笛卡尔坐标图的场景树根节点
         * @return {Object} result - 布局完成之后的布局状态及剩余资源信息
         */
        layout : function(cartesianInfo, resource, cartesianSelection){
          cartesianSelection.setProperty('x', resource.left);
          cartesianSelection.setProperty('y', resource.top);

          var tem={left: 0,right: resource.right- resource.left,
          			top:0, bottom: resource.bottom- resource.top,
          			width: resource.width,height: resource.height
          }
          var cartcoordlayouter;
          if(!this.cartCoordLayouter()){
          	cartcoordlayouter=mCartCoordLayouter.create();
          	this.setcartCoordLayouter(cartcoordlayouter);
          }else{
          	cartcoordlayouter=this.cartCoordLayouter();
          }
          
          var remainInfo= cartcoordlayouter.layout(cartesianInfo,tem,cartesianSelection);
          var seriesRootSelection= cartesianSelection.select(function(actor){
            return actor.dynamicProperty('id') == 'serieses';
          });
          this._t.__seriesLayout(cartesianInfo.seriesInfos, cartcoordlayouter, remainInfo.remainingSpace, seriesRootSelection);
          this._t.__axistooltipLayout(cartesianInfo, resource, remainInfo.remainingSpace,cartesianSelection);
          return {ok: true,
          			 remainingSpace: 0,
          			 info: [],
          			 scene: cartesianSelection};
		    },

        /**
         * 计算布局后剩下的区域
         * @protected
         * @method module:layouter/cartesianlayouter.CartesianLayouter#_remainResource
         * param {Object} cartesianInfo - cartesian信息
         * param {area} area - 用户设置的区域
         * param {area} cartesianArea - cartesian的colorBbox区域
         * @return  {area}   - 返回剩下的区域
         */
        _remainResource : function(cartesianInfo, area, cartesianArea){
          if(!cartesianArea || (cartesianInfo.x == 'center' && cartesianInfo.y == 'center')) return area;
          if(cartesianInfo.y == 'top'){
            return {left : area.left, right : area.width, top : area.top+cartesianArea.height, bottom : area.bottom, width : area.width, height : area.height - cartesianArea.height};
          }
          else if(cartesianInfo.y == 'bottom'){
            return {left : area.left, right : area.right, top : area.top, bottom : area.bottom-cartesianArea.height, width : area.width, height : area.height - cartesianArea.height};
          }else if(cartesianInfo.x == 'left' && cartesianInfo.y == 'center'){
            return {left : area.left+cartesianArea.width,right : area.right, top : area.top, bottom : area.bottom, width : area.width-cartesianArea.width, height : area.height};
          }else if(cartesianInfo.x == 'right' && cartesianInfo.y == 'center'){
            return {left : area.left, right : area.right-cartesianArea.width,top : area.top, bottom : area.bottom, width : area.width-cartesianArea.width, height : area.height};
          }
        },


        /**
         * 对笛卡尔坐标系中series的布局
         * @private
         * @method module:layouter/cartesianlayouter.CartesianLayouter#__seriesLayout
         * param {Object} info - series的信息
         * param {Object} cartesianlayout - 笛卡尔坐标系的布局
         * param {Object} seriesArea - series的区域
         * param {Object} seriesRootSelection - series的场景树根节点selection
         */
        __seriesLayout: function(seriesInfos, cartesianlayout,seriesArea,seriesRootSelection)
        {
          var pathObjs = {};
          var seriesObj ={};
          var barseries = [];
        for (var i = 0; i < seriesInfos.length; i++) {
          var seriesInfo =seriesInfos[i];
          if(seriesInfo.hidden)continue;
          var groupId = seriesInfo.compose.groupId;
          if(!seriesObj[groupId]){
            seriesObj[groupId]=[]; 
          }
          seriesObj[groupId].push(seriesInfo);
        };

        for(var id in seriesObj){
          var seriesArray = seriesObj[id];
          var sortedSeriesArray =[];
          for(var i=0;i<seriesArray.length;i++){
            sortedSeriesArray=seriesArray.sort(function(a,b){return a.index>=b.index});
            seriesObj[id] = sortedSeriesArray;
          }
        }

        var prePathInfoObj;
        for(var id in seriesObj){
          var result = {info:{}};
          for(var i = 0, len = seriesObj[id].length; i < len; i++) {
            var seriesInfo = seriesObj[id][i];
          //  if(seriesInfo.hidden)continue;
            if(seriesInfo.type === 'bar'){
              barseries.push(seriesInfo);
            }

            if(seriesInfo.type==='area'){
              seriesInfo.prePathInfoObj = result.info.prePathInfoObj? result.info.prePathInfoObj: prePathInfoObj;
              prePathInfoObj = seriesInfo.prePathInfoObj;

            }
            var Layouter  = LayoutMap[seriesInfo.type];
            var xData = seriesInfo.xData;
            var yData = seriesInfo.yData;
            var seriesSelection = seriesRootSelection.select(function(actor){
              return actor.dynamicProperty('id') == seriesInfo.id;
            });
            var lo = Layouter.create();
             result= lo.layout(seriesInfo,seriesArea,seriesSelection);
          }
        }
          if(barseries.length < 1) 
            return;
          mLayoutAdjustBar.create().layout(barseries,seriesArea,seriesRootSelection);

        },
        /* *
         * 判断数据维度名称是否存在。(helper里面和chart里面的相同函数)
         * @private
         * @method  module:layouter/cartesianlayouter.CartesianLayouter#__dataFieldExist
         * @param {String} fieldName 数据维度名称
         * @return {Boolean} true:存在;false:不存在
         */
        __dataFieldExist:function(data, fieldName){
          return data.length > 0 && data[0][fieldName] &&  data[0][fieldName] !== 0;
        },
        /**
         * 根据数据维度名称获取数据数组。(helper里面和chart里面的相同函数)
         * @private
         * @method  module:layouter/cartesianlayouter.CartesianLayouter#_getDataArrayByField
         * @param {String} fieldName 数据维度名称
         */
        __getDataArrayByField:function(data, fieldName){
          var result = [];      
          for (var i = 0; i < data.length; i++) {
              result.push(data[i][fieldName]);
          };
          return result;
        },
        /**
         * axis响应的tooltip的布局
         * @private
         * @method module:layouter/cartesianlayouter.CartesianLayouter#__axistooltipLayout
         * @param {Object} info -  包含tooltip的信息
         * @param {Object} cartesianArea -  直角坐标系的区域
         * @param {Object} seriesArea - series的在直角坐标系下的区域
         */
        __axistooltipLayout: function(info, cartesianArea, seriesArea, rootSelection)
        {
          if (!info.tooltip.hidden) {
            rootSelection.select(function(actor) {
                            return actor.dynamicProperty("kind") == "axisarea";
                          })
                         .each(function(actor, index) {
                            actor.setx(seriesArea.left);//cartesianArea.left + seriesArea.left
                            actor.sety(seriesArea.top);
                            actor.setwidth(seriesArea.width);
                            actor.setheight(seriesArea.height); 
                 /*         actor.setx(cartesianarea1.left+cartesianarea2.left);
                            actor.sety(cartesianarea1.top+cartesianarea2.top);
                            actor.setwidth(cartesianarea1.width);
                            actor.setheight(cartesianarea1.height);*/
                        //  actor.setstrokeStyle('#FF1574');
                         })

          }
        }
    },["cartCoordLayouter"]);

    return CartesianLayouter;
});