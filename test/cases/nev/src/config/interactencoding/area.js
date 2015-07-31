/*
 * ------------------------------------------
 * 区域默认的交互数据
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
           * area的默认交互interactEncoding
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
                  actor.setstrokeStyle({r: 212, g: 123, b: 80});
                }
              }
            },*/
            {
              selector:kind("points"),
              interaction: {
                mouseOver: function(evt){
                  var actor = evt.actor; 
                  if(actor.dynamicProperty("kind") == "text")
                    return;
        /*          actor.actionfillStyle = actor.fillStyle();
                  actor.setfillStyle(actor.strokeStyle());*/
                  actor.setscale({sx: 1.25, sy: 1.25});
                  // actor.setfillStyle({r: 122, g: 10, b: 255});
                },
                mouseOut: function(evt){
                  var actor = evt.actor;
                  if(actor.dynamicProperty("kind") == "text")
                    return;
                 // actor.setfillStyle(actor.actionfillStyle); 
                  actor.setscale({sx: 1, sy: 1});
                  // actor.setfillStyle({r: 212, g: 123, b: 100});
                }
              }
            }
/*            {
              selector: kind("zone"),
              interaction: {
                mouseOver: function(evt){
                  // var actor = evt.actor; 
                  // actor.setfillStyle( {r: 212, g: 123, b: 100, a: 0.8});
                },
                mouseOut: function(evt){
                  // var actor = evt.actor; 
                  // actor.setfillStyle( {r: 212, g: 123, b: 100, a: 0.4});
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