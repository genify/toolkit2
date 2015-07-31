/*
 * ------------------------------------------
 * 产生视觉数据visualEncoding的工厂
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module config/visualencoding */
define(['{pro}/libs/colortraits.js', 
        '{pro}/libs/colorbox.js'],
        function(
          mColortraits, 
          mColorbox){
                 
          /**
           * 产生视觉数据visualEncoding的工厂的基类
           * @class   module:config/visualencoding/base.Base
           * @extends colortraits.Klass
           */
          var Base = mColortraits.Klass.extend({
            /**
             * 初始化
             * @return  {Object} 实例
             */
            initialize: function()
            {
              this._t.setcolorindex(0);
              this._t.setmarkindex(0);
              this._t.setmarkcolor(1);
              this.setzindex(0);
            },
            /**
             * 获取视觉数据visualEncoding的接口
             * @method  module:config/visualencoding/base.Base#next
             * @return  {Object} visualEncoding - 视觉数据，数据格式见：../../doc/dev/visualencoder/visualencoder-design.html
             */
            next: function()
            {
            }
          },
            ["colorindex", "markindex", "markcolor", "zindex"]);


          return Base;

        });