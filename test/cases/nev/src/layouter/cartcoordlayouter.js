/*
 * ------------------------------------------
 * 直角坐标系(布局器)
 * @version  0.0.1
 * @author   zjy(zhangjianyi@corp.netease.com)
 * ------------------------------------------
 */
/** @module layouter */
define(['{pro}/libs/colortraits.js',
  '{pro}/tools/assert.js',
  '{pro}/chart/preprocess.js',
  '{pro}/tools/utils.js',
  '{pro}/tools/point.js',
  '{pro}/libs/colorbox.js',
  '{pro}/tools/area.js',
  '{pro}/layouter/axislayouter.js',
  '{pro}/layouter/layouter.js'
], function(mColortraits, mAssert, mPreprocess, mUtils, mPoint, mColorbox, mArea, mLayoutAxis, mLayouter) {
  var PRIVATE = mColortraits.PRIVATE;
  var selection = mColorbox.selection;
  var hashTable = {};
  var preHeight = {};
  var preWidth = {};

  var CartCoordLayouter = mLayouter.extend({
    /**
     * 直角坐标系(布局器)
     * @class   module:layouter/cartcoordlayouter.CartCoordLayouter
     * @extends module:layouter/layouter.Layouter
     * @return  {CartCoordLayouter} 直角坐标系布局器
     */
    initialize: function() {
      this.sethAxises(null);
      this.setvAxises(null);
      this.sethValidOffsetValues({});
      this.setvValidOffsetValues({});
    },


    /**
     * 应用布局设置进行直角坐标系的布局
     * @method  module:layouter/cartcoordlayouter.CartCoordLayouter#layout
     * @param  {Object} cartesianInfo - 直角坐标系信息
     * @param {Rect} resource - 可用的矩形区域资源
     * @param {Scene} rootSelection - 笛卡尔坐标系的场景树根节点
     * @return {Object} result - 布局完成之后的布局状态及剩余资源信息
     */
    layout: function(cartesianInfo, resource, rootSelection) {
      var cartCoordInfo = cartesianInfo;
      var area = resource;
      var xAxisesInfos = cartCoordInfo.xAxisesInfos;
      var yAxisesInfos = cartCoordInfo.yAxisesInfos;
      if (!(this.hAxises() || this.vAxises())) {
        this.sethAxises([]);
        this.setvAxises([]);
        for (var i = 0; i < xAxisesInfos.length; i++) {
          this.hAxises().push(mLayoutAxis.create());
          hashTable[xAxisesInfos[i].id] = i;
        }
        for (i = 0; i < yAxisesInfos.length; i++) {
          this.vAxises().push(mLayoutAxis.create());
          hashTable[yAxisesInfos[i].id] = i;
        }
      }
      for (var i = 0; i < xAxisesInfos.length; i++) {
        preHeight[xAxisesInfos[i].id] = 0;
      }
      for (var i = 0; i < yAxisesInfos.length; i++) {
        preWidth[yAxisesInfos[i].id] = 0;
      }
      var allAxisesTreeBboxes = {};
      var hAxises = this.hAxises();
      var vAxises = this.vAxises();
      var bottomStart = 0;
      var topEnd = 0;
      var leftStart = 0;
      var rightEnd = 0;
      var xAxisesNums = xAxisesInfos.length;
      var yAxisesNums = yAxisesInfos.length;
      var hLineAndTicksSelection = {};
      var vLineAndTicksSelection = {};
      var loopTimes = 0;
      var hNewRange = [];
      var vNewRange = [];
      var isTerminate = false;
      var xAxisesRootSelection = rootSelection.select(function(actor) {
        return actor.dynamicProperty("id") === "xAxises";
      });
      var yAxisesRootSelection = rootSelection.select(function(actor) {
        return actor.dynamicProperty("id") === "yAxises";
      });
      for (var i = 0; i < xAxisesNums; i++) {
        var hAxisInfo = xAxisesInfos[i];
        if (xAxisesNums === 2) {
          hAxisInfo.gridEndPadding = false;
        } else {
          hAxisInfo.gridEndPadding = true;
        }
        hAxisInfo.range = [0, area.width];
      }
      for (var i = 0; i < yAxisesNums; i++) {
        var vAxisInfo = yAxisesInfos[i];
        if (yAxisesNums === 2) {
          vAxisInfo.gridEndPadding = false;
        } else {
          vAxisInfo.gridEndPadding = true;
        }
        vAxisInfo.range = [area.height, 0];
      }

      do {
        for (var i = 0; i < xAxisesNums; i++) {
          var hAxisInfo = xAxisesInfos[i];
          var xaxisSelection = xAxisesRootSelection.select(function(actor) {
            return actor.dynamicProperty('id') == hAxisInfo.id;
          });
          var hAxis = hAxises[i];
          var hOrient = hAxisInfo.position;
          var hResult = hAxis.layout(hAxisInfo, resource, xaxisSelection);
          hLineAndTicksSelection[hAxisInfo.id] = hResult.info;
          if (hOrient === "bottom") {
            bottomStart = hResult.info.treeBbox.height - preHeight[hAxisInfo.id];

          } else if (hOrient === "top") {
            topEnd = hResult.info.treeBbox.height - preHeight[hAxisInfo.id];
          }
          preHeight[hAxisInfo.id] = hResult.info.treeBbox.height;

          allAxisesTreeBboxes[hAxisInfo.id] = {
            treeBbox: hResult.info.treeBbox,
            orient: hOrient
          };
        }

        for (var i = 0; i < yAxisesNums; i++) {
          var vAxisInfo = yAxisesInfos[i];
          var vAxis = vAxises[i];
          var vOrient = vAxisInfo.position;
          var yaxisSelection = yAxisesRootSelection.select(function(actor) {
            return actor.dynamicProperty('id') == vAxisInfo.id;
          });
          var vResult = vAxis.layout(vAxisInfo, resource, yaxisSelection);
          vLineAndTicksSelection[vAxisInfo.id] = vResult.info;
          if (vOrient === "left") {
            leftStart = vResult.info.treeBbox.width - preWidth[vAxisInfo.id];
          } else if (vOrient === "right") {
            rightEnd = vResult.info.treeBbox.width - preWidth[vAxisInfo.id];
          }
          preWidth[vAxisInfo.id] = vResult.info.treeBbox.width;
          allAxisesTreeBboxes[vAxisInfo.id] = {
            treeBbox: vResult.info.treeBbox,
            orient: vOrient
          };
        }
        hNewRange[0] = hAxisInfo.range[0] + leftStart;
        hNewRange[1] = hAxisInfo.range[1] - rightEnd;
        vNewRange[0] = vAxisInfo.range[0] - bottomStart;
        vNewRange[1] = vAxisInfo.range[1] + topEnd;
        for (var i = 0; i < xAxisesNums; i++) {
          var hAxisInfo = xAxisesInfos[i];
          hAxisInfo.range = hNewRange;
        }
        for (var i = 0; i < yAxisesNums; i++) {
          var vAxisInfo = yAxisesInfos[i];
          vAxisInfo.range = vNewRange;
        }
        var result = this._remainResource(allAxisesTreeBboxes, resource);
        for (var i = 0; i < xAxisesInfos.length; i++) {
          if (xAxisesInfos[i].position === "bottom") {
            xAxisesInfos[i].gridEnd = -result.remainingSpace.height;
          } else {
            xAxisesInfos[i].gridEnd = result.remainingSpace.height;
          }
        }
        for (var i = 0; i < yAxisesInfos.length; i++) {
          if (yAxisesInfos[i].position === "left") {
            yAxisesInfos[i].gridEnd = result.remainingSpace.width;
          } else {
            yAxisesInfos[i].gridEnd = -result.remainingSpace.width;
          }
        }

        loopTimes++;
        isTerminate = (Math.abs(leftStart) < 1.1 && Math.abs(rightEnd) < 1.1 && Math.abs(bottomStart) < 1.1 && Math.abs(topEnd) < 1.1);
      } while (!isTerminate && loopTimes < 10 );




      this._t.__myAxisOffset(cartCoordInfo, hLineAndTicksSelection, vLineAndTicksSelection, hAxises, vAxises);

      //////////////////======设置series的对应scale
      var hValidOffsetValues = this.hValidOffsetValues();
      var vValidOffsetValues = this.vValidOffsetValues();
      for (var i = 0; i < cartesianInfo.seriesInfos.length; i++) {
        var seriesInfo = cartesianInfo.seriesInfos[i];
        var x;
        var y;
        seriesInfo.axisCrossPoint = {};
        var hAxis = mPreprocess.getAxisInfoById(hAxises, hashTable[seriesInfo.xID]);
        var vAxis = mPreprocess.getAxisInfoById(vAxises, hashTable[seriesInfo.yID]);
        var hAxisInfo = mPreprocess.getAxisInfoById(xAxisesInfos, seriesInfo.xID);
        var vAxisInfo = mPreprocess.getAxisInfoById(yAxisesInfos, seriesInfo.yID);
        seriesInfo.hAxisScale = (hAxis && hAxis.scale()) ? hAxis.scale() : null;
        seriesInfo.vAxisScale = (vAxis && vAxis.scale()) ? vAxis.scale() : null;
        seriesInfo.hTickValues = (hAxis && hAxis.tickValues()) ? hAxis.tickValues() : null;
        seriesInfo.vTickValues = (vAxis && vAxis.tickValues()) ? vAxis.tickValues() : null;
        y = hValidOffsetValues[seriesInfo.xID] + hAxis.root().y();
        x = vValidOffsetValues[seriesInfo.yID] + vAxis.root().x();

        if ((y > hAxis.root().y() && hAxis.orient() === "bottom") || (y < hAxis.root().y() && hAxis.orient() === "top")) {
          seriesInfo.axisCrossPoint.y = hAxis.root().y();
        } else {
          seriesInfo.axisCrossPoint.y = y;
        }
        if ((x > hAxis.root().x() && vAxis.orient() === "right") || (x < vAxis.root().x() && vAxis.orient() === "left")) {
          seriesInfo.axisCrossPoint.x = hAxis.root().x();
        } else {
          seriesInfo.axisCrossPoint.x = x;
        }

      };

      if (result.ok) {
        return {
          ok: true,
          remainingSpace: result.remainingSpace,
          info: [],
          scene: rootSelection
        };
      } else {
        return {
          ok: false,
          msg: "The givenSpace is not enough",
          remainingSpace: result.remainingSpace,
          info: [],
          scene: rootSelection
        };
      }
    },

    __myAxisOffset: function(cartCoordInfo, hLineAndTicksSelection, vLineAndTicksSelection, hAxises, vAxises) {
      ///////对水平轴	
      var hValidOffsetValues = this.hValidOffsetValues();
      var vValidOffsetValues = this.vValidOffsetValues();
      var j = 0;
      for (var i in hLineAndTicksSelection) {
        var lineSelection = hLineAndTicksSelection[i].axisLine;
        var ticksSelection = hLineAndTicksSelection[i].axisTicks;
        var hAxisInfo = mPreprocess.getAxisInfoById(cartCoordInfo.xAxisesInfos, i);
        var orient = hAxisInfo.position;
        var offset = hAxisInfo.offset;
        var type = typeof(offset);
        var offsetdistance = 0;
        var initdistance = 0;
        var realdistance = 0;
        switch (type) {
          case "number":
            offsetdistance = offset;
            break;
          case "object":
            var orthogonal = mPreprocess.getAxisInfoById(vAxises, offset.which);
            offsetdistance = orthogonal.scale().exec(offset.value) - hAxises[hashTable[i]].root().y();
            break;
          default:
            throw "illegal offset ---> " + offset;
            break;
        }

        offsetdistance = (!isNaN(offsetdistance)) ? offsetdistance : hValidOffsetValues[i];
        hValidOffsetValues[i] = offsetdistance;
        lineSelection.setProperty("y", offsetdistance);
        ticksSelection.setProperty("y", offsetdistance);
      }

      ///////////对垂直轴
      for (var i in vLineAndTicksSelection) {
        var lineSelection = vLineAndTicksSelection[i].axisLine;
        var ticksSelection = vLineAndTicksSelection[i].axisTicks;
        var vAxisInfo = mPreprocess.getAxisInfoById(cartCoordInfo.yAxisesInfos, i);
        var orient = vAxisInfo.position;
        var offset = vAxisInfo.offset;
        var type = typeof(offset);
        var offsetdistance = 0;
        var initdistance = 0;
        var realdistance = 0;
        switch (type) {
          case "number":
            offsetdistance = offset;
            break;
          case "object":
            var orthogonal = mPreprocess.getAxisInfoById(hAxises, offset.which);
            offsetdistance = orthogonal.scale().exec(offset.value) - vAxises[hashTable[i]].root().x();
            break;
          default:
            throw "illegal offset ---> " + offset;
            break;
        }
        offsetdistance = (!isNaN(offsetdistance)) ? offsetdistance : vValidOffsetValues[i];
        vValidOffsetValues[i] = offsetdistance;
        lineSelection.setProperty("x", offsetdistance);
        ticksSelection.setProperty("x", offsetdistance);
      }
      return this;
    },

    _remainResource: function(allAxisesTreeBboxes, resource) {
      var tempSpace;
      var left = resource.left;
      var right = resource.right;
      var bottom = resource.bottom;
      var top = resource.top;
      for (var i in allAxisesTreeBboxes) {
        var treeBbox = allAxisesTreeBboxes[i].treeBbox;
        switch (allAxisesTreeBboxes[i].orient) {
          case "left":
            left += treeBbox.width;
            break;
          case "right":
            right -= treeBbox.width;
            break;
          case "bottom":
            bottom -= treeBbox.height;
            break;
          case "top":
            top += treeBbox.height
            break;
        }
      }
      var remainingSpace = {
        left: left,
        right: right,
        bottom: bottom,
        top: top,
        width: right - left,
        height: bottom - top
      };
      if (remainingSpace.width >= 0 && remainingSpace.height >= 0) {
        return {
          ok: true,
          remainingSpace: remainingSpace
        };
      } else {
        return {
          ok: false,
          remainingSpace: resource
        };
      }
    },

    /**
     * 通过id获取轴的布局
     * @private
     * @method  module:layouter/cartcoordlayouter.CartCoordLayouter#__getAxisLayoutById
     * @param   {Array} axislayouts - axislayouter对象数组
     * @param   {Number | String} id - aixs的id
     * @return  {Object} - axisLayouter对象
     */
    __getAxisLayoutById: function(ais, id) {
      //根据id（string || number）获取轴的信息
      var ai;
      if (typeof(id) === "number" && id >= 0 && id < ais.length) {
        ai = ais[id];
      } else if (typeof(id) === "string") {
        for (var i = 0; i < ais.length; i++) {
          if (ais[i].id() === id) {
            ai = ais[i];
          }
        };
      }
      mAssert(ai, "can not find axis:" + id);
      return ai;
    },


  }, ["hAxises", "vAxises", "hValidOffsetValues", "vValidOffsetValues"]);

  return CartCoordLayouter;
});