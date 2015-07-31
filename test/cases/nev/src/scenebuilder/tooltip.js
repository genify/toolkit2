/*
 * ------------------------------------------
 * 布局数据构建提示框场景树的类
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module scenebuilder */
define(['{pro}/libs/colorbox.js'],
        function(mColorbox)
        {
          var ContainerSprite = mColorbox.ContainerSprite;
          var MultilineText = mColorbox.MultilineText;
          var Rect = mColorbox.Rect;

          /**
           * 提示框场景构建及更新函数。

           * 节点绑定的数据格式为

           * @function build
           * @param {Selection}  rootSelection - 场景所在的根节点。
           * @param {Array} tooltips - [{x, y, actors, outText}, {x, y, actors, outText}]tooltip场景构建数据。
           * @return  {boolean} 是否创建成功
           */
          function build(rootSelection, tooltips)
          {
            var tooltip = rootSelection.select(function(actor){
                                                return actor.dynamicProperty("kind") === "tooltip";
                                              })
                                     .data(tooltips);


            tooltip.enter()
                   .append(ContainerSprite)
                   .setDynamicProperty("kind", "tooltip");

            tooltip.exit().remove();

            tooltip = rootSelection.select(function(actor){
                                          return actor.dynamicProperty("kind") === "tooltip";
                                        });
            tooltip.setProperty("x", function(data){return data.x;})
                   .setProperty("y", function(data){return data.y;});

            //background
            var background = tooltip.select(function(actor){
                                          return actor.dynamicProperty("kind") === "background";
                                      })
                                    .data(tooltips);

            background.enter()
                      .append(Rect)
                      .setDynamicProperty("kind", "background");

            background.exit()
                      .remove();

            //text
            var text = tooltip.select(function(actor){
                                          return actor.dynamicProperty("kind") === "text";
                                      })
                              .data(tooltips);

            text.enter()
                .append(MultilineText)
                .setDynamicProperty("kind", "text")                  
                .setProperty("x", 5)
                .setProperty("y", 5);

            text.exit()
                .remove();  
          }
        
          return build;

        });