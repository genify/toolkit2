/*
 * ------------------------------------------
 * 布局数据构建散点场景树的类
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module scenebuilder */
define(['{pro}/libs/colorbox.js', 
        '{pro}/tools/assert.js'],
        function(
          mColorbox, 
          mAssert){
          var ContainerSprite = mColorbox.ContainerSprite;
          var Circle = mColorbox.Circle;
          var Text = mColorbox.Text;
          var BubbleReceiver = mColorbox.BubbleReceiver;


          /**
           * 区域场景构建及更新函数。

           * 节点绑定的数据格式为
           * scatter:  {point: {x, y: }, value, ratio : 0.6} ratio用于绘制气泡图
           * text:  {point: {x, y: }, value, ratio : 0.6}

           * @function build
           * @param {Selection}  rootSelection - 场景所在的根节点。
           * @param {Array} dataPoints - [{xData, yData}]用户数据坐标点集合。
           * @param {Object} value - 图表的数据信息，必须包含 optionData, axisfields 信息。
           * @return  {boolean} 是否创建成功
           */
          function build(rootSelection, dataPoints, value, info)
          {
            var scatterSeries = rootSelection.select(function(actor){
                                              return actor.dynamicProperty("kind") === "scatterSeries";
                                            })
                                     .data(["scatterSeries"]);
            scatterSeries.enter()
            .append(ContainerSprite)
            .setDynamicProperty("kind", "scatterSeries");

            scatterSeries.exit().remove();

            scatterSeries = rootSelection.select(function(actor){
                                              return actor.dynamicProperty("kind") === "scatterSeries";
                                            });

            var scatters = scatterSeries.select(function(actor) {
                                                  return actor.dynamicProperty("kind") === "scatters";
                                                })
                                        .data(["scatters"]);

            scatters.enter()
                    .append(BubbleReceiver)
                    .setDynamicProperty("kind", "scatters");

            scatters.exit().remove();

            scatters = scatterSeries.select(function(actor){
                                              return actor.dynamicProperty("kind") === "scatters";
                                            });
            
            var scatter = scatters.selectAll(function(actor){
                                                return actor.dynamicProperty("kind") === "scatter";
                                              })
                                   .data(dataPoints);
            var enterScatter = scatter.enter()
                   .append(Circle)
                   .setDynamicProperty("kind", "scatter");

            if(info.label)
            {
              enterScatter.append(Text)
              .setDynamicProperty("kind", "text")
            }

            scatter.exit()
                   .remove();

            var allScatter = scatters.selectAll(function(actor){
                                return actor.dynamicProperty("kind") === "scatter";
                              })
                    .data(dataPoints);

            allScatter.selectAll(function(actor){
                                return actor.dynamicProperty("kind") === "text";
                              }).data(dataPoints);

            allScatter.each(function(actor, index){
                                  actor.setDynamicProperty("value", dataPoints[index]);
                                  actor.setDynamicProperty("axisfields", value.axisfields);
                                });
          }

          return build;

        });