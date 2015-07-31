/*
 * ------------------------------------------
 * 布局数据构建轴场景树的类
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module scenebuilder */
define(['{pro}/libs/colorbox.js'],
        function(mColorbox)
        {          
          var ContainerSprite = mColorbox.ContainerSprite;
          var Line =  mColorbox.Line;
          var AutoWrapText = mColorbox.AutoWrapText;
          var Text = mColorbox.Text;

          /**
           * 轴场景构建及更新函数。
           * @function build
           * @param {Selection}  rootSelection - 场景所在的根节点。
           * @param {Array} tickValues - 刻度值。
           * @param {Object} nature - 轴的信息，必须包含hidden, grid, caption属性。
           * @return  {boolean} 是否创建成功
           */
          function build(rootSelection, tickValues, nature)
          {
            if(!nature.hidden)
            {
              //line
              var lines = rootSelection.select(function(actor){
                                                return actor.dynamicProperty("kind") === "line";})
                                       .data(["line"]);

              lines.enter()
                   .append(Line)
                   .setDynamicProperty("kind", "line");

              lines.exit().remove;

              //tick
              var ticks = rootSelection.select(function(actor){
                                                return actor.dynamicProperty("kind") === "ticks";
                                              })
                                       .data(["ticks"]);

              ticks.enter()
                   .append(ContainerSprite)
                   .setDynamicProperty("kind", "ticks");

              ticks.exit().remove();

              ticks = rootSelection.select(function(actor){
                                            return actor.dynamicProperty("kind") === "ticks";
                                          });

              var tick = ticks.selectAll(function(actor){
                                          return actor.dynamicProperty("kind") === "tick";
                                        })
                              .data(tickValues);

              tick.enter()
                  .append(Line)
                  .setDynamicProperty("kind", "tick");

              tick.exit()
                  .remove();
             }

            //label
            var labels = rootSelection.select(function(actor){
                                                return actor.dynamicProperty("kind") === "labels";
                                              })
                                      .data(["labels"]);

            labels.enter()
                  .append(ContainerSprite)
                  .setDynamicProperty("kind", "labels");

            labels.exit()
                  .remove();

            labels = rootSelection.select(function(actor){
                                            return actor.dynamicProperty("kind") === "labels";
                                          });

            var label = labels.selectAll(function(actor){
                                          return actor.dynamicProperty("kind") === "label";
                                        })
                              .data(tickValues);

            label.enter()
                 .append(AutoWrapText)
                 .setDynamicProperty("kind", "label");

            label.exit()
                 .remove();

            //grid
            if(nature.grid) {
              //line
              var grids = rootSelection.select(function(actor){
                                                  return actor.dynamicProperty("kind") === "grids";
                                                })
                                       .data(["grids"]);

              grids.enter()
                   .append(ContainerSprite)
                   .setDynamicProperty("kind", "grids");

              grids.exit()
                   .remove();

              grids = rootSelection.select(function(actor){
                                            return actor.dynamicProperty("kind") === "grids";
                                          });

              var grid = grids.selectAll(function(actor){
                                            return actor.dynamicProperty("kind") === "grid";
                                        })
                              .data(tickValues);

              grid.enter()
                  .append(Line)
                  .setDynamicProperty("kind", "grid");

              grid.exit()
                  .remove();
            }
            //todo~~~~~fix hidden grid

            //caption
            var caption = rootSelection.select(function(actor){
                                              return actor.dynamicProperty("kind") === "caption";})
                                       .data([nature.caption]);

            caption.enter()
                   .append(Text)
                   .setProperty("text", function(d){return d.text})
                   .setDynamicProperty("kind", "caption");

            caption.exit().remove();

            return true;
          }
          
          return build;
        });

  