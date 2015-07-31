/*
 * ------------------------------------------
 * 布局器基类(布局器)
 * @version  0.0.1
 * @author   ww(hzwangwei15@corp.netease.com)
 * ------------------------------------------
 */

/** @module layouter */
define(['{pro}/libs/colorbox.js',
		'{pro}/libs/colortraits.js'
		],
		function( mColorbox,mColortraits){

		var selection = mColorbox.selection;
               /**
                * 布局器虚基类,用于布局器的派生,不能实例化布局器。该类中仅规定了一个布局器具有的基本api(需要派生类实现)
                * @class   module:layouter/layouter.Layouter
                * @extends mColortraits.Klass
                * @return  {Layouter} 一个布局器对象
                */
                var Layouter=mColortraits.Klass.extend({

        	initialize: function(){
        	},
                /**
                 * 基类中定义的布局器的接口，利用布局设置进行布局
                 * @method  module:layouter/layouter.Layouter#layout
                 * @param  {Object} info - 轴信息
                 * @param {Rect} resource - 可用的矩形区域资源
                 * @param {Scene} root - series的场景树根节点
                 * @return {Object} result - 布局完成之后的布局状态及剩余资源信息
                 */
        	layout: function(info,resource,scene){
                  var result= {};
                  return result;
        	}

        },['typeId']);

        return Layouter;

});

