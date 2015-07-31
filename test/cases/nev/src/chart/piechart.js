/*
* ------------------------------------------
* pie图标图表
* @version 0.0.1
* @author jw(hzzhangjw@corp.netease.com)
* ------------------------------------------
*/

/** @module chart */
define(['./commonchartbase.js',
        '{pro}/libs/colorbox.js',
        '{pro}/libs/colortraits.js',
        '{pro}/tools/utils.js',
        '{pro}/config/chart.js',
        '{pro}/tools/assert.js',
        '{pro}/visualencoder/visualencoder.js',
        '{pro}/interactencoder/interactencoder.js',
        '{pro}/config/visualencoding/factory.js',
        '{pro}/config/interactencoding/interactEncoding.js',
        '{pro}/postprocessor/postprocessor.js',
        '{pro}/tooltip/chooser/precisetooltip.js',
        './preprocess.js',
        './charthelper.js'
        ],function(
            mCommonChartBase,
            mColorbox,
            mColortraits,
            mTypeHelper,
            mConfigChart,
            mAssert,
            mVisualEncoder,
            mInteractEncoder,
            mConfigVE,
            mConfigIE,
            mPostProcessor,
            mPreciseTooltip,
            mPreProcess,
            mChartHelper
            ){

    var isArray         = mTypeHelper.isArray;
    var ContainerSprite = mColorbox.ContainerSprite;
    var PRIVATE         = mColortraits.PRIVATE;
    var config          = mConfigChart.piechart;
    var kind = mColorbox.selector.kind;
    var id = mColorbox.selector.id;

    /**
       * pie图表
       * @class module:chart/piechart.PieChart
       * @extends module:chart/commonchartbase.CommonChartBase
       * @param option {Object} 用户配置信息 
       * @description
       * option
       *
       *| 名称           | 类型           | 属性  |  默认值  | 描述  |
       *| :-------------: |:-------------:| :-----:| :-----:| :-----|
       *| size      | {width: num, height: num} | optional |{width: 900, height: 560} |图表尺寸区域，用于内部相对布局和约束布局的计算|
       *| data     | [Object] / Object     |  required | - |图表数据，按行存储或按列存储。<br>示例:<br>按行存储<br>data:[<br>{value:50,name:"IE"},<br>{value:36,name:"Chrome"},<br>{value:39,time:"FireFox"}<br>]<br>按列存储<br>data:[{<br>value:[50, 36, 39],<br>name:["IE","Chrome","FireFox"]<br>}]|
       *| center  | Array   | optional  | - | pie图的圆心位置,如果未提供则默认圆心位置在用户提供区域的中心 |
       *| value   |  String | required  | - | pie图饼所代表的维度数值,如上述data字段的value字段 |
       *| annotation  |  String | required  | - | pie图引线所代表的维度数值,如上述的data字段的name字段.annotation:"name" |
       *| annotationLead  |  Number  |  optional  | - | 引线长度 |
       *| radius  |  Array/Number | optional  | - | 指定内外半径<br>如果radius类型为Number，则表示外半径，内半径默认为0.<br>如果radius类型为Array,表示内外半径. |
       *| angle  |  Array/Number | optional  | - | 指定开始和结束角度<br>如果angle类型为Number，则表示结束角度，开始角度默认为0.<br>如果angle类型为Array,表示开始角度和结束角度. |
       *| rose     |  Boolean  |  optional  | - | 是否为玫瑰图即南丁格尔图(true/false),默认值为false   |
       *| name  |  String | optional  | - | 只是series的名称. |
       *| title   | Object |optional | - | 标题信息,参见：[点我](./commonInfo/title.html)|
       *| tooltip | Object| optional | - | 提示框信息,参见：[点我](./commonInfo/tooltip.html) |
       *| visualEncoding  | [VisualEncodingItem]|    optional |config中的配置|根据Selection机制进行定制图表样式,参见:[点我](./commonInfo/visualencoder-design.html)|
       *| interactEncoding  | [InteractEncodingItem]|    optional |config中的配置|根据Selection机制进行定制图表交互,参见:[点我](./commonInfo/interactencoder-design.html)|
       *
       */
    var PieChart = mCommonChartBase.extend({
      //------------------------------- protect functions start ------------------------------------//
      /**
       * cartesian图表数据预处理
       * @method module:chart/piechart.PieChart#_preProcessG
       * param  option {Object} 用户配置信息
       */
      _preProcessG:function(option)
      {
        var graphInfo = mPreProcess.preProcessPie(option);
        mPreProcess.pieInformationCheck(graphInfo);

        return graphInfo;
      },
      /**
       * 构建graph场景
       * @method module:chart/piechart.PieChart#_buildG
       */
      _buildG:function(rootSelection, pieInfo)
      {
        var seriesInfo = pieInfo.seriesInfos[0];
        var annotationData = seriesInfo.annotationData;
        var valueData = seriesInfo.valueData;


        var seriesSel = rootSelection.select(function(actor){
          return actor.dynamicProperty('id') == 'series';
        }).data(['series']);

        seriesSel.enter()
        .append(ContainerSprite)
        .setDynamicProperty('id', 'series');

        seriesSel.exit().remove();

        seriesSel = rootSelection.select(function(actor){
          return actor.dynamicProperty('id') == 'series';
        });

        seriesInfo.seriesNode = seriesSel.getElement(0, 0);

        var creator =  mChartHelper.creatorMap['pie'];
        var lo = creator.layout.create()
                      .xData(annotationData)
                      .yData(valueData)
                      .radiusRange(seriesInfo.radius, seriesInfo.rose)
                      .angleRange(seriesInfo.angle)
                      .center(seriesInfo.center)
                      .annotationLead(seriesInfo.annotationLead);

        creator.sceneBuilder(seriesSel, lo.exec(), {value:pieInfo.data, axisfields:{x:seriesInfo.annotation,y:seriesInfo.value}});
        //var rootA = sb.root();
        
        //为根节点设置id和kind
        //rootA.setDynamicProperty('kind',creator.kind);
        seriesInfo.layout = lo;
        pieInfo.root = seriesInfo.seriesNode;
        return true;
      },
      /**
       * 应用graph默认样式。
       * @method module:chart/piechart.PieChart#_applyGDefaultVisualEncoding
       */
      _applyGDefaultVisualEncoding:function(rootSelection, pieInfo)
      {
        mVisualEncoder.apply(id('series').apply(rootSelection), pieInfo.seriesInfos[0].defaultVisualEncoding);    
      },
      /**
       * 应用graph默认交互。
       * @method module:chart/piechart.PieChart#_applyGDefaultInteractEncoding
       */
      _applyGDefaultInteractEncoding:function(rootSelection, pieInfo)
      {
        mInteractEncoder.apply(id('series').apply(rootSelection), pieInfo.seriesInfos[0].defaultInteractEncoding);
      },
      /**
       * 布局graph。
       * @method module:chart/piechart.PieChart#_layoutG
       */
      _layoutG:function(rootSelection, pieInfo, area)
      {
        pieInfo.area = area;
        this._t.__fillTooltip(rootSelection, pieInfo, pieInfo.tooltip);
      },
      __fillTooltip:function(pieSelection, pieInfo, tooltipInfo)
      {
        if (!tooltipInfo.hidden) 
        {
          //tooltip 必须是单例, 否则需要对老的tooltip callback 善后
          var tooltip = this._t.tooltip();
          if(tooltip == null)
          {
            tooltip = tooltipInfo.tooltipKlass.create({
              orient: tooltipInfo.orient,
              format: tooltipInfo.format,
            });
            this._t.settooltip(tooltip)
          }
          tooltip.setscene(pieSelection.getElement(0, 0));
          tooltip.set_seriesInfos(pieInfo.seriesInfos);
          tooltip.interactResponse();
        };
      },
      _getSeriesInfo:function(pieInfo){
        return;
      },
      /**
       * 获取legend信息列表。
       * @method module:chart/piechart.PieChart#_getLegendInfo
       * @return {array} legend信息列表,每项信息必须包含name, type, color, hiddenColor等。
       */
      _getLegendItems:function(pieInfo)
      {
        var result = [{name: 'series0', type:'pie'}];
        return result;
      },
      _postProcessG:function(pieInfo)
      {
        return;
        if (!pieInfo.tooltip.hidden) 
          pieInfo.tooltip.tooltippolicy.interactResponse();
      },
      _legendClicked:function()
      {
        
      }
      //------------------------------- protect functions end  ------------------------------------//

    }, ['tooltip']);
    
    return PieChart;
});