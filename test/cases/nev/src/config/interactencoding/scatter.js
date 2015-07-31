/*
 * ------------------------------------------
 * 散点默认的交互数据
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module config/interactencoding */
define(['{pro}/libs/colorbox.js'],
        function(
          mColorbox,
          p){

          var kind = mColorbox.selector.kind;
          /**
           * scatter的默认交互interactEncoding
           * @namespace interactEncoding
           */
          var interactEncoding = [
            {
              selector: kind("scatter"),
              interaction: {
                mouseOver: function(evt){
                  var actor = evt.actor;
                  var preScale = actor.scale();
                  actor.setDynamicProperty("preScale", preScale);
                  actor.setscale({sx: preScale.sx+0.25, sy: preScale.sy+0.25});
                },
                mouseOut: function(evt){
                  var actor = evt.actor;
                  var preScale = actor.dynamicProperty("preScale");
                  actor.setscale({sx: preScale.sx, sy: preScale.sy});
                }
              }
            },
/*            {
              selector: kind("text"),
              interaction: {
                mouseOver: function(evt){
                  evt.preventFlow();
                },
                mouseOut: function(evt){
                  evt.preventFlow();
                }
              }
            }*/
          ];

          p.interactEncoding = interactEncoding;

          return p;

        });