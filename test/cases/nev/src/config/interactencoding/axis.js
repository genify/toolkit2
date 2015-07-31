/*
 * ------------------------------------------
 * 轴默认的交互数据
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
           * axis的默认交互interactEncoding
           * @namespace interactEncoding
           */
          var interactEncoding = [
/*            {
              selector: kind("line"),
              interaction: {
                mouseOver: function(evt){
                  var actor = evt.actor; 
                  actor.setstrokeStyle({r: 122, g: 10, b: 255});
                },
                mouseOut: function(evt){
                  var actor = evt.actor; 
                  actor.setstrokeStyle({r: 0, g: 0, b: 0, a: 0.3});
                }
              }
            },
            {
              selector: kind("tick"), 
              interaction: {
                mouseOver: function(evt){
                  var actor = evt.actor; 
                  actor.setstrokeStyle({r: 122, g: 10, b: 255});
                },
                mouseOut: function(evt){
                  var actor = evt.actor; 
                  actor.setstrokeStyle({r: 0, g: 0, b: 0, a: 0.3});
                }
              }
            },
            {
              selector: kind("label"), 
              interaction: {
                mouseOver: function(evt){
                  var actor = evt.actor; 
                  actor.setfillStyle({r: 122, g: 10, b: 255});
                },
                mouseOut: function(evt){
                  var actor = evt.actor; 
                  actor.setfillStyle({r: 0, g: 0, b: 0});
                }
              }
            }*/
          ];

          p.interactEncoding = interactEncoding;

          return p;

        });