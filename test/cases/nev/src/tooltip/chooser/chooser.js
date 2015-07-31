/*
 * ------------------------------------------
 * tooltip选择器的基类
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module chooser/chooser */
define(['{pro}/libs/colortraits.js'],
        function(
          mColortraits){
          /**
           * 选择器的基类
           * @class   module:chooser/chooser.Chooser
           * @extends colortraits.Klass
           */
          var Chooser = mColortraits.Klass.extend({
            /**
             * 初始化
             * @return  {Chooser} 实例
             */
            initialize: function(param)
            {
              this.setscene(param.root);//
              this.setarea(param.area); //area不是全部的面积，而是整个axis轴的面积
              this.setorient(param.orient); //"xaxises" or "yaxises"
              this.set_seriesInfos(param.seriesInfos);
              //this.setformatter(param.formatter);
              this.setformat(param.format);
            },
             /**
             * 选择功能单元
             * @method  module:chooser/chooser.Chooser#choose
             * @param {Number} - evtx 鼠标的x位置
             * @param {Number} - evty 鼠标的y位置
             * @return {Array} - 交互的对象 [{series: root, exact: node}, {series: root, exact: node}]
             */
            choose: function(evtx, evty)
            {
              return [];
            },
            /**
             * chooser的交互响应
             * @method  module:chooser/chooser.Chooser#interactResponse
             */
            interactResponse: function()
            {

            }
          },
            ["scene", "area", "orient", "_seriesInfos", "formatter", "format", "_type"]);


          return Chooser;

        });