/*
 * ------------------------------------------
 * 布局数据构建标题场景树的类
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module scenebuilder */
define(['{pro}/libs/colorbox.js'],
        function(
          mColorbox){
          
          var ContainerSprite = mColorbox.ContainerSprite;
          var MultilineText = mColorbox.MultilineText;
          var Rect = mColorbox.Rect;

          /**
           * 标题场景构建及更新函数。

           * 节点绑定的数据格式为

           * @function build
           * @param {Selection}  rootSelection - 场景所在的根节点。
           * @param {Array} texts - [mainHeadingString, subjectHeadingString, subjectHeadingString]标题内容。
           * @return  {boolean} 是否创建成功
           */
          function build(rootSelection, texts)
          {
            //title
            var title = rootSelection.select(function(actor){
                                                return actor.dynamicProperty("kind") === "title";
                                              })
                                     .data(["title"]);

            title.enter()
                 .append(ContainerSprite)
                 .setDynamicProperty("kind", "title");

            title.exit().remove();

            title = rootSelection.select(function(actor){
                                          return actor.dynamicProperty("kind") === "title";
                                        });
            //text
            var text = title.select(function(actor){
                                          return actor.dynamicProperty("kind") === "text";
                                      })
                            .data(["text"]);

            text.enter()
                .append(MultilineText)
                .setDynamicProperty("kind", "text");

            text.exit()
                .remove();              

            //background
            var background = title.select(function(actor){
                                          return actor.dynamicProperty("kind") === "background";
                                      })
                                  .data(["background"]);

            background.enter()
                      .append(Rect)
                      .setDynamicProperty("kind", "background");

            background.exit()
                      .remove();

            title.select(function(actor){
                                    return actor.dynamicProperty("kind") === "text";
                                  })
                           .setProperty("texts", texts);

            return true;
          }          

          return build;

        });