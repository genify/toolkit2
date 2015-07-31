/*
 * ------------------------------------------
 * tooltip精确选择器的基类
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module tooltip/tooltipmanager */
define(['{pro}/libs/colortraits.js',
        '{pro}/libs/colorbox.js',
        '{pro}/scenebuilder/tooltip.js',
        '{pro}/visualencoder/visualencoder.js',
        '{pro}/config/visualencoding/factory.js'],
        function(
          mColorTrait,
          mColorbox,
          buildTooltip,
          mVisualEncoder,
          mVisualFactory
          ){
          /**
           * 提示框
           * @class   module:tooltip/tooltipmanager.TooltipManager
           * @extends colortraits.Klass
           */
          var TooltipManager = mColorTrait.Klass.extend({
            /**
             * 初始化
             * @return  {Object} TooltipManager实例
             */
            initialize: function()
            {
              this.set_visualencoding(mVisualFactory.visualEncodingFactory("tooltip").next());
            },
            /**
             * 构建tooltip场景树，并且设置tooltip的显示
             * @method  module:tooltip/tooltipmanager.TooltipManager#manufacture
             * @param  {Object}   layoutData - tooltip的layoutData数据
             * @return  {Object} - tooltip场景树的根节点
             */
            manufacture: function(sceneSelection, layoutData, area)
            {
              buildTooltip(sceneSelection, layoutData);
              var tooltipSelection = sceneSelection.select(function(actor){
                return actor.dynamicProperty('kind') === 'tooltip';
              });
              var root = tooltipSelection.getElement(0, 0);
              this.settooltip(root);
              mVisualEncoder.apply(tooltipSelection, this._visualencoding());

              this._adjustTooltip(tooltipSelection, area);

              
            },
            /**
             * 调整tooltip的background的宽和高
             * @method  module:tooltip/tooltipmanager.TooltipManager#adjustTooltip
             * @param  {root}   tooltiproot -弹框的根节点
             * @param  {Area}   area - 图表尺寸区域
             * @return  {Void}
             */
            _adjustTooltip: function(tooltipSelection, area) 
            {
              var width, height; 
              tooltipSelection.select(function(actor){
                                    if(actor.dynamicProperty("kind") == "text"){
                                      var bbox = actor.bbox();
                                      width = bbox.width;
                                      height = bbox.height;
                                      return true;
                                    }
                                  });
              width = width === 0 ? 0 : width + 10;
              height = height === 0 ? 0 : height +10;
              tooltipSelection.select(function(actor){
                                      return actor.dynamicProperty("kind") == "background";
                                   })
                           .setProperty("width", width)
                           .setProperty("height", height);

              //调整位置
              var x = this.tooltip().x();
              var y = this.tooltip().y();

              if(x - width < 0) {
                tooltipSelection.setProperty("x", 0);
              }else {
                tooltipSelection.setProperty("x", x - width);
              }

              if(y - height < 0) {
                tooltipSelection.setProperty("y", 0);
              }else {
                tooltipSelection.setProperty("y", y - height);
              }              
            }
          },
            ["_visualencoding", "tooltip"]);

          var tooltipmanager = TooltipManager.create();

          return tooltipmanager;
      });


