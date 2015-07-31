/*
 * ------------------------------------------
 * 布局数据构建图例场景树的类
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module scenebuilder */
define(['{pro}/libs/colorbox.js'],
        function(
          mColorbox){
          
          //var BubbleReceiver = mColorbox.BubbleReceiver;
          var ContainerSprite = mColorbox.ContainerSprite;
          var MultilineText = mColorbox.MultilineText;
          var Rect = mColorbox.Rect;
          var Text = mColorbox.Text;

          /**
           * 图例场景构建及更新函数。

           * 节点绑定的数据格式为
           * legend:  {x: , y: , width: , height: , items: [{x: , y: , width: , height: , value: }]}
           * background: {x: , y: , width: , height: , items: [{x: , y: , width: , height: , value: }]}
           * frame: {x: , y: , width: , height: , value: }
           * text: {x: , y: , width: , height: , value: }

           * @function build
           * @param {Selection}  rootSelection - 场景所在的根节点。
           * @param {Array} items - [{text, type}]。
           * @param {Object} chart - 图例所属的chart。
           * @return  {boolean} 是否创建成功
           */
          function build(rootSelection, items, chart)
          {
            //legned
            var legend = rootSelection.select(function(actor){
                                                return actor.dynamicProperty("kind") === "legend";
                                              })
                                      .data(["legend"]);

            legend.enter()
                  .append(ContainerSprite)
                  .setDynamicProperty("kind", "legend")
                  .append(Rect)
                  .setDynamicProperty("kind", "background")
                  .data(function(rootData) {
                          return [rootData];
                      });

            legend.exit()
                  .remove();

            legend = rootSelection.select(function(actor){
                                            return actor.dynamicProperty("kind") === "legend";
                                          });

            //frame
            var frame = legend.selectAll(function(actor){
                                            return actor.dynamicProperty("kind") === "frame";
                                        })
                              .data(items);

            frame.enter()
                 .append(Rect)
                 .setDynamicProperty("kind", "frame")
                 .append(Text)
                 .setDynamicProperty("kind", "text");

            frame.exit()
                 .remove();

            legend.selectAll(function(actor){
                                return actor.dynamicProperty("kind") === "text";
                            })
                  .data(items); 

            var frame = legend.selectAll(function(actor){
                                          return actor.dynamicProperty("kind") === "frame";
                                        })
            .setDynamicProperty("chart", chart);


            var text = legend.selectAll(function(actor){
                                          return actor.dynamicProperty("kind") === "text";
                                        })
            .setProperty("x", function(d){return 15;})
            .setProperty("text",function(d){return d.name;})
            .setDynamicProperty("chart", chart);

            return true;
          }

          return build;

        });