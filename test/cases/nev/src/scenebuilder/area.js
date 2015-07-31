/*
 * ------------------------------------------
 * 布局数据构建区域场景树的类
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module scenebuilder */
define(['{pro}/libs/colorbox.js',
    '{pro}/tools/assert.js'
  ],
  function(
    mColorbox,
    mAssert) {

    var ContainerSprite = mColorbox.ContainerSprite;
    var Line = mColorbox.Line;
    var Circle = mColorbox.Circle;
    var Polygon = mColorbox.Polygon;
    var Text = mColorbox.Text;
    var BubbleReceiver = mColorbox.BubbleReceiver;

    var calcuNullPointsInfo = function(dataPoints) {
      var newDataPoints = [];
      for (var i = 0; i < dataPoints.length; i++) {
        if (!(dataPoints[i].xData == null || dataPoints[i].yData == null)) {
          newDataPoints.push(dataPoints[i]);
        }
      }
      return newDataPoints;
    };


    /**
     * 区域场景构建及更新函数。
     
     * 节点绑定的数据格式为
     * line: [{x: y:}, {x: y:}]
     * point: {point: {x, y: }, value}
     * zone: [{x: y:}, {x: y:}, {x: y:}, {x: y:}]
     * text: {point: {x, y: }, value} === point
     
     * @function build
     * @param {Selection}  rootSelection - 场景所在的根节点。
     * @param {Array} dataPoints - [{xData, yData}]用户数据坐标点集合。
     * @param {Number} smooth - 平滑信息。
     * @param {Object} value - 图表的数据信息，必须包含 optionData, axisfields 信息。
     * @return  {boolean} 是否创建成功
     */
    function build(rootSelection, dataPoints, value, info) {
      var smooth = info.smooth;
      var nullType = info.nullType;
      var brokenLines = info.brokenLinesIndex;
      var normalLines = info.normalLinesIndex;
      var Path = mColorbox.Path;
      var zoneData = dataPoints.length > 0 ? [{
        seriesIndex: dataPoints[0].seriesIndex
      }] : [];
      var newDataPoints = calcuNullPointsInfo(dataPoints);

      var areaSeries = rootSelection.select(function(actor) {
          return actor.dynamicProperty("kind") === "areaSeries";
        })
        .data(["areaSeries"]);
      areaSeries.enter()
        .append(ContainerSprite)
        .setDynamicProperty("kind", "areaSeries");

      areaSeries.exit().remove();

      areaSeries = rootSelection.select(function(actor) {
        return actor.dynamicProperty("kind") === "areaSeries";
      });

      if (newDataPoints == null || newDataPoints.length == 0)
        zoneData = [];

      var zone = areaSeries.select(function(actor) {
          return actor.dynamicProperty("kind") == "zone";
        })
        .data(zoneData);

      zone.enter()
        .append(Path)
        .setDynamicProperty("kind", "zone");

      zone.exit()
        .remove();

      //lines
      var lines = areaSeries.select(function(actor) {
          return actor.dynamicProperty("kind") === "lines";
        })
        .data(["lines"]);

      lines.enter()
        .append(ContainerSprite)
        .setDynamicProperty("kind", "lines");

      lines.exit().remove();

      lines = areaSeries.select(function(actor) {
        return actor.dynamicProperty("kind") === "lines";
      });

      if (nullType === "dash") {
        var lineDatas = newDataPoints.length > 0 ? Array(newDataPoints.length - 1) : [];
      } else {
        var lineDatas = normalLines.length > 0 ? Array(normalLines.length) : [];
      }
      for (var i = 0; i < lineDatas.length; ++i) {
        lineDatas[i] = {
          seriesIndex: newDataPoints[i].seriesIndex
        };
      }
      var line = lines.selectAll(function(actor) {
          return actor.dynamicProperty("kind") === "line";
        })
        .data(lineDatas);

      if (!smooth) {
        line.enter()
          .append(Line)
          .setDynamicProperty("kind", "line");
      } else {
        line.enter()
          .append(Path)
          .setDynamicProperty("kind", "line");
      }


      line.exit()
        .remove();

      var line = lines.selectAll(function(actor) {
        return actor.dynamicProperty("kind") === "line";
      });

      if (nullType === "dash") { //设置null值的直线为虚线
        for (var i = 0; i < brokenLines.length; i++) {
          line.at(brokenLines[i]).getElement(0, 0).setlineDash([10]);
        }
      }

      //points
      var points = areaSeries.select(function(actor) {
          return actor.dynamicProperty("kind") === "points";
        })
        .data(["points"]);

      points.enter()
        .append(BubbleReceiver)
        .setDynamicProperty("kind", "points");

      points.exit().remove();

      points = areaSeries.select(function(actor) {
        return actor.dynamicProperty("kind") === "points";
      });

      var point = points.selectAll(function(actor) {
          return actor.dynamicProperty("kind") === "point";
        })
        .data(newDataPoints);

      var epoints = point.enter()
        .append(Circle)
        .setDynamicProperty("kind", "point")

      if (info.label) {
        epoints
          .append(Text)
          .setDynamicProperty("kind", "text");
      }

      point.exit()
        .remove();

      points.selectAll(function(actor) {
          return actor.dynamicProperty("kind") === "text";
        })
        .data(newDataPoints);

      point = areaSeries.selectAll(function(actor) {
        return actor.dynamicProperty("kind") === "point";
      });

      if (value.accValue) {
        var idArray = newDataPoints.map(function(d) {
          return d.id;
        })
      }


      //mAssert(value.value.length === point.size(), "the length of value and object are mismatching!!")

      point.each(function(actor, index) {
        console.log("sb",actor.type())
        actor.setDynamicProperty("value", newDataPoints[index]);
        actor.setDynamicProperty("axisfields", value.axisfields);
        if (value.accValue) {
          actor.setDynamicProperty("accValue", value.accValue[idArray[index]]);
        }
      });
    }

    return build;

  });