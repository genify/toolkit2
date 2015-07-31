/*
 * ------------------------------------------
 * 图例默认的交互数据
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
          var selection=mColorbox.selection;
          /**
           * legend的默认交互interactEncoding
           * @namespace interactEncoding
           */

          var interactEncoding = [
            {
              selector: kind("text"),
              interaction: {
                mouseClicked: function(evt) {
                  var actor = evt.actor;
                  var chart = actor.dynamicProperty("chart");
                  var data = actor.dynamicProperty('data');
              //    console.log('交互行为:',data);
                  chart.hideOrShowSeries(data);
                }
              }
            },
            {
              selector: kind("frame"),
              interaction: {
                mouseClicked: function(evt) {
                  var actor = evt.actor;
                  var chart = actor.dynamicProperty("chart"); 
                  var data = actor.dynamicProperty('data');                 
                  var child = actor.children()[0];
                  var color, textcolor;
                  if(!actor.dynamicProperty("orignalColor") ){

                  	chart.hideOrShowSeries(data);
                    color = actor.fillStyle();
                    actor.setDynamicProperty("orignalColor", color);
                    textcolor = child.fillStyle();
                    child.setDynamicProperty("orignalColor", textcolor);
                    var blackColor = {r: 122, g: 122, b: 122};
                    actor.setfillStyle(blackColor);
                    child.setfillStyle(blackColor);
                  }else {
                    color = actor.dynamicProperty("orignalColor");
                    actor.setfillStyle(color);
                    textcolor = child.dynamicProperty("orignalColor");
                    child.setfillStyle(textcolor);
                    actor.setDynamicProperty("orignalColor", false);
                    child.setDynamicProperty("orignalColor", false);
                    chart.hideOrShowSeries(data);
                  } 
                                 
                }
              }
            }
          ];

          p.interactEncoding = interactEncoding;

          return p;

        });