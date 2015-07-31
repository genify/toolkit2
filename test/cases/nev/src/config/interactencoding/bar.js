/*
 * ------------------------------------------
 * 柱状默认的交互数据
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module config/interactencoding */
define(['{pro}/libs/colorbox.js',
        '{pro}/tools/utils.js',
        '{pro}/tools/rgb.js'],
        function(
          mColorbox,          
          mUtils,
          mRgb,
          p){

          var kind = mColorbox.selector.kind;
          /**
           * bar的默认交互interactEncoding
           * @namespace interactEncoding
           */
          var interactEncoding = [
            {
              selector: kind("bars"), 
              interaction: {
                mouseOver: function(evt){
                  var actor = evt.actor; 
                  if(actor.dynamicProperty("kind") == "text")
                    return;
                  actor.actionfillStyle = actor.fillStyle();
                  var color =  actor.actionfillStyle; 
                  if(mUtils.isString(color))
                    color = mRgb(color);
                  actor.setfillStyle({r: color.r, g: color.g, b: color.b, a: 0.6});
                },
                mouseOut: function(evt){
                  var actor = evt.actor;
                  if(actor.dynamicProperty("kind") == "text")
                    return; 
                  actor.setfillStyle(actor.actionfillStyle);
                }
              }
            }/*,
            {
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