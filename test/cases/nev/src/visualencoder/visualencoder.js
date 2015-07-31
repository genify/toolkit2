/*
 * ------------------------------------------
 * 节点的视觉效果
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module visualencoder */
define(['{pro}/libs/colorbox.js'], 
      function(
        mColorbox){
        /**
         * 视觉命名空间
         */
        var VisualEncoder = {
          /**
           * 将输入的visualEncoding数据应用到输入的节点上
           * @function VisualEncoder.apply 
           * @param {Object} scenetreeSelection - 要设置视觉效果的场景树selection
           * @param {Array}  visualEncoding - 视觉数据，数据格式见：../../doc/dev/visualencoder/visualencoder-design.html
           * @return  {Void}
           */
          apply: function(scenetreeSelection, visualEncoding){
          				if(!scenetreeSelection)return;

                  for(var i = 0, len = visualEncoding.length; i < len; ++i) {
                    var visual = visualEncoding[i];
                    var selectnodes = visual.selector.apply(scenetreeSelection);
                    if(visual.mark) {
                      selectnodes.replaceWith(function(actor, index){
                                    var data = actor.dynamicProperty("data"); 
                                    var value = actor.dynamicProperty("value");  
                                    var accValue = actor.dynamicProperty("accValue");
                                    var axisfields = actor.dynamicProperty("axisfields"); 
                                    var chart = actor.dynamicProperty("chart");
                                    var mark = visual.mark;
                                    var lineDash = actor.dynamicProperty("lineDash");
                                    var markType;
                                    if(typeof(mark) === "function"){
                                      markType = mark.call(actor, data, index);
                                    }else {
                                      markType = mark;
                                    }

                                    if(markType == actor.Klass) {
                                      return actor;
                                    }else {
                                      var kinddata = actor.dynamicProperty("kind");
                                      var newActor = markType.create();
                                      newActor.setDynamicProperty("data", data);
                                      newActor.setDynamicProperty("value", value);
                                      newActor.setDynamicProperty("accValue", accValue);
                                      newActor.setDynamicProperty("axisfields", axisfields);
                                      newActor.setDynamicProperty("kind", kinddata);
                                      newActor.setDynamicProperty("chart", chart);
                                      newActor.setx(actor.x());
                                      newActor.sety(actor.y());
                                      newActor.setz(actor.z());
                                      return newActor;
                                    }
                                  });
                    }

                    if(visual.style) {
                      selectnodes.setProperty(visual.style);
                    }
                  }
                }
          }

        return VisualEncoder;
      });