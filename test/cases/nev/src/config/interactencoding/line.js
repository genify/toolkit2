/*
 * ------------------------------------------
 * 折线默认的交互数据
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
           * line的默认交互interactEncoding
           * @namespace interactEncoding
           */
          var interactEncoding =[
/*            {
              selector: kind("line"), 
              interaction: {
                mouseOver: function(evt){
                  var actor = evt.actor; 
                  // actor.actionColor = actor.strokeStyle();
                  // actor.setstrokeStyle('#FFFFFF');
                },
                mouseOut: function(evt){
                  var actor = evt.actor; 
                  // actor.setstrokeStyle(actor.actionColor);
                }
              }
            },*/
            {
              selector: kind("points"), 
              interaction: {
                mouseOver: function(evt){
                  var actor = evt.actor; 
                  if(actor.dynamicProperty("kind") == "text")
                    return;
                  actor.setscale({sx: 1.25, sy: 1.25});
     /*             actor.actionfillStyle = actor.fillStyle();
                  actor.setfillStyle(actor.strokeStyle());*/
                },
                mouseOut: function(evt){
                  var actor = evt.actor; 
                  if(actor.dynamicProperty("kind") == "text")
                    return;
                  actor.setscale({sx: 1, sy: 1});
        /*          actor.setfillStyle(actor.actionfillStyle);*/
                }
              }
            }
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