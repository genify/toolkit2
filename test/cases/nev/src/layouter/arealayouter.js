/*
 * ------------------------------------------
 * 区域填充(布局器)
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
  '{pro}/layouter/layouter.js'
], function(mColortraits, mAssert, mUtils, mPoint, mColorbox, mSmooth, mLayouter) {
  var PRIVATE = mColortraits.PRIVATE;
  var selection = mColorbox.selection;

  var calcuNullPointsInfo = function(xData, yData) {
    var newXData = [];
    var newYData = [];
    for (var i = 0; i < xData.length; i++) {
      if (!(xData[i].data == null || yData[i].data == null)) {
        newXData.push(xData[i]);
        newYData.push(yData[i]);
      }
    }
    return [newXData, newYData];
  };

  var getPointById = function(fieldname, id, data) {
    var findData = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].id == id)
        findData.push(data[i][fieldname]);
    }
    return findData;
  };

  var hashPush = function(key, index, hash) {
    if (hash[key]) {
      hash[key][1] += 1;
    } else {
      hash[key] = [index, 1];
    }
  };



  /**
   * 区域填充(布局器)
   * @class   module:layouter/arealayouter.AreaLayouter
   * @extends module:layouter/layouter.Layouter
   * @return  {AreaLayouter} 区域填充布局器
   */
  var AreaLayouter = mLayouter.extend({
    /**
     * 应用布局设置进行区域series的布局
     * @method  module:layouter/arealayouter.AreaLayouter#layout
     * @param  {seriesInfo} seriesInfo - series信息
     * @param {Rect} resource - 可用的矩形区域资源
     * @param {Selection} seriesesSelection - series的场景树根节点selection
     * @return {Object} result - 布局完成之后的布局状态及剩余资源信息
     */
    layout: function(seriesInfo, resource, seriesesSelection) {

      var monotonicDataArray = seriesInfo.monotonicDataArray;

      var topDataArray = seriesInfo.topDataArray;
      //   console.log("topData",topDataArray)

      var validPointsIndex = seriesInfo.validPointsIndex;

      var isEmpty = !topDataArray || topDataArray.length === 0;
      if (isEmpty) {
        return {
          info: {}
        };
      }

      var xScale = seriesInfo.hAxisScale;

      var yScale = seriesInfo.vAxisScale;

      var rawXData = seriesInfo.xData;

      var rawYData = seriesInfo.yData;

      var isX = seriesInfo.monotonicAxis !== "Y";


      // var re = calcuNullPointsInfo(seriesInfo.xData,seriesInfo.yData);

      // var xData = re[0];

      // var yData = re[1];

      if (isX) {
        var xData = seriesInfo.monotonicDataArray;
        var yData = seriesInfo.topDataArray;
      } else {
        var xData = seriesInfo.topDataArray;
        var yData = seriesInfo.monotonicDataArray;
      }

      // console.log("xData", xData);
      // console.log("yData", yData)

      this.setaxisCrossPoint(seriesInfo.axisCrossPoint);
      this.setbottomDataArray(seriesInfo.bottomDataArray);
      this.settopDataArray(seriesInfo.topDataArray);
      this.setmonotonicDataArray(seriesInfo.monotonicDataArray);


      if (seriesInfo.nullType === "dash") {
        for (var i = 0; i < xData.length - 1; i++) {
          linesIndex[i] = i;
        }
      } else {
        linesIndex = seriesInfo.normalLinesIndex;
      }

      var prePathInfoObj = seriesInfo.prePathInfoObj;

      //   console.log("prePathInfoObj",prePathInfoObj)

      this.setprePathInfoObj(prePathInfoObj);

      this._t.set_monotonicAxis(seriesInfo.monotonicAxis);

      var layoutData = [];

      if (this._t._monotonicAxis() != "Y") {
        for (var i = 0; i < xData.length; i++) {
          var recordId = xData[i].id;
          if (xScale.rangeBand) {
            var xPixelValue = xScale.exec(xData[i].id);
          } else {
            var xPixelValue = xScale.exec(xData[i].data);
          }
          var value = yData[i].data;
          var yPixelValue = yScale.exec(value);
          var yData_ = {
            id: yData[i].id,
            data: value
          };
          layoutData.push({
            value: value,
            id: yData[i].id,
            point: mPoint(xPixelValue, yPixelValue)
          });
        }
      } else {
        for (var i = 0; i < xData.length; i++) {
          var xPixelValue = xScale.exec(xData[i].data);
          if (yScale.rangeBand) {
            var yPixelValue = yScale.exec(yData[i].id);
          } else {
            var yPixelValue = yScale.exec(yData[i].data);
          }
          var value = xData[i].data;
          var xData_ = {
            id: xData[i].id,
            data: value
          };
          layoutData.push({
            value: value,
            id: xData[i].id,
            point: mPoint(xPixelValue, yPixelValue)
          });
          //     console.log("layData...",xPixelValue,yPixelValue)
        }

      }

      var bottomLayoutData = prePathInfoObj ? prePathInfoObj['bottomLayoutData'] : [];

      var pathInfo = this._t.__applyScene(layoutData, seriesesSelection, {
        smooth: seriesInfo.smooth
      }, prePathInfoObj, linesIndex, bottomLayoutData, validPointsIndex);
      return {
        ok: true,
        remainingSpace: resource,
        info: {
          prePathInfoObj: pathInfo
        },
        scene: seriesesSelection
      };
    },

    __generateLinesPath: function(layoutData, lineStartPointIndex, smooth) {
      var pointArray = layoutData.map(function(d) {
        return d.point;
      });
      var axisCrossPoint = this.axisCrossPoint();
      var prePathInfoObj = this.prePathInfoObj();
      var bottomPath = prePathInfoObj ? prePathInfoObj.syntropyPath : undefined;
      var preHash = prePathInfoObj ? prePathInfoObj.preHash : undefined;
      var bottomLayoutData = prePathInfoObj ? prePathInfoObj.bottomLayoutData : undefined;
      var zonePath = [];
      var reversePath = [];
      var preReversePath = prePathInfoObj ? prePathInfoObj.reversePath : undefined;
      var reversePathObj = {};
      var hash = {};
      var zonePathObj = {};
      var pathIndex = 0;
      var lineCome = true;
      var isX = this._t._monotonicAxis() != "Y";
      var cps = smooth ? mSmooth.smoothBezier(pointArray, this._t._monotonicAxis() != "Y") : undefined;
      var tempPoint = isX ? mPoint(pointArray[0].x, axisCrossPoint.y) : mPoint(axisCrossPoint.x, pointArray[0].y);
      var findData = bottomLayoutData ? getPointById("point", layoutData[0].id, bottomLayoutData) : [];
      var preFirstPoint = bottomLayoutData ? findData[0] : tempPoint;
      zonePath.push(["M", preFirstPoint.x, preFirstPoint.y]);
      pathIndex++;
      for (var i = 0; i < pointArray.length; i++) {
        if (lineStartPointIndex.indexOf(i) >= 0) {
          if (lineCome) {
            var tempPoint = isX ? mPoint(pointArray[i].x, axisCrossPoint.y) : mPoint(axisCrossPoint.x, pointArray[i].y);
            var findData = bottomLayoutData ? getPointById("point", layoutData[i].id, bottomLayoutData) : [];
            var point0 = bottomLayoutData ? findData[0] : tempPoint;
            zonePath.push(["L", point0.x, point0.y]);
            hashPush(layoutData[i].id, pathIndex++, hash);
            zonePath.push(["L", pointArray[i].x, pointArray[i].y]);
            reversePath.push(["L", point0.x, point0.y]);
            reversePath.push(["L", pointArray[i].x, pointArray[i].y]);
            hashPush(layoutData[i].id, pathIndex++, hash);
          }
          if (smooth) {
            zonePath.push(["C", cps[2 * i].x, cps[2 * i].y, cps[2 * i + 1].x, cps[2 * i + 1].y, pointArray[i + 1].x, pointArray[i + 1].y]);
            reversePath.push(["C", cps[2 * i + 1].x, cps[2 * i + 1].y, cps[2 * i].x, cps[2 * i].y, pointArray[i].x, pointArray[i].y, "NNNNNN"]);
          } else {
            //  zonePath.push(["L", pointArray[i].x, pointArray[i].y]);
            //  hashPush(layoutData[i].id,++pathIndex,hash);
            zonePath.push(["L", pointArray[i + 1].x, pointArray[i + 1].y]);
            //  reversePath.push(["L", pointArray[i].x, pointArray[i].y]);
            reversePath.push(["L", pointArray[i + 1].x, pointArray[i + 1].y]);
          }
          hashPush(layoutData[i + 1].id, pathIndex++, hash);
          lineCome = false;
        } else {
          var tempPoint = isX ? mPoint(pointArray[i].x, axisCrossPoint.y) : mPoint(axisCrossPoint.x, pointArray[i].y);
          var findData = bottomLayoutData ? getPointById("point", layoutData[i].id, bottomLayoutData) : [];
          var point1 = bottomLayoutData ? findData[0] : tempPoint;
          //  console.log(layoutData[i].point,point1,"sa")
          if (!lineCome) {
            zonePath.push(["L", pointArray[i].x, pointArray[i].y]);
            hashPush(layoutData[i].id, pathIndex++, hash);
            reversePath.push(["L", pointArray[i].x, pointArray[i].y]);
            zonePath.push(["L", point1.x, point1.y]);
            hashPush(layoutData[i].id, pathIndex++, hash);
            reversePath.push(["L", point1.x, point1.y]);

          } else {
            layoutData[i].point = point1; //替换孤点
            // zonePath.push(["L", point1.x, point1.y]);
            // hashPush(layoutData[i].id,pathIndex++,hash);
            // reversePath.push(["L", point1.x, point1.y]);
          }
          if (i < pointArray.length - 1) {
            if (bottomPath) {
              var lid = layoutData[i].id;
              var count = preHash[lid][1];
              var first = preHash[lid][0];
              for (var ii = 1; ii < count; ii++) {
                var subPath = bottomPath[first + ii];
                zonePath.push(subPath);
                hashPush(lid, pathIndex++, hash);
                var index = first + ii;
                var reverseIndex = preReversePath.length - index;
                reversePath.push(preReversePath[reverseIndex])
              }
              var lid = layoutData[i + 1].id;
              var count = preHash[lid][1];
              var first = preHash[lid][0];
              for (var ii = 0; ii < count; ii++) {
                var subPath = bottomPath[first + ii];
                zonePath.push(subPath);
                hashPush(lid, pathIndex++, hash);
                var index = first + ii;
                var reverseIndex = preReversePath.length - index;
                reversePath.push(preReversePath[reverseIndex])

              }
            } else {
              var tempPoint = isX ? mPoint(pointArray[i + 1].x, axisCrossPoint.y) : mPoint(axisCrossPoint.x, pointArray[i + 1].y);
              zonePath.push(["L", tempPoint.x, tempPoint.y]);
              reversePath.push(["L", tempPoint.x, tempPoint.y]);
              hashPush(layoutData[i + 1].id, pathIndex++, hash);
            }
          }
          lineCome = true;
        }
      }
      // console.log(preHash,hash)
      // console.log("正向", zonePath);
      // console.log("本次逆向",reversePath)
      // console.log("上一次逆向",preReversePath)

      reversePath.reverse();
      reversePathObj.startPoint = pointArray[pointArray.length - 1];
      reversePathObj.preHash = hash;
      reversePathObj.syntropyPath = zonePath;
      reversePathObj.reversePath = reversePath;
      reversePathObj.bottomLayoutData = layoutData;
      zonePathObj.zonePath = zonePath;
      zonePathObj.endPoint = pointArray[pointArray.length - 1];
      zonePathObj.reversePathObj = reversePathObj;
      return zonePathObj;
    },



    /**
     * 应用场景节点布局
     * @method  module:layouter/arealayouter.AreaLayouter#__applyScene
     * @param   {Object} layoutData - area的布局器数据
     * @param   {Selection} seriesesSelection - area场景根节点selection
     * @param   {Object} param - area style
     * @return  {Void}
     */
    __applyScene: function(layoutData, seriesesSelection, param, preReversePathObj, linesIndex, bottomLayoutData, validPointsIndex) {
      //   var layoutData = this.exec();
      var reversePath = [];
      var lineDatas = this._t.__calcutelineDatas(layoutData, param.smooth, linesIndex);
      //  var reversePath = lineDataInfo[1];

      seriesesSelection.selectAll(function(actor) {
          return actor.dynamicProperty("kind") == "point";
        })
        .each(function(actor, index) {
          var data = layoutData[validPointsIndex[index]];
          actor.setDynamicProperty("data", data);
          actor.setx(Math.round(data.point.x));
          actor.sety(Math.round(data.point.y));
          //actor.children()[0].setDynamicProperty("data", data);
        });
      var zonePathObj = this._t.__calcutezoneDatas(layoutData, param.smooth, linesIndex, bottomLayoutData);
      var reversePathObj = zonePathObj.reversePathObj; //zoneDataInfo[1];
      var totalPath = [];
      seriesesSelection.select(function(actor) {
          return actor.dynamicProperty("kind") == "zone";
        })
        .each(function(actor, index) {
          var path = zonePathObj.zonePath;
          if (preReversePathObj && preReversePathObj.reversePath.length > 0) {
            //    path.push(["L", zonePathObj.endPoint.x, zonePathObj.endPoint.y, preReversePathObj.startPoint.x, preReversePathObj.startPoint.y]);
            totalPath = path.concat(preReversePathObj.reversePath);
          } else {
            totalPath = path;
          }
          //   console.log("totalPath",totalPath)
          totalPath.push(["Z"]);
          actor.setpathElements(totalPath);
        });


      var linesSelection = seriesesSelection.selectAll(function(actor) {
        return actor.dynamicProperty("kind") == "line";
      });
      linesSelection.each(function(actor, index) {
        var d = lineDatas[index];
        actor.setDynamicProperty("data", d);
        if (!param.smooth) {
          actor.setvertexes(d);
        } else {
          actor.setpathElements([
            ["M", d[0].x, d[0].y],
            ["C", d[1].x, d[1].y, d[2].x, d[2].y, d[3].x, d[3].y]
          ]);
        }
      });



      return reversePathObj;

    },

    __calcutezoneDatas: function(layoutData, smooth, lineStartPointIndex, bottomLayoutData) {

      zonePathObj = this._t.__generateLinesPath(layoutData, lineStartPointIndex, smooth);

      return zonePathObj;
    },

    __calcutelineDatas: function(layoutData, smooth, lineStartPointIndex) {
      var lineDatas = [];
      var len = lineStartPointIndex.length;
      var pointDatas = layoutData.map(function(d) {
        return d.point;
      });
      if (!smooth) {
        for (var i = 0; i < len; i++) {
          var linesPointIndex = lineStartPointIndex[i];
          lineDatas.push([pointDatas[linesPointIndex], pointDatas[linesPointIndex + 1]]);
        }
      } else {
        var cps = mSmooth.smoothBezier(pointDatas, this._t._monotonicAxis() == "X");
        for (var i = 0; i < len; i++) {
          var linesPointIndex = lineStartPointIndex[i];
          lineDatas.push([pointDatas[linesPointIndex], cps[2 * linesPointIndex], cps[2 * linesPointIndex + 1], pointDatas[linesPointIndex + 1]]);
        }
      }
      return lineDatas;
    },


    calcuReversePath: function(path) {
      var newPath = [];
      newPath.push(path[0]);
      for (var i = (path.length - 1) / 2; i >= 1; i--) {
        newPath.push(path[2 * i - 1]);
        newPath.push(path[2 * i]);
      }
      return newPath;
    }

  }, [PRIVATE("_monotonicAxis"), "bottomDataArray", "axisCrossPoint", "prePathInfoObj", "topDataArray", "monotonicDataArray", PRIVATE("_groupId")])

  return AreaLayouter;
});