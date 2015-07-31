/*
 * ------------------------------------------
 * tooltip轴选择器的基类
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module chooser/imprecisetooltip */
define(['{pro}/tooltip/chooser/chooser.js',
    '{pro}/libs/colorbox.js',
    '{pro}/tooltip/tooltipmanager.js',
    '{pro}/config/visualencoding/skin.js'
  ],
  function(
    mChooser,
    mColorbox,
    mTooltipManager,
    mSkin) {

    var selection = mColorbox.selection;
    var Rect = mColorbox.Rect;
    var xyMap = {
          x: "xData",
          y: "yData"
        }

    /**
     * axis选择器的基类
     * @class   module:chooser/imprecisetooltip.ImPreciseTooltip
     * @extends module:chooser/chooser.Chooser
     * @extends module:chooser/chooser.Chooser
     */
    var ImPreciseTooltip = mChooser.extend({
      /**
       * 初始化
       * @param  {Object}   {root: , area, } - 要绑定tooltip的场景树的根节点和area区域
       * @return  {ImPreciseTooltipOneNode} 实例
       */
      initialize: function(param) {
        this.execProto("initialize", param);

        this.set_oldNodes([]);
        this.set_newNodes([]);

      },
      /**
       * 精确的选择功能单元，给scene场景树中特定的节点添加tooltip的功能
       * @method  module:chooser/precisemousechooser.ImPreciseTooltipOneNode#choose
       */
      interactResponse: function() {
        var scene = this.scene();
        var area = this.area();
        var sceneSelection = selection.select(scene);
        var areanode = sceneSelection.select(function(actor) {
          return actor.dynamicProperty("kind") == "axisarea";
        });
        if (!areanode.size()) {
          var node = Rect.create({
            width: area.width,
            height: area.height,
            z: 3000
          });
          node.setDynamicProperty("kind", "axisarea");

          this.set_axisArea(node);
          scene.addChild(node);

          var self = this;
          var format = this.format();
          var formatInput = [];

          var callback = function(evt) {

            var actor = evt.actor;
            if (evt.type == "mouseOver") {
              var newActors = self.choose(evt.mouseX, evt.mouseY);

              self._defautResponse(newActors, evt.type);
              if (newActors.length === 0) {
                return;
              }
                // console.log("moveOver===")
              self._tooltipResponse(newActors, evt);
            } else if (evt.type == "mouseOut") {
              //   console.log("moveOut===")
              self._defautResponse([], evt.type);
              scene.removeChild(mTooltipManager.tooltip());
            } else if (evt.type == "mouseMoved") {
              //  console.log("mouseMoved===")
              var newActors = self.choose(evt.mouseX, evt.mouseY);
              //  console.log("newAc",newActors)
              self._defautResponse(newActors, evt.type);
              if (newActors.length === 0) {
                return;
              }
              self._tooltipResponse(newActors, evt);
            }
          }

          node.addEventListener("mouseOver", callback);
          node.addEventListener("mouseOut", callback);
          node.addEventListener("mouseMoved", callback);
        }

      },

      _defaultFormat: function(newNodes, oldNodes, tyoe) {

        var tooltipContent = [];
        var result = [];
        for (var i = 0; i < newNodes.length; i++) {
          var actor = newNodes[i].exact;
          var value = actor.dynamicProperty("value");
          var axisFields = actor.dynamicProperty("axisfields");
          var accValue = actor.dynamicProperty("accValue");
          if (value == undefined || axisFields == undefined)
            return tooltipContent;
          for (var key in axisFields) {
            result.push("" + axisFields[key] + ": " + value[xyMap[key]]);
          }
          if (accValue) {
            result.push("" + "total" + ": " + accValue);
          }

          // for(var i = 0, len = axisFields.length; i < len; i++) {
          //   result.push(""+axisFields[i] + ": " + value[axisFields[i]]);
          // }
        }
        tooltipContent = tooltipContent.concat(result);
        return tooltipContent;
      },

      /**
       * 删除scene场景树上节点的tooltip的功能
       * @method  module:chooser/precisemousechooser.ImPreciseTooltipOneNode#_defautResponse
       */
      _defautResponse: function(newNodes, type) {
        var oldNodes = this._oldNodes();
        for (var i = 0, length = oldNodes.length; i < length; i++) {
          var tempnode = oldNodes[i].exact;
          tempnode.setshadowColor(undefined);
          tempnode.setshadowBlur(0);
          if (tempnode.type !== "bar") {
            var preScale = tempnode.dynamicProperty("preScale");
            if (preScale) {
              tempnode.setDynamicProperty("preScale", null);
              tempnode.setscale(preScale);
            }
          }
        }
        this.set_oldNodes(newNodes);
        this.set_newNodes(newNodes);
        for (var i = 0, length = newNodes.length; i < length; i++) {
          var actor = newNodes[i].exact;
          //actor.actionfillStyle = actor.fillStyle();
          var color = actor.strokeStyle() !== undefined ? actor.strokeStyle() : mSkin.tooltipcolors;
          //actor.setfillStyle(color);
          actor.setshadowColor(color);
          actor.setshadowBlur(20);
          if (newNodes[i].type !== "bar") {
            var preScale = actor.scale();
            actor.setDynamicProperty("preScale", preScale);
            actor.setscale({
              sx: preScale.sx + 0.25,
              sy: preScale.sy + 0.25
            });
          }
        }
      },
      /**
       * 删除scene场景树上节点的tooltip的功能
       * @param  {Object}   nodes - 响应的交互节点们
       * @param  {evt}   event - 响应的交互参数
       * @method  module:chooser/precisemousechooser.ImPreciseTooltipOneNode#_tooltipResponse
       */
      _tooltipResponse: function(newNodes, evt) {
        var sceneSelection = selection.select(this.scene());
        var outText;
        var formatInput = [];
        var area = this.area();
        var format = this.format();
        var inputActors = newNodes.map(function(actor) {
          return actor.exact;
        });
        var type = this._type();
        var x, y;
        var sceneBbox = this.scene().bbox();
        for (var i = 0, len = inputActors.length; i < len; i++) {
          var actor = inputActors[i];
          var value = actor.dynamicProperty("value");
          var axisFields = actor.dynamicProperty("axisfields");
          formatInput.push({
            value: value,
            axisFields: axisFields
          });
        }
        if (format === undefined) {
          outText = this._defaultFormat(this._newNodes(), this._oldNodes(), type);
        } else {
          var resultArray = [];
          for (var i = 0; i < newNodes.length; i++) {
            var result = {};
            var actor = newNodes[i].exact;
            var seriesActor = newNodes[i].series;
            var tooltipContent = [];
            var value = actor.dynamicProperty("value");
            var axisFields = actor.dynamicProperty("axisfields");
            var accValue = actor.dynamicProperty("accValue");

            if (value == undefined || axisFields == undefined)
              return tooltipContent;
            for (var i in axisFields) {
              //	result.push(""+axisFields[i] + ": " + value[axisFields[i]]);
              if (i === "x") {
                result.xFieldName = axisFields[i];
                result.xValue = value[xyMap[i]];
              } else {
                result.yFieldName = axisFields[i];
                result.yValue = value[xyMap[i]];
              }

              result.seriesName = seriesActor.dynamicProperty("seriesName");
              result.total = accValue;
            }
            resultArray.push(result);
          }
          outText = format(resultArray, this._newNodes(), this._oldNodes());
        }

        if (type == "one") {
          var actorbbbox = newNodes[0].exact.bbox();
          if (this.orient() !== "vertical") {
            x = actorbbbox.x + actorbbbox.width / 2;
            y = actorbbbox.y - sceneBbox.y;
          } else {
            x = actorbbbox.x + actorbbbox.width;
            y = actorbbbox.y + actorbbbox.height / 2;
          }

        } else {
          x = evt.mouseX - sceneBbox.x;
          y = evt.mouseY - sceneBbox.y;
        }
        // console.log("_tooltipResponse",outText)
        return mTooltipManager.manufacture(sceneSelection, [{
          x: x,
          y: y,
          actors: inputActors,
          outText: outText
        }], area);
      },
      /**
       * 删除scene场景树上节点的tooltip的功能
       * @method  module:chooser/precisemousechooser.ImPreciseTooltipOneNode#clean
       */
      clean: function() {
        var scene = this.scene();
        var node = this._axisArea();
        if (node) {
          node.removeAllEventListener("mouseOver");
          node.removeAllEventListener("mouseOut");
          node.removeAllEventListener("mouseMoved");
          scene.removeChild(node);
          this.set_axisArea(undefined);
        }
      }
    }, ["_oldNodes", "_newNodes", "_axisArea", "outText"]);


    return ImPreciseTooltip;

  });