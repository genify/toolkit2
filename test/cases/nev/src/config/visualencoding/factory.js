/*
 * ------------------------------------------
 * 产生视觉工厂的功能单元
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module config/visualencoding */
define([
        '{pro}/config/visualencoding/tooltip.js'],
        function(
          mTooltip,
          p){

          var visualEncodingMap = {
            tooltip: mTooltip.TooltipVisualEncodingFactory
          };

          /**
           * 用于产生visualEncodingFactory
           * @function visualEncodingFactory
           * @param {String} type - 要获取视觉工厂的series的类型，type包含的类型: ../../doc/dev/skin/skin.html
           * @return  {Array} visualEncodingFactory 
           */
          var visualEncodingFactory = function(type) {

            var Visual = visualEncodingMap[type];

            return Visual.create();
          }

          p.visualEncodingFactory = visualEncodingFactory;

          return p;
      });


