/*
 * ------------------------------------------
 * 饼状默认的交互数据
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
           * title的默认交互interactEncoding
           * @namespace interactEncoding
           */
          var interactEncoding = [
/*            {
              selector: kind("background"),
              interaction: {
                mouseOver: function(evt){
                  var actor = evt.actor;
                  // var fillStyle = actor.fillStyle(); 
                  // actor.setfillStyle({r: fillStyle.r, g: fillStyle.g, b: fillStyle.b, a: 0.5});
                },
                mouseOut: function(evt){
                  var actor = evt.actor; 
                  // var fillStyle = actor.fillStyle(); 
                  // actor.setfillStyle({r: fillStyle.r, g: fillStyle.g, b: fillStyle.b, a: 0});
                }
              }
            }*/
          ];
          p.interactEncoding = interactEncoding;

          return p;

        });