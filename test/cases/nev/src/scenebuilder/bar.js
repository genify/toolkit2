/*
 * ------------------------------------------
 * 布局数据构建柱状场景树的类
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
          var Rect = mColorbox.Rect;
          var Text = mColorbox.Text;
          var BubbleReceiver = mColorbox.BubbleReceiver;

          /**
           * 柱状图场景构建及更新函数。

           * 节点绑定的数据格式为
           * bar:  {point: {x, y: }, value}
           * text:  {point: {x, y: }, value}

           * @function build
           * @param {Selection}  rootSelection - 场景所在的根节点。
           * @param {Array} dataPoints - [{xData, yData}]用户数据坐标点集合。
           * @param {Object} value - 图表的数据信息，必须包含 optionData, axisfields 信息。
           * @return  {boolean} 是否创建成功
           */
          function build(rootSelection, dataPoints, value, seriesInfo)
          {
            var barSeries = rootSelection.select(function(actor){
                                              return actor.dynamicProperty("kind") === "barSeries";
                                            })
                                     .data(["barSeries"]);
            barSeries.enter()
            .append(ContainerSprite)
            .setDynamicProperty("kind", "barSeries");

            barSeries.exit().remove();

            barSeries = rootSelection.select(function(actor){
                                              return actor.dynamicProperty("kind") === "barSeries";
                                            });

            var bars = barSeries.select(function(actor) {
                                                return actor.dynamicProperty("kind") === "bars";
                                              })
                                      .data(["bars"]);

            bars.enter()
              .append(BubbleReceiver)
              .setDynamicProperty("kind", "bars");

            bars.exit().remove();

            bars = barSeries.select(function(actor){
                                        return actor.dynamicProperty("kind") === "bars";
                                      });

            var bar = bars.selectAll(function(actor){
                                                return actor.dynamicProperty("kind") === "bar";
                                              })
                          .data(dataPoints);

            var rect = bar.enter()
               .append(Rect)
               .setDynamicProperty("kind", "bar");

            if(seriesInfo.label)
            {
               rect.append(Text)
               .setDynamicProperty("kind", "text");
            }

            bar.exit()
               .remove();

            bars.selectAll(function(actor){
                            return actor.dynamicProperty("kind") === "text";
                          })
                .data(dataPoints);

            bar = barSeries.selectAll(function(actor){
                                                            return actor.dynamicProperty("kind") === "bar";
                                                          });

            //mAssert(value.value.length === bar.size(), "the length of value and object are mismatching!!")

            bar.each(function(actor, index){
                                  actor.setDynamicProperty("value", dataPoints[index]);
                                  actor.setDynamicProperty("axisfields", value.axisfields);
                                });

            return true;
          }

          return build;
        });

  