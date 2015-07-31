/*
 * ------------------------------------------
 * 布局数据构建饼状场景树的类
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
          var selection = mColorbox.selection;
          var Annulus = mColorbox.Annulus;
          var Line = mColorbox.Line;
          var Text = mColorbox.Text;
          var BubbleReceiver = mColorbox.BubbleReceiver;

          /**
           * 饼图场景构建及更新函数。

           * 节点绑定的数据格式为

           * @function build
           * @param {Selection}  rootSelection - 场景所在的根节点。
           * @param {Array} dataPoints - [{xData, yData}]用户数据坐标点集合。
           * @param {Object} value - 图表的数据信息，必须包含 optionData, axisfields 信息。
           * @return  {boolean} 是否创建成功
           */
          function build(rootSelection, dataPoints, value)
          {
            var pies = rootSelection.select(function(actor){
                                              return actor.dynamicProperty("kind") === "pies";
                                            })
                                    .data([{kind: "pies"}]);
            pies.enter()
                .append(BubbleReceiver)
                .setDynamicProperty("kind", "pies");

            pies.exit().remove();

            pies = rootSelection.select(function(actor){
                                          return actor.dynamicProperty("kind") === "pies";
                                        });

            var pie = pies.selectAll(function(actor){
                                      return actor.dynamicProperty("kind") === "pie";
                                    })
                          .data(dataPoints);

            pie.enter()
               .append(Annulus)
               .setDynamicProperty("kind", "pie");

            pie.exit()
               .remove();

            var allPie = pies.selectAll(function(actor){
                            return actor.dynamicProperty("kind") === "pie";
                          })
                .setProperty("x", function(d){return d.center.x;})
                .setProperty("y", function(d){return d.center.y;});

            //lead
            var leads = rootSelection.select(function(actor){
                                              return actor.dynamicProperty("kind") === "leads";
                                            })
                                     .data([{kind: "leads"}]);
            leads.enter()
                 .append(ContainerSprite)
                 .setDynamicProperty("kind", "leads");

            leads.exit().remove();

            leads = rootSelection.select(function(actor){
                                          return actor.dynamicProperty("kind") === "leads";
                                        });

            var lead = leads.selectAll(function(actor){
                                        return actor.dynamicProperty("kind") === "lead";
                                      })
                            .data(dataPoints);
            lead.enter()
                .append(Line)
                .setDynamicProperty("kind", "lead");

            lead.exit()
                .remove();

            //annotation
            var annotations = rootSelection.select(function(actor){
                                                    return actor.dynamicProperty("kind") === "annotations";
                                                  })
                                           .data([{kind: "annotations"}]);
            annotations.enter()
                       .append(ContainerSprite)
                       .setDynamicProperty("kind", "annotations");

            annotations.exit().remove();

            annotations = rootSelection.select(function(actor){
                                                return actor.dynamicProperty("kind") === "annotations";
                                              });

            var annotation = leads.selectAll(function(actor){
                                              return actor.dynamicProperty("kind") === "annotation";
                                            })
                                  .data(dataPoints);
            annotation.enter()
                      .append(Text)
                      .setDynamicProperty("kind", "annotation");

            annotation.exit()
                      .remove();

            leads.selectAll(function(actor){
                              return actor.dynamicProperty("kind") === "annotation";
                            })
                 .setProperty("x", function(d){return d.annotation.x;})
                 .setProperty("y", function(d){return d.annotation.y;});


            //mAssert(value.value.length === allPie.size(), "the length of value and object are mismatching!!")

            allPie.each(function(actor, index){
                                  actor.setDynamicProperty("value", dataPoints[index]);
                                  actor.setDynamicProperty("axisfields", value.axisfields);
                                });

            return true;
          }
          
          return build;
        });