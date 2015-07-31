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
           * pie的默认交互interactEncoding
           * @namespace interactEncoding
           */
          var interactEncoding = [
            {
              selector: kind("pies"),
              interaction: {
                mouseOver: function(evt){
                  var actor = evt.actor;
                  var color = actor.fillStyle(); 
                  actor.setscale({sx: 1.05, sy: 1.05});
                  actor.setfillStyle({r: color.r, g: color.g, b: color.b, a: 0.5});
                  console.log("00000000000000000000000000");
                },
                mouseOut: function(evt){
                  var actor = evt.actor; 
                  var color = actor.fillStyle();
                  actor.setscale({sx: 1, sy: 1});
                  actor.setfillStyle({r: color.r, g: color.g, b: color.b});
                }
              }
            },
            {
              selector: kind("leads"),
              interaction: {
                mouseOver: function(evt){
                  var actor = evt.actor; 
                  actor.setstrokeStyle({r: 201, g: 84, b: 153, a: 1});
                },
                mouseOut: function(evt){
                  var actor = evt.actor; 
                  actor.setstrokeStyle({r: 0, g: 0, b: 0, a: 1});
                }
              }
            }
/*            {
              selector: kind("annotation"), 
              interaction: {
                mouseOver: function(evt){
                  var actor = evt.actor; 
                  actor.setfillStyle({r: 201, g: 84, b: 153, a: 1});
                },
                mouseOut: function(evt){
                  var actor = evt.actor; 
                  actor.setfillStyle({r: 0, g: 0, b: 0, a: 1});
                }
              }
            },*/
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