/*
 * ------------------------------------------
 * 节点的视觉效果
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module interactencoder */
define(['{pro}/libs/colorbox.js'], 
      function(mColorbox){
        /**
         * 交互命名空间
         */
        var InteractEncoder = {
          /**
           * 交互的添加
           * @function InteractEncoder.apply
           * @param {Object} scenetreeSelection - 要添加交互的场景树selection
           * @param {Array}  interactEncoding - 交互数据 数据格式见：../../doc/dev/interaction/interaction-design.html
           * @return  {Void}
           * @example
           * var interactEncoding1 = [{
           *                            selector: kind(“line”),
           *                            interaction；{
           *                                mouseOver： callback-function1
           *                            }];
           * InteractEncoder.apply(scenetree-root, interactEncoding1); //line节点具有了mouseOver的交互能力，交互响应回调函数为callback-function1
           * var interactEncoding2 = [{
           *                            selector: kind(“line”),
           *                            interaction；{
           *                                mouseOver： callback-function2
           *                            }];
           * InteractEncoder.apply(scenetree-root, interactEncoding2); //line节点mouseOver的交互会响应callback-function1 和 callback-function2回调函数。
           * var interactEncoding = [{
           *                            selector: kind(“line”),
           *                            interaction；{
           *                                mouseOver： undefined
           *                            }];
           * InteractEncoder.apply(scenetree-root, interactEncoding); //去掉line节点mouseOver的交互能力。
           */
          apply: function(scenetreeSelection, interactEncoding){
          				if(!scenetreeSelection)return;
                  for(var i = 0, len = interactEncoding.length; i < len; ++i){
                    interactEncoding[i].selector
                                   .apply(scenetreeSelection)
                                   .each(function(actor){
                                      var interlist = interactEncoding[i].interaction;
                                      for(var key in interlist){
                                        actor.removeAllEventListener(key);                                
                                        if(typeof(interlist[key]) === "function"){
                                          actor.addEventListener(key, interlist[key]);
                                        }
                                      }          
                                   });
                  }
                }
          }

        return InteractEncoder;
      });