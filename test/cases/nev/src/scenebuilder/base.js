/*
 * ------------------------------------------
 * 布局数据构建场景树的抽象基类
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module scenebuilder */
define(['{pro}/libs/colortraits.js', 
        '{pro}/libs/colorbox.js'],
        function(
          mColortraits, 
          mColorbox){
          var ContainerSprite = mColorbox.ContainerSprite;          
          /**
           * 场景构建器基类
           * @class   module:scenebuilder/base.Base
           * @extends colortraits.Klass
           */
          var Base = mColortraits.Klass.extend({
            /**
             * 初始化构造函数，完成：设置布局数据，构建场景树
             * @param  {Object | Array}   layoutData - 布局器数据
             * @return  {Object} 实例
             */
            initialize: function()
            {
              this._t.setroot(ContainerSprite.create());              
            },
            /**
             * 构建场景树
             * @method  module:scenebuilder/base.Base#build
             * @return  {Object} - 场景树的根节点
             */
            build: function()
            {

            }
            
          },
            [mColortraits.READONLY("root")]);


          return Base;

        });