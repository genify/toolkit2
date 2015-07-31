/*
 * ------------------------------------------
 * 布局数据构建折线场景树的类
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
    var Circle = mColorbox.Circle;
    var Text = mColorbox.Text;

    var BubbleReceiver = mColorbox.BubbleReceiver;
    var calcuNullPointsInfo = function(dataPoints) {
      var newDataPoints = [];
      var validPointsIndex = [];
      for (var i = 0; i < dataPoints.length; i++) {
        if (!(dataPoints[i].xData == null || dataPoints[i].yData == null)) {
          validPointsIndex.push(i);
          newDataPoints.push(dataPoints[i]);
        }
      }
      var brokenLinesIndex = [];
      var normalLinesIndex = [];
      var preIndex = validPointsIndex[0];
      for (var i = 1; i < validPointsIndex.length; i++) {
        if ((preIndex + 1) !== validPointsIndex[i]) {
          brokenLinesIndex.push(i - 1);
        } else {
          normalLinesIndex.push(i - 1);
        }
        preIndex = validPointsIndex[i];
      }
      return [newDataPoints, brokenLinesIndex];
    };


    /**
     * 折线场景构建及更新函数。
     * @function build
     * @param {Selection}  rootSelection - 场景所在的根节点。
     * @param {Array} dataPoints - [{xData, yData}]用户数据坐标点集合。
     * @param {boolean} smooth - 是否设置平滑; true:平滑, false:不平滑。
     * @param {Object} value - 图表的数据信息，必须包含 optionData, axisfields 信息。
     * @return  {boolean} 是否创建成功
     */
    function build(rootSelection, dataPoints, value, info) {
      var nullType = info.nullType;
      var brokenLnes = info.brokenLinesIndex;
      var normalLines = info.normalLinesIndex;
      var pointsInfo = calcuNullPointsInfo(dataPoints);
      var newDataPoints = pointsInfo[0];
      var brokenLnes = pointsInfo[1];

      var lineSeries = rootSelection.select(function(actor) {
          return actor.dynamicProperty("kind") === "lineSeries";
        })
        .data(["lineSeries"]);
      lineSeries.enter()
        .append(ContainerSprite)
        .setDynamicProperty("kind", "lineSeries");

      lineSeries.exit().remove();

      lineSeries = rootSelection.select(function(actor) {
        return actor.dynamicProperty("kind") === "lineSeries";
      });

      var lines = lineSeries.select(function(actor) {
          return actor.dynamicProperty("kind") === "lines";
        })
        .data(["lines"]);

      lines.enter()
        .append(ContainerSprite)
        .setDynamicProperty("kind", "lines");

      lines.exit().remove();

      lines = lineSeries.select(function(actor) {
        return actor.dynamicProperty("kind") === "lines";
      });
      if (nullType === "dash") {
        var lineDatas = dataPoints.length > 0 ? Array(newDataPoints.length - 1) : [];
      } else {
        var lineDatas = normalLines.length > 0 ? Array(normalLines.length) : [];
      }
      for (var i = 0; i < lineDatas.length; ++i) {
        lineDatas[i] = newDataPoints[i];
      }

      var line = lines.selectAll(function(actor) {
          return actor.dynamicProperty("kind") === "line";
        })
        .data(lineDatas);

      var node = (!info.smooth) ? mColorbox.Line : mColorbox.Path;

      line.enter()
        .append(node)
        .setDynamicProperty("kind", "line");

      line.exit()
        .remove();

      var line = lines.selectAll(function(actor) {
        return actor.dynamicProperty("kind") === "line";
      });
      if (nullType === "dash") { //设置null值的直线为虚线
        for (var i = 0; i < brokenLnes.length; i++) {
          line.at(brokenLnes[i]).getElement(0, 0).setlineDash([10]);
        }
      }


      //point
      var points = lineSeries.select(function(actor) {
          return actor.dynamicProperty("kind") === "points";
        })
        .data([{
          kind: "points"
        }]);
      points.enter()
        .append(BubbleReceiver)
        .setDynamicProperty("kind", "points");

      points.exit().remove();

      points = lineSeries.select(function(actor) {
        return actor.dynamicProperty("kind") === "points";
      });

      var point = points.selectAll(function(actor) {
          return actor.dynamicProperty("kind") === "point";
        })
        .data(newDataPoints);

      var circles = point.enter()
        .append(Circle)
        .setDynamicProperty("kind", "point");

      if (info.label) {
        circles.append(Text)
          .setDynamicProperty("kind", "text");
      }

      point.exit()
        .remove();


      points.selectAll(function(actor) {
          return actor.dynamicProperty("kind") === "text";
        })
        .data(newDataPoints);

      //给所有point点及对应的文本节点绑定对应的数据
      point = lineSeries.selectAll(function(actor) {
        return actor.dynamicProperty("kind") === "point";
      });
      //mAssert(value.value.length === point.size(), "the length of value and object are mismatching!!")
      point.each(function(actor, index) {
        actor.setDynamicProperty("value", newDataPoints[index]);
        actor.setDynamicProperty("axisfields", value.axisfields);
      });

      return true;
    }

    return build;
  });