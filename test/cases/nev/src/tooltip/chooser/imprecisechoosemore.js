/*
 * ------------------------------------------
 * tooltip轴选择器的基类
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module chooser/imprecisechoosemore */
define(['{pro}/tooltip/chooser/imprecisetooltip.js',
    '{pro}/libs/colorbox.js'
  ],
  function(
    mImPreciseTooltip,
    mColorbox) {

    var selection = mColorbox.selection;

    var typeMap = {
      line: "point",
      bar: "bar",
      area: "point",
      scatter: "scatter",
      pie: "pie"
    }

    /**
     * axis选择器的基类
     * @class   module:chooser/imprecisechooseone.ImPreciseChooseMore
     * @extends module:chooser/chooser.mImPreciseTooltip
     */
    var ImPreciseChooseMore = mImPreciseTooltip.extend({
      /**
       * 初始化
       * @param  {Object}   {root: , area, } - 要绑定tooltip的场景树的根节点和area区域
       * @return  {ImPreciseTooltipOneNode} 实例
       */
      initialize: function(param) {
        this.execProto("initialize", param);

        this.set_type("more");
      },
      /**
       * 选择功能单元
       * @method  module:chooser/imprecisechooseone.ImPreciseChooseMore#choose
       * @param {Number} - evtx 鼠标的x位置
       * @param {Number} - evty 鼠标的y位置
       * @param {Array} - 交互的对象 [{series: root, exact: node}, {series: root, exact: node}]
       */
      choose: function(evtx, evty) {
        var scene = this.scene();
        var sceneSelection = selection.select(scene);
        var seriesInfos = this._seriesInfos();
        var xOry = this.orient() == "horizontal" ? "x" : "y";
        var dimension = xOry == "x" ? "width" : "height";
        var pos = xOry == "x" ? evtx : evty;
        var actors = [];
        for (var i = 0, len = seriesInfos.length; i < len; i++) {
          if (!seriesInfos[i].hidden) {
            var seriesSelection = sceneSelection.select(function(actor) {
              return actor.dynamicProperty('id') == seriesInfos[i].id;
            });
            var sb_root = seriesSelection.getElement(0, 0);
            var type = seriesInfos[i].type;
            var rootSelection = selection.select(sb_root);
            var actorSelection = rootSelection.selectAll(function(actor) {
              return actor.dynamicProperty("kind") == typeMap[type];
            });
            var parentChild = {
              series: sb_root,
              type: type
            };
            var distance = Infinity;
            var selectedActor;
            actorSelection.each(function(actor, index) {
              var bbox = actor.bbox();
              var curDistance = Math.abs(bbox[xOry] + bbox[dimension] / 2 - pos);
              if (distance > curDistance) {
                distance = curDistance;
                selectedActor = actor;
              }
            })
            parentChild.exact = selectedActor;
            if (!!selectedActor) {
              actors.push(parentChild);
            }
          }
        }
        console.log("*******",actors);
        return actors;
      }
    }, []);


    return ImPreciseChooseMore;

  });