/*
 * ------------------------------------------
 * 数据到可视化视觉编码之间的转换(刻度)抽象基类
 * @version  0.0.1
 * @author   zjy(zhangjianyi@corp.netease.com)
 * ------------------------------------------
 */
/** @module scale */
define(['{pro}/libs/colortraits.js',
        '{pro}/tools/assert.js',
        '{pro}/tools/utils.js'],function(mColortraits,mAssert,mUtils){
	/**
     * 数据到可视化视觉编码之间的转换(刻度)抽象基类
     * @class   module:scale/base.Base
     * @extends colortraits.Klass
     */
	var Base = mColortraits.Klass.extend({  
        /**
         * 获取或设置刻度的输入范围
         * @method  module:scale/base.Base#domain
         * @param   {Array} domainValues - 输入范围值
         * @return  {Base | Array} - 当参数为空时返回输入范围值否则返回Base的子类实例
         */
        domain : function(domainValues){
            mAssert(mUtils.isArray(domainValues),'domain : parameter types error');
        },
       /**
        * 获取或设置刻度的输出范围
        * @method  module:scale/base.Base#range
        * @param   {Array} rangeValues - 输出范围值
        * @return  {Base | Array} - 当参数为空时返回输出范围值否则返回Base的子类实例
        */
        range : function(rangeValues){
            mAssert(mUtils.isArray(rangeValues),'range : parameter types error');
        },
        /**
        * 获取输出的最小和最大值范围(Base的子类实例调用)
        * @method  module:scale/base.Base#scaleRange
        * @return  {Array} - 输出的最小和最大值范围
        */
        scaleRange : function(){
            return this.rangeExtent ? this.rangeExtent() : this.scaleExtent(this.range());
        },
        /**
        * 获取排序后的指定范围值(Base的子类实例调用)
        * @method  module:scale/base.Base#scaleExtent
        * @param   {Array} values - 指定范围值
        * @return  {Array} - 排序后的指定范围值
        */
        scaleExtent : function(values){
            var start = values[0], stop = values[values.length - 1];
            return start < stop ? [ start, stop ] : [ stop, start ];
        },
        /**
        * 获取或设置刻度的个数
        * @method  module:scale/base.Base#ticksCount
        * @param   {Number} count - 指定tick个数
        * @return  {Base | Number} - 当参数为空时返回tick个数否则返回Base的子类实例
        */
        ticksCount : function(count){
           mAssert(mUtils.isNumber(count),'count : parameter types error');            
        }
	}, ["type"]);

    return Base;
})