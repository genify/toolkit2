/*
* ------------------------------------------
* 直角坐标系图表
* @version 0.0.1
* @author jw(hzzhangjw@corp.netease.com)
* ------------------------------------------
*/

/** @module chart */
define(['./commonchartbase.js',
	      '{pro}/scale/linear.js',
        '{pro}/scale/ordinal.js',
        '{pro}/libs/colorbox.js',
        '{pro}/tools/utils.js',
        '{pro}/config/chart.js',
        '{pro}/tools/assert.js',
        '{pro}/visualencoder/visualencoder.js',
        '{pro}/interactencoder/interactencoder.js',
        '{pro}/postprocessor/postprocessor.js',
        '{pro}/scenebuilder/cartesian.js',
        '{pro}/layouter/cartesianlayouter.js',
        '{pro}/tooltip/chooser/imprecisechooseone.js',
        '{pro}/tooltip/chooser/precisetooltip.js',
        './preprocess.js',
        '{pro}/libs/colortraits.js',
        '{pro}/theme/cartesian.js',
        '{pro}/config/userconfig/optionVisualEncoding.js'
        ],function(
            mCommonChartBase,
            mScaleLinear, 
          	mScaleOrdinal, 
            mColorbox,
            mTypeHelper,
            mConfigChart,
            mAssert,
            mVisualEncoder,
            mInteractEncoder,
            mPostProcessor,
            mCartesianSceneBuilder,
            mCartesianLayouter,
            mImPreciseChooseOne,
            mPrecisetooltip,
            mPreProcess,
            mColortraits,
            cartesianthemeMap,
            mParseOptionToVE
            ){

    var isArray         = mTypeHelper.isArray;
    var ContainerSprite = mColorbox.ContainerSprite;
    var config          = mConfigChart.cartesianchart;
    var selection = mColorbox.selection;
    var kind = mColorbox.selector.kind;
    var id = mColorbox.selector.id;
    var PRIVATE = mColortraits.PRIVATE;

    /**
     * 根据数据维度名称获取数据数组。
     * @private
     * @param {String} fieldName 数据维度名称
     * @method module:chart/chartbase.ChartBase#_getDataArrayByField
     */
    function getDataArrayByField(data, fieldName){
      var result = [];    
      for (var i = 0; i < data.length; i++) {
          result.push(data[i][fieldName]);
      };
      return result;
    }

    var nodeKindMap = {
          line: "line",
          bar: "bar",
          area: "line",
          pie: "pie",
          scatter: "scatter"
        }
     /**
       * 直角坐标系图表
       * @class module:chart/cartesianchart.CartesianChart
       * @extends module:chart/commonchartbase.CommonChartBase
       * @param option {Object} 用户配置信息 
       * @description
       * option
       *
       *| 名称           | 类型           | 属性  |  默认值  | 描述  |
       *| :-------------: |:-------------:| :-----:| :-----:| :-----|
       *| size      | {width: num, height: num} | optional |{width: 900, height: 560} |图表尺寸区域，用于内部相对布局和约束布局的计算|
       *| data     | [Object] / Object     |  required | - |图表数据，按行存储或按列存储。<br>示例:<br>按行存储<br>data:[<br>{sale:200,profit:10,time:"周一"},<br>{sale:300,profit:20,time:"周二"},<br>{sale:180,profit:30,time:"周三"}<br>]<br>按列存储<br>data:[{<br>sale:[200,300,400,200,100],<br>profit:[10,20,30,120,200],<br>time:["周一","周二","周三","周四"]<br>}]|
       *| xAxises  | [[AxisInfo](./commonInfo/axisInfo.html#AxisInfo)]     |    required |-|x轴信息，支持多根轴和单根轴信息的配置,可配置的字段如下:|
       *| yAxises  | [[AxisInfo](./commonInfo/axisInfo.html#AxisInfo)]     |    required |-|y轴信息，支持多根轴和单根轴信息的配置|
       *| series  | [[SeriesInfo](./commonInfo/axisInfo.html#SeriesInfo)]|    optional |-|数据展示图形信息，可在数组中配置多个图形|
       *| title   | Object |optional | - | 标题信息,参见：[点我](./commonInfo/title.html)|
       *| legend | Object| optional | - | 图例信息,参见：[点我](./commonInfo/legend.html) |
       *| tooltip | Object| optional | - | 提示框信息,参见：[点我](./commonInfo/tooltip.html) |
       *| visualEncoding  | [VisualEncodingItem]|    optional |config中的配置|根据Selection机制进行定制图表样式,参见:[点我](./commonInfo/visualencoder-design.html)|
       *| interactEncoding  | [InteractEncodingItem]|    optional |config中的配置|根据Selection机制进行定制图表交互,参见:[点我](./commonInfo/interactencoder-design.html)|
       * series
       *
       *| 名称           | 类型           | 属性  |  默认值  | 描述  |
       *| :-------------: |:-------------:| :-----:| :-----:| :-----|
       *| id      | string | optional |-|series id（全局唯一）|
       *| type      | string | required |-|series的展示图形类型,例如:"line","bar"等|
       *| padding      | Number | optional |-|指定bar与bar之间的间距比例,比例值(间距相对bar宽或者高的百分比)|
       *| xField      | string | required |-|指定数据维度作为series的x维度数据|
       *| yField      | string | required |-|指定数据维度作为series的y维度数据|
       *| xAxis      | number / string | optional |0|指定seies所使用的x轴的索引或id|
       *| yAxis      | number / string | optional |0|指定seies所使用的y轴的索引或id|
       *| name      | string | optional | "series"+i |series对应legend的名称|
       *|hidden|Boolean|optional|false|是否隐藏|
       *|smooth|Boolean|optional|false|是否平滑|
       *|size|String|optional|-|气泡图的尺寸所采用的数据字段|
       *
       */
      

      /**  
       * @link module:chart/cartesianchart.CartesianChart#AxisInfo
       */
      
    var CartesianChart = mCommonChartBase.extend({
      initialize:function(option)
      {
        this.setcartesianLayouter(mCartesianLayouter.create());
        this.execProto("initialize",option);
      },


      //------------------------------- private functions start  ------------------------------------//
      __fillTooltip:function(cartesianSelection, carInfo, tooltipInfo)
      {
        if (!tooltipInfo.hidden) 
        {
          //tooltip 必须是单例, 否则需要对老的tooltip callback 善后
          var tooltip = this._t.tooltip();
          if(tooltip == null)
          {
            var orient = carInfo.seriesInfos[0].monotonicAxis==='Y'?'verticlal':'horizontal';
            var tooltip = tooltipInfo.tooltipKlass.create({
              orient: orient,
              format: tooltipInfo.format,
            });
            this._t.settooltip(tooltip)
          }
          tooltip.setscene(cartesianSelection.getElement(0, 0));
          tooltip.setarea(carInfo.area);
          tooltip.set_seriesInfos(carInfo.seriesInfos);
          tooltip.interactResponse();
        };
      },
      //------------------------------- private functions end    ------------------------------------//

      //------------------------------- protect functions start ------------------------------------//
      /**
       * cartesian图表数据预处理
       * @method module:chart/commonchartbase#_preProcessG
       */
      _preProcessG:function(option, data)
      {
        var info = mPreProcess.preProcessCartesian(option, data);
    //    info.optionVEs = mParseOptionToVE.parseCartesianOption(option);

        return info;
      },
      /**
       * 构建graph场景
       * @method module:chart/commonchartbase#_buildG
       */
      _buildG:function(rootSelection, carInfo, optionData)
      {
        mCartesianSceneBuilder(rootSelection, carInfo, optionData);
      },
      /**
       * 应用graph默认样式。
       * @method module:chart/commonchartbase#_applyGDefaultVisualEncoding
       */
      _applyGDefaultVisualEncoding:function(rootSelection, carInfo)
      {
        var cartesianSeletion = id('cartesian').apply(rootSelection);

        var allAxisSelection = id('xAxises').then(kind('axis')).apply(cartesianSeletion);
        allAxisSelection.each(function(actor){
          mVisualEncoder.apply(selection.select(actor), actor.dynamicProperty('data').defaultVisualEncoding);
        });

        allAxisSelection = id('yAxises').then(kind('axis')).apply(cartesianSeletion);
        allAxisSelection.each(function(actor){
          mVisualEncoder.apply(selection.select(actor), actor.dynamicProperty('data').defaultVisualEncoding);
        });

        var allSeriesSelection = id('serieses').then(kind('series')).apply(cartesianSeletion);
        allSeriesSelection.each(function(actor){
          mVisualEncoder.apply(selection.select(actor), actor.dynamicProperty('data').defaultVisualEncoding);
        });
      },
      /**
       * 应用graph默认交互。
       * @method module:chart/commonchartbase#_applyGDefaultInteractEncoding
       */
      _applyGDefaultInteractEncoding:function(rootSelection, carInfo)
      {
        var cartesianSeletion = id('cartesian').apply(rootSelection);

        var allAxisSelection = id('xAxises').then(kind('axis')).apply(cartesianSeletion);
        allAxisSelection.each(function(actor){
          mInteractEncoder.apply(selection.select(actor), actor.dynamicProperty('data').defaultInteractEncoding);
        });

        allAxisSelection = id('yAxises').then(kind('axis')).apply(cartesianSeletion);
        allAxisSelection.each(function(actor){
          mInteractEncoder.apply(selection.select(actor), actor.dynamicProperty('data').defaultInteractEncoding);
        });

        var allSeriesSelection = id('serieses').then(kind('series')).apply(cartesianSeletion);
        allSeriesSelection.each(function(actor){
          mInteractEncoder.apply(selection.select(actor), actor.dynamicProperty('data').defaultInteractEncoding);
        });
      },
      /**
       * 布局graph。
       * @method module:chart/commonchartbase#_layoutG
       */
      _layoutG:function(rootSelection, carInfo, area)
      {
        carInfo.area = area;
        var cartesianSelection = id('cartesian').apply(rootSelection)
        this._t.__fillTooltip(cartesianSelection, carInfo, carInfo.tooltip);
        return this.cartesianLayouter().layout(carInfo, area,  cartesianSelection);
        //return this.cartesianLayouter().layout(carInfo, area, rootSelection);
      },
      /**
       * 获取legend信息列表。
       * @method module:chart/commonchartbase#_getLegendInfo
       * @return {array} legend信息列表,每项信息必须包含name, type, color, hiddenColor等。
       */
      // _getLegendItems:function(cartesianInfo)
      // {
      //   var result = [], seriesInfos = cartesianInfo.seriesInfos;
      //   for (var i = 0; i < seriesInfos.length; i++) {
      //     result.push({name:seriesInfos[i].name, type:seriesInfos[i].type});
      //   };
      //   return result;
      // },

      _getLegendItems:function(cartesianInfo,option)
      {
        var result = [], seriesInfos = cartesianInfo.seriesInfos,itemInfo={},flag = 0;
        if(option.legend.category === undefined){
          // 找出legend显示项目并给出id，以及对应规则
          for (var i = 0; i < seriesInfos.length; i++) {
            var seriesInfo = seriesInfos[i];
            var type = seriesInfo.type;
              var name = seriesInfo.name;
              if(itemInfo[name]) {//已经存在
                itemInfo[name]["relatedSeries"].push(seriesInfo.id);
                continue;
              }
              var predicate;
              predicate = function(xField,yField){
                return function(record){
                  return record[xField]!==undefined && record[yField]!==undefined; 
                }
              }(seriesInfo.xField,seriesInfo.yField);
              var predicateObj = {
                id : flag,
                predicate : predicate,
                isOpen : false
              };
              itemInfo[name] = {flag:flag,relatedSeries:[seriesInfo.id],hidden:false,filter:predicateObj};
              result.push({name:name, type:type,flag:flag++});
          };


          option.legend.category = result;
          option.legend.itemInfo = itemInfo;

        }
        else{
          result = option.legend.category;
        }
        // console.log('======',itemInfo);
        // console.log('=====',option);
        return result;
      },
      _getSeriesInfo:function(rootSelection, option,graphInfo)
      {
       // var legendOption = option.legend;
        var cartesianSeletion = id('cartesian').apply(rootSelection);
        var allSeriesSelection = id('serieses').then(kind('series')).apply(cartesianSeletion);
        
        var legendInfo = {};
        allSeriesSelection.each(function(actor){
          var seriesSelection = selection.select(actor);
          var seriesInfo = actor.dynamicProperty('data');
          legendInfo[seriesInfo.name] = {hidden:seriesInfo.hidden};
          seriesSelection.select(function(actor){
            if(actor.dynamicProperty("kind") === nodeKindMap[actor.dynamicProperty("kind")])
            {
              legendInfo[seriesInfo.name].color = actor.fillStyle ? (actor.fillStyle() ? actor.fillStyle() : actor.strokeStyle()) : actor.strokeStyle();
              return true;
            }
            return false;
          });
        });
        return legendInfo;
      },

      _legendClicked:function(rootSelection, cartesianInfo, data, option)
      {
        var legendName = data.name;
        var legendOption = option.legend;
        var itemInfo = legendOption.itemInfo;
        if(itemInfo[legendName].hidden){
          itemInfo[legendName].hidden = false;
          itemInfo[legendName].filter.isOpen = false;
        }
        else{
          itemInfo[legendName].hidden = true;
          itemInfo[legendName].filter.isOpen = true;
        }



        var result = {};
        var legendName = data.name;
        var serieses = option.series;
        for(var i = 0; i < serieses.length; ++i)
        {
          var series = serieses[i];
          var seriesName = series.name;
          if(seriesName == null)
          {
            seriesName = "series" + i;
          }
          if(legendName == seriesName)
          {
            series.hidden = !series.hidden;
            result.xField = series.xField;
            result.yField = series.yField;
          }
        }
        this.update('series', serieses);
        return result;
      },
      
      _postProcessG:function(rootSelection, carInfo)
      {

      },

      _getThemeTemplate:function(themeString)
      {
        return cartesianthemeMap[themeString];
      }
      //------------------------------- protect functions end  ------------------------------------//



    },["cartesianLayouter", PRIVATE('tooltip')]);
    return CartesianChart;
});