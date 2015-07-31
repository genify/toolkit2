/*
* ------------------------------------------
* 图表虚基类
* @version 0.0.2
* @author humin(hzhumin@corp.netease.com)
* ------------------------------------------
*/
/** @module chart */
define(['{pro}/libs/colortraits.js'],
        function(mColortraits)
        {

      /**
       * 图表虚基类,用于图表的派生,不能实例化图表。
       * 该类中仅规定了一个图表具有的基本api(需要派生类实现)。
       * @class module:chart/chartbase.ChartBase
       * @extends module:colorbox.Klass
       **/
    var ChartBase = mColortraits.Klass.extend({
      /**
       * 刷新图表
       * @method module:chart/chartbase.ChartBase#update
       */
      update:function(optionKey, value)
      {
        throw "can not call ChartBase fun: update!";
      },

      /**
       * 更新图表的数据，图表显示会刷新。
       * @method module:chart/chartbase.ChartBase#updateData
       * @param  data {Array | Object}  按行的数据或按列的数据。
       */
      updateData:function(data)
      {
        throw "can not call ChartBase fun: updateData!";
      },
      /**
       * 更新图表的size, 图表显示会刷新。
       * @method module:chart/chartbase.ChartBase#updateSize
       * @param  size {Object}。
       */
      updateSize:function(size)
      {
        throw "can not call ChartBase fun: updateSize!";
      },
      /**
       * 设置图表样式
       * @method module:chart/chartbase.ChartBase#applyVisualEncoding
       * @param ve {Array} 用户定义的visualEncoding
       */
      applyVisualEncoding:function(ve)
      {
        throw "can not call ChartBase fun: applyVisualEncoding!";
      },
      /**
       * 设置图表交互
       * @method module:chart/chartbase.ChartBase#applyInteractEncoding
       * @param ie {Array} 用户定义的interactEncoding
       */
      applyInteractEncoding:function(ie)
      {
        throw "can not call ChartBase fun: applyInteractEncoding!";
      },
      /**
       * 获取图表场景树的根节点。
       * @method module:chart/chartbase.ChartBase#root
       * @return  {ContainerSprite}  图表场景树的根节点
       */
      root:function()
      {
        throw "can not call ChartBase fun: root!";
      },
      /**
       * 给该chart应用某主题。
       * @method module:chart/chartbase.ChartBase#useTheme
       * @param theme {String/ThemeTemplate} 代表某主题的字符串或者主题模板。
       * @return  {this}
       */
      useTheme:function(theme)
      {
        throw "can not call ChartBase fun: theme!";
      }
    });

    return ChartBase;
    });