/*
 * ------------------------------------------
 * pie图标图表
 * @version 0.0.1
 * @author wanggaige(hzwanggaige@corp.netease.com)
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
  './charthelper.js',
  '{pro}/scenebuilder/pie.js',
  '{pro}/layouter/pielayouter.js',
  '{pro}/config/visualencoding/skin.js',
  './dataFilter.js',
  '{pro}/config/userconfig/optionVisualEncoding.js',
  '{pro}/theme/pie.js',
], function(
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
  mChartHelper,
  mPie,
  mPieLayouter,
  mSkin,
  mDataFilter,
  mParseOptionToVE,
  mPiethemeMap
) {

  var isArray = mTypeHelper.isArray;
  var ContainerSprite = mColorbox.ContainerSprite;
  var MultilineText = mColorbox.MultilineText;
  var selection = mColorbox.selection;
  var PRIVATE = mColortraits.PRIVATE;
  var config = mConfigChart.piechart;
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
   *| title   | Object |optional | - | 标题信息 |
   *| legend | Object| optional | - | 图例信息 |
   *| tooltip | Object| optional | - | 提示框信息 |
   *| visualEncoding  | [VisualEncodingItem]|    optional |config中的配置|根据Selection机制进行定制图表样式,参见:[点我](../visualencoder/visualencoder-design.html)|
   *| interactEncoding  | [InteractEncodingItem]|    optional |config中的配置|根据Selection机制进行定制图表交互,参见:[点我](../interaction/interaction-design.html)|
   *
   */
  var PieChart = mCommonChartBase.extend({
    //------------------------------- protect functions start ------------------------------------//
    /**
     * cartesian图表数据预处理
     * @method module:chart/commonchartbase#_preProcessG
     * param  option {Object} 用户配置信息
     */
    _preProcessG: function(option, data) {
      //var graphInfo = pieInfoProcess(option);
      //var graphInfo = mPreProcess.preProcessPie(option);
      //mPreProcess.pieInformationCheck(graphInfo);
      var graphInfo = mPreProcess.preprocessPieInfo(option, data);
      graphInfo.optionVEs = mParseOptionToVE.parsePieOption(option);
      return graphInfo;
    },
    /**
     * 获取legend信息列表。
     * @method module:chart/commonchartbase#_getLegendInfo
     * @return {array} legend信息列表,每项信息必须包含name, type, color, hiddenColor等。
     */
    _getLegendItems: function(pieInfo) {
      var result = [],
        seriesInfos = pieInfo.seriesInfos;
      for (var i = 0; i < seriesInfos.length; i++) {
        result.push({
          name: seriesInfos[i].name,
          type: seriesInfos[i].type
        });
      };
      return result;
    },
    /**
     * 构建graph场景
     * @method module:chart/commonchartbase#_buildG
     */
    _buildG: function(rootSelection, pieInfo) {
      var xData, yData, creator;
      //强调字段
      if (pieInfo.emphasis) {
        var textActorType = pieInfo.isAutoWrapped? mColorbox.AutoWrapText: MultilineText;
        var emphasis = rootSelection.select(function(actor) {
          return actor.dynamicProperty("kind") === "emphasis";
        }).data([pieInfo.emphasis]);
        emphasis.enter()
          .append(textActorType)
          .setDynamicProperty("kind", "emphasis");
        emphasis.exit().remove();
      }

      var piesSel = rootSelection.select(function(actor) {
        return actor.dynamicProperty('id') === 'serieses';
      }).data(["serieses"]);

      piesSel.enter()
        .append(ContainerSprite)
        .setDynamicProperty('id', "serieses");

      piesSel.exit().remove();

      piesSel = rootSelection.select(function(actor) {
        return actor.dynamicProperty("id") == "serieses";
      });
      pieInfo.sceneSelection = piesSel;

      var allPiesSel = piesSel.selectAll(function(actor) {
        return actor.dynamicProperty("kind") == "series";
      }).data(pieInfo.seriesInfos);

      allPiesSel.enter()
        .append(ContainerSprite)
        .setDynamicProperty("kind", "series")
        .setDynamicProperty("seriesName", function(d, index) {
          return d.annotation;
        })
        .setDynamicProperty("id",function(d,index){
          return d.id;
        });
      allPiesSel.exit().remove();

      allPiesSel = piesSel.selectAll(function(actor) {
        return actor.dynamicProperty("kind") == "series";
      });
      //console.log('allpie的个数:',allPiesSel.size());
      allPiesSel.each(function(actor, index) {
        var seriesInfo = actor.dynamicProperty("data");
        //console.log(seriesInfo);
        creator = mChartHelper.creatorMap[seriesInfo.type];
        if (!seriesInfo.hidden) {
          xData = seriesInfo.annotationData;
          yData = seriesInfo.valueData;
        } else {
          xData = [];
          yData = [];
        }
        //actor.setDynamicProperty("id",seriesInfo.id);
        actor.setDynamicProperty('seriesName', seriesInfo.annotation);
        seriesInfo.sceneSelection = selection.select(actor);
        var data = xData.map(function(data, index) {
          return {
            xData: data.data,
            yData: yData[index].data,
            id: data.id,
            ratio : yData[index].ratio,
            colorId : data.colorId
          }
        });
        //console.log(data);
        var actorValue = {
          axisfields: {
            x: seriesInfo.annotation,
            y: seriesInfo.value
          }
        };
        creator.sceneBuilder(
          seriesInfo.sceneSelection,
          data,
          actorValue,
          seriesInfo.annotationHidden
        );
      });
      return true;
    },
    /**
     * 应用graph默认样式。
     * @method module:chart/commonchartbase#_applyGDefaultVisualEncoding
     */
    _applyGDefaultVisualEncoding: function(rootSelection, pieInfo) {
      //mVisualEncoder.apply(id('serieses').apply(rootSelection), pieInfo.seriesInfos[0].defaultVisualEncoding);    
      //var seriesesSel = id('serieses').apply(rootSelection);
      var allseriesSel = id('serieses').then(kind('series')).apply(rootSelection);
      allseriesSel.each(function(actor, index) {
        mVisualEncoder.apply(selection.select(actor), actor.dynamicProperty('data').defaultVisualEncoding)
      })
    },
    /**
     * 应用graph默认交互。
     * @method module:chart/commonchartbase#_applyGDefaultInteractEncoding
     */
    _applyGDefaultInteractEncoding: function(rootSelection, pieInfo) {
      //mInteractEncoder.apply(id('serieses').apply(rootSelection), pieInfo.seriesInfos[0].defaultInteractEncoding);
      var allseriesSel = id('serieses').then(kind('series')).apply(rootSelection);
      allseriesSel.each(function(actor, index) {
        mInteractEncoder.apply(selection.select(actor), actor.dynamicProperty('data').defaultInteractEncoding);
      })
    },
    /**
     * 布局graph。
     * @method module:chart/commonchartbase#_layoutG
     */
    _layoutG: function(rootSelection, pieInfo, area) {
      pieInfo.area = area;
      var pieLayouter = mPieLayouter.create()
        .rootSel(rootSelection)
        .pieInfo(pieInfo)
        .pieResource(area)
        .exec();
      this._t.__fillTooltip(rootSelection, pieInfo, pieInfo.tooltip);
    },
    __fillTooltip: function(pieSelection, pieInfo, tooltipInfo) {
      if (!tooltipInfo.hidden) {
        //tooltip 必须是单例, 否则需要对老的tooltip callback 善后
        var tooltip = this._t.tooltip();
        if (tooltip == null) {
          tooltip = tooltipInfo.tooltipKlass.create({
            orient: tooltipInfo.orient,
            format: tooltipInfo.format,
            emphasis: {
              hidden: false
            }
          });
          this._t.settooltip(tooltip)
        }
        tooltip.setscene(pieSelection.getElement(0, 0));
        tooltip.set_seriesInfos(pieInfo.seriesInfos);
        tooltip.interactResponse();
      };
    },
    _getSeriesInfo: function(rootSelection, option, graphInfo) {
      var legendOption = option.legend;
      var itemInfo = legendOption.itemInfo;
      var allPiesSel = id("serieses").then(kind('pie')).apply(rootSelection);
      //alert(allPiesSel.size());
      var legendInfo = {};
      for (var k in itemInfo) {
        legendInfo[k] = {
          hidden: itemInfo[k].hidden
        }
      }
      allPiesSel.each(function(actor, index) {
        var data = actor.dynamicProperty("data");
        var name = data.xData;
        legendInfo[name].color = actor.fillStyle() ? actor.fillStyle() : actor.strokeStyle();
        // if(legendInfo[name]){
        //   legendInfo[name].color = actor.fillStyle() ? actor.fillStyle() : actor.strokeStyle();
        // }
      });
      return legendInfo;
    },
    /**
     * 获取legend信息列表。
     * @method module:chart/commonchartbase#_getLegendInfo
     * @return {array} legend信息列表,每项信息必须包含name, type, color, hiddenColor等。
     */
    _getLegendItems: function(pieInfo, option) {
      var result = [],
        seriesInfos = pieInfo.seriesInfos,
        itemInfo = {},
        flag = 0;
      if (option.legend === undefined || option.legend.category === undefined) {
        // 找出legend显示项目并给出id，以及对应规则
        if (option.legend === undefined) option.legend = {};
        for (var i = 0; i < seriesInfos.length; i++) {
          var seriesInfo = seriesInfos[i];
          var annotation = seriesInfo.annotation;
          var annotationData = seriesInfo.annotationData;
          var type = seriesInfo.type;
          for (var j = 0, len = annotationData.length; j < len; j++) {
            var name = annotationData[j].data;
            if (itemInfo[name]) { //已经存在
              itemInfo[name]["relatedSeries"].push(seriesInfo.id);
              continue;
            }
            //之前不存在这个legendItem
            var predicate;

            // (function(annotation,name){
            //   predicate = function(record){
            //     return record["data"][annotation] != name; 
            //   }
            // })(annotation,name);

            predicate = function(annotation, name) {
              return function(record) {
                return record["data"][annotation] != name;
              }
            }(annotation, name);
            var predicateObj = {
              id: flag,
              predicate: predicate,
              isOpen: false
            };
            itemInfo[name] = {
              flag: flag,
              relatedSeries: [seriesInfo.id],
              hidden: false,
              filter: predicateObj
            };
            result.push({
              name: name,
              type: type,
              flag: flag++
            });
          };
        };
        option.legend.category = result;
        option.legend.itemInfo = itemInfo;

      } else {
        result = option.legend.category;
      }
      return result;

      // for (var i = 0; i < seriesInfos.length; i++) {
      //   //result.push({name:seriesInfos[i].name, type:seriesInfos[i].type});
      //   var seriesInfo = seriesInfos[i];
      //   for (var j = 0; j < seriesInfo.annotationData.length; j++) {
      //     result.push({name:seriesInfo.annotationData[j].data, type:seriesInfo.type,id:j});
      //   };
      // };

      // return result;
    },
    _postProcessG: function(pieInfo) {
      return;
      if (!pieInfo.tooltip.hidden)
        pieInfo.tooltip.tooltippolicy.interactResponse();
    },
    _getThemeTemplate:function(themeString)
    {
      return mPiethemeMap[themeString];
    },
    _legendClicked: function(rootSelection, pieInfo, data, option) {
        var id = data.flag;
        var legendName = data.name;
        var legendOption = option.legend;
        var itemInfo = legendOption.itemInfo;
        if (itemInfo[legendName].hidden) {
          itemInfo[legendName].hidden = false;
          itemInfo[legendName].filter.isOpen = false;
        } else {
          itemInfo[legendName].hidden = true;
          itemInfo[legendName].filter.isOpen = true;
        }

        //itemInfo[legendName].filter.isOpen = !itemInfo[legendName].filter.isOpen;

        // console.log("itemInfo", itemInfo);



        // console.log(id);
        var serieses = option.series;
        for (var i = 0; i < serieses.length; i++) {
          var series = serieses[i];
          var seriesName = series.name;
          if (seriesName == null) {
            seriesName = 'series' + i;
          }
          if (legendName == seriesName) {
            series.hidden = !series.hidden;
          }
          //console.log(series.hidden);
        };
        this.update('series', serieses);
        return;
      }
      //------------------------------- protect functions end  ------------------------------------//

  }, ['tooltip']);

  return PieChart;
});