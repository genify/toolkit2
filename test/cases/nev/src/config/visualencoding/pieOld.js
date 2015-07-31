/*
 * ------------------------------------------
 * 产生饼状视觉数据visualEncoding的工厂
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module config/visualencoding */
define(['{pro}/config/visualencoding/skin.js',
        '{pro}/config/visualencoding/base.js', 
        '{pro}/libs/colorbox.js',
        '{pro}/tools/utils.js',
        '{pro}/tools/rgb.js'],
        function(
          mSkin,
          mBase, 
          mColorbox,
          mUtils,
          mRgb,
          p){

          var kind = mColorbox.selector.kind;
         
          /**
           * 产生饼状视觉数据visualEncoding的工厂
           * @class  module:config/visualencoding/pie.PieVisualEncodingFactory
           * @extends module:config/visualencoding/base.Base
           */
          var PieVisualEncodingFactory = mBase.extend({           
            /**
             * 初始化
             * @return  {Object} PieVisualEncodingFactory实例
             */ 
            initialize: function()
            {
              this.execProto("initialize");              
            },
            /**
             * 获取视觉数据visualEncoding的接口
             * @method  module:config/visualencoding/pie.PieVisualEncodingFactory#next
             * @return  {Object} visualEncoding - 视觉数据，数据格式见：../../doc/dev/visualencoder/visualencoder-design.html
             */
            next: function()
            {
              var visualresult =  [
                {
                  selector: kind("pie"), 
                  mark: mColorbox.Annulus,
                  style: {
                    startAngle: function(d){return d.startAngle;},
                    endAngle: function(d){return d.endAngle;},
                    outerradius: function(d){return d.radius[1];},
                    innerradius: function(d){return  d.radius[0];},
                    fillStyle: function(d, index){
                    var c = mSkin.colors[index%mSkin.colors.length]    
                      if(mUtils.isString(c))
                        c = mRgb(c);   
                      var a = 1/(index/10 + 1);
                      return {r: c.r, g: c.g, b: c.b, a: 1};                         
                    },
                    strokeStyle : {r:255, g:255, b:255},
                    lineWidth : 0.5
                  },
                  z: 50
                },
                {
                  selector: kind("lead"), 
                  mark: mColorbox.Line,
                  style: {
                    vertexes: function(d){return d.cable;},
                    strokeStyle: function(d, index){
                      var c = mSkin.colors[index%mSkin.colors.length]    
                      if(mUtils.isString(c))
                        c = mRgb(c);   
                      var a = 1/(index/10 + 1);
                      return {r: c.r, g: c.g, b: c.b, a: 1};                           
                    },
                    z: 60
                  }
                },
                {
                  selector: kind("annotation"), 
                  mark: mColorbox.Text,
                  style: {
                    text: function(d){return d.annotation.text+ " " + Math.floor(d.ratio*10000)/100+"%";},
                    font: {size: 12,family: "微软雅黑"},
                    fillStyle : {r:80, g:80, b:80, a: 1.0}, 
                    ratioAnchor: function(d, index){
                      if(d.center.x < d.annotation.x){
                        return {ratiox:0, ratioy: 0.5};
                      }else {
                        return {ratiox:1, ratioy: 0.5};
                      }
                    },
                    z: 70
                  }
                }
              ];

              return visualresult;
            }
          },
            []);


          p.PieVisualEncodingFactory = PieVisualEncodingFactory;

          return p;

        });