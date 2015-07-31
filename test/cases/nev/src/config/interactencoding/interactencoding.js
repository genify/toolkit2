/*
 * ------------------------------------------
 * 获取交互数据的功能单元
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module config/interactencoding */
define(['{pro}/config/interactencoding/line.js',
        '{pro}/config/interactencoding/area.js',
        '{pro}/config/interactencoding/bar.js',
        '{pro}/config/interactencoding/scatter.js',
        '{pro}/config/interactencoding/pie.js',
        '{pro}/config/interactencoding/axis.js',
        '{pro}/config/interactencoding/title.js',
        '{pro}/config/interactencoding/legend.js'],
        function(
          mLine,
          mArea,
          mBar,
          mScatter,
          mPie,
          mAxis,
          mTitle,
          mLegend,
          p){

          var interactEncodingMap = {
            line: mLine.interactEncoding,
            area: mArea.interactEncoding,
            bar: mBar.interactEncoding,
            scatter: mScatter.interactEncoding,
            pie: mPie.interactEncoding,
            axis: mAxis.interactEncoding,
            title: mTitle.interactEncoding,
            legend: mLegend.interactEncoding
          };
          /**
           * 某种类型的交互数据的获取
           * @function interactEncoding
           * @param {String} type - 要获取交互数据的series的类型
           * @return  {Array} interactEncoding - 交互数据 数据格式见：../../doc/dev/interaction/interaction-design.html
           */
          var interactEncoding = function(type) {

            var interact = interactEncodingMap[type];

            return interact;
          }

          p.interactEncoding = interactEncoding;

          return p;
      });


