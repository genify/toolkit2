/*
 * ------------------------------------------
 * tooltip精确选择器的基类
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module chooser/precisetooltip */
define(['{pro}/tooltip/chooser/chooser.js',
        '{pro}/libs/colorbox.js'],
        function(
          mChooser,
          mColorbox){

          var selection = mColorbox.selection;
          var id = mColorbox.selector.id();
          var BubbleReceiver = mColorbox.BubbleReceiver;
          var xyMap = {
          x: "xData",
          y: "yData"
        }

          /**
           * 选择器的基类
           * @class   module:chooser/precisemousechooser.PreciseTooltip
           * @extends module:chooser/chooser.Chooser
           */
          var Emphasis = mChooser.extend({
            /**
             * 初始化
             * @param  {Object}   {root: , area, } - 要绑定tooltip的场景树的根节点和area区域
             * @return  {PreciseTooltip} 实例
             */
            initialize: function(param)
            {
              this.execProto("initialize", param);
            },
            /**
             * 精确的选择功能单元，给scene场景树中特定的节点添加tooltip的功能
             * @method  module:chooser/precisemousechooser.PreciseTooltip#interactResponse
             */
            interactResponse: function()
            {
              //返回要添加tooltip的所有的节点，那么这里就是返回
              var scene = this.scene();
              var self=this;
              var sceneSelection = selection.select(scene);
              var parent;
              var bubbles = sceneSelection.selectAll(function(actor){
                                                      parent=actor;
                                                      return actor.Klass === BubbleReceiver;
                                                     });  
              var area = this.area();
              var format = this.format();  
              var outText=[];  
              var self=this;          
              var callback = function(evt) {
                var actor = evt.actor;
                var seriesActor = actor;
                newNode={series: seriesActor, exact: actor};
                if(actor.dynamicProperty("kind") === "text")
                  return;
                if(evt.type == "mouseOver") {
                    self._defautResponse(newNode,evt.type); 
                  if(format){
                    var value = actor.dynamicProperty("value");
                    var axisFields = actor.dynamicProperty("axisfields");
                    var result=[];
                    for(var i in axisFields){
                    //  result.push(""+axisFields[i] + ": " + value[axisFields[i]]);
                    if(i==="x"){
                      result.xFieldName=axisFields[i];
                      result.xValue=value[xyMap[i]];
                    }
                    else{
                      result.yFieldName= axisFields[i];
                      result.yValue=value[xyMap[i]];
                    }

                   }
                   if(actor.type()!=="annulus"){
                    while(!!seriesActor && !seriesActor.dynamicProperty("seriesName")){
                      seriesActor = seriesActor.parent();
                    }
                    result.seriesName= seriesActor.dynamicProperty("seriesName");                    
                   }else{//目前pie图还没有series的概念
                    result.seriesName= result.xValue;                     
                   }


                   if (!self._oldNode()){
                     self.set_oldNode(newNode);
                   } 
                   outText=format([result],[self._newNode()],[self._oldNode()]);
                  }else{
                    outText=self._defaultFormat(actor,evt.type);

                  }

                  var bbox = scene.bbox();
                  var tooltip = mTooltipManager.manufacture(sceneSelection, [{x: evt.mouseX - bbox.x, y: evt.mouseY - bbox.y, actors: [actor], outText: outText}], area);               
                }else if(evt.type == "mouseOut") {
                  self._defautResponse(undefined,evt.type); 
                 // actor.setshadowColor(undefined);
                 // actor.setshadowBlur(0);
                  scene.removeChild(mTooltipManager.tooltip());
                }
              }                                                          

              bubbles.each(function(actor){
                            actor.addEventListener("mouseOver", callback);
                            actor.addEventListener("mouseOut", callback);
                          });

              return bubbles;

            },

            /**
             * 删除scene场景树上节点的tooltip的功能
             * @method  module:chooser/precisemousechooser.PreciseTooltip#_defautResponse
             */
            _defautResponse: function(newNode, type)
            {
              this.set_oldNode(this._newNode());
              var oldNode = this._oldNode();
              if(oldNode!==undefined){
                var oldActor = oldNode.exact;
                //oldActor.setfillStyle(oldActor.actionfillStyle);
                oldActor.setshadowColor(undefined);
                oldActor.setshadowBlur(0);

              }
              if (!newNode)return;
              this.set_newNode(newNode);
                var newActor = newNode.exact;
                //newActor.actionfillStyle = newActor.fillStyle();
                var color = newActor.strokeStyle() !== undefined ? newActor.strokeStyle() : mSkin.tooltipcolors;
                //newActor.setfillStyle(color);
                newActor.setshadowColor(color);
                newActor.setshadowBlur(20);
      

            //  var format = this.format();
            //  if(format){
            //    format(oldNodes, newNodes, type);
            //  }
             
            },

            _defaultFormat: function(actor,type){
                var defaultResult=[];
                var defaultResult = [];
                var value = actor.dynamicProperty("value");
                var axisFields = actor.dynamicProperty("axisfields");
                if(value == undefined || axisFields == undefined)
                  return defaultResult;
                var result=[];
                for(var i in axisFields){
                  result.push(""+axisFields[i] + ": " + value[xyMap[i]]);
                }
                  defaultResult = defaultResult.concat(result); 
                  return defaultResult;
            },
            /**
             * 删除scene场景树上节点的tooltip的功能
             * @method  module:chooser/precisemousechooser.PreciseTooltip#clean
             */
            clean: function()
            {
              var sceneSelection = selection.select(scene);

              var bubbles = sceneSelection.selectAll(function(actor){
                                                      return actor.Klass === BubbleReceiver;
                                                    });
              bubbles.each(function(actor){
                            actor.removeAllEventListener("mouseOver");
                            actor.removeAllEventListener("mouseOut");
                          });
            }
          },
            ["_oldNode","_newNode"]);


          return PreciseTooltip;

        });