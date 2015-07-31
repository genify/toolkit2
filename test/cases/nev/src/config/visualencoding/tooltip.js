/*
 * ------------------------------------------
 * 产生提示框视觉数据visualEncoding的工厂
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module config/visualencoding */
define(['{pro}/config/visualencoding/skin.js',
        '{pro}/config/visualencoding/base.js', 
        '{pro}/libs/colorbox.js'],
        function(
          mSkin,
          mBase, 
          mColorbox,
          p){

          var kind = mColorbox.selector.kind;        
          /**
           * 产生弹框视觉数据visualEncoding的工厂
           * @class  module:config/visualencoding/tooltip.TooltipVisualEncodingFactory
           * @extends module:config/visualencoding/base.Base
           */
          var TooltipVisualEncodingFactory = mBase.extend({   
            /**
             * 初始化
             * @return  {Object} TooltipVisualEncodingFactory
             */        
            initialize: function()
            {
              this.execProto("initialize");

              this.setcolorindex(3%mSkin.colors.length);
            },
            /**
             * 获取视觉数据visualEncoding的接口
             * @method  module:config/visualencoding/tooltip.TooltipVisualEncodingFactory#next
             * @return  {Object} visualEncoding - 视觉数据，数据格式见：../../doc/dev/visualencoder/visualencoder-design.html
             */
            next: function()
            {
              var colorindex = this.colorindex();
              var color1 = (colorindex+1)%mSkin.colors.length;
              var color2 = (colorindex+2)%mSkin.colors.length;
              var visualresult =  [
                {
                  selector: kind("background"),
                  style: {
                    width: 0,
                    height: 0,
                    fillStyle: {r: 255, g: 255, b: 255, a: 0.8},
                    strokeStyle: function(data, index) {
                      var actor = data.actors[0];
                      var color = actor.fillStyle();
                      color = (color !== undefined && color !== "#FFFFFF") ? color : actor.strokeStyle();
                      return color;
                    },//mSkin.colors[colorindex],                    
                    z: 1900
                  }
                },
                {
                  selector: kind("text"),
                  style: {
                    texts: function(data, index) {
                    	return data.outText;                    
                    },
                    styles: [
                    {
                      fillStyle: {r: 0, g: 0, b: 0},//mSkin.colors[color1], 
                      font: {size: 12}, 
                      align: "left", 
                      lineSpacing: 5
                    }, 
                    {
                      font: {size: 12}, 
                      align: "left", 
                      lineSpacing: 5, 
                      fillStyle: {r: 0, g: 0, b: 0},//mSkin.colors[color2]
                    }, 
                    {
                      font: {size: 12}, 
                      align: "left", 
                      lineSpacing: 5, 
                      fillStyle: {r: 0, g: 0, b: 0}
                    }],
                    z: 2000
                  }
                }
              ];
              colorindex = (++colorindex)%mSkin.colors.length;

              this.setcolorindex(colorindex);

              return visualresult;
            }
          },
            []);


          p.TooltipVisualEncodingFactory = TooltipVisualEncodingFactory;

          return p;

        });