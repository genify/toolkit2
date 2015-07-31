/*
 * ------------------------------------------
 * 饼状|环状(布局器)
 * @version  0.0.1
 * @author   zjy(zhangjianyi@corp.netease.com)
 * ------------------------------------------
 */
/** @module layouter */
define(['{pro}/libs/colortraits.js',
        '{pro}/tools/assert.js',
        '{pro}/tools/utils.js',
        '{pro}/tools/point.js',
        '{pro}/tools/sum.js',
        '{pro}/layouter/layouter.js'],function(mColortraits,mAssert,mUtils,mPoint,mSum,mLayouter){
    var PRIVATE = mColortraits.PRIVATE;
    /**
     * 饼状|环状(布局器)
     * @class   module:layouter/pielayouter.PieLayouter
     * @extends module:layouter/layouter.Layouter
     * @return  {PieLayouter} 饼状|环状布局器
     */
    var PieLayouter = mLayouter.extend({
        /**
         * 应用布局设置或更新布局属性并返回布局数据
         * @method  module:layouter/pielayouter.PieLayouter#exec
         * @return  {Array} - 布局数据
         * @example
         * var xdata = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
         * var ydata = [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6];
         * var pie = Pie.create()
         *            .xData(xdata)
         *            .yData(ydata)
         *            .radiusRange([10,60])
         *            .angleRange([10,270])
         *            .center([300,300])
         *            .annotationLead(40)
         *            .exec();
         * 
         * //pie : [{center : {x: 200, y: 200},
                     startAngle : 10.145,
                     endAngle : 14.52,
                     radius : [0,170],
                     ratio : 0.6,
                     cable : [{x: 250, y: 250},{x: 300, y: 300}],
                     annotation : {x : 300, y : 300, text : 'Jan'}
                    }....]
         */
        exec : function(){

            var layoutData = [];

            var xData = this._t._xData();

            var yData = this._t._yData();
            
            var rose = this._t._rose();

            var center = this._t._center();

            var leadValue = this._t._annotationLead();

            var radiusRange = this._t._radiusRange();

            var angleRange  = this._t._angleRange();

            var sAngle = angleRange[0]*Math.PI/180;

            var eAngle = 0;

            var wholeAngle = Math.abs(angleRange[1] - angleRange[0]);

            var totalValue = mSum(yData);

            var maxValue = Math.max.apply(null,yData);

            var ratioValue = 0;

            var reformRose = function(ratio,radius){
                var arr = [];
                arr[0] = radius[0];
                arr[1] = (radius[1] - radius[0]) * ratio + radius[0];
                return arr;
            };

            for(var i = 0;i < yData.length;i++){
                ratioValue = yData[i]/totalValue;
                eAngle = sAngle + (Math.PI/180*wholeAngle)*(ratioValue);
                if(rose) var roseRadius = reformRose(yData[i]/maxValue,radiusRange);
                var _ar = roseRadius ? roseRadius[1] : radiusRange[1];
                var ag = (eAngle - sAngle)/2 + sAngle;
                var cos = Math.cos(ag);
                var sin = Math.sin(ag);
                var tx = cos * (_ar) + center[0];
                var ty = sin * (_ar) + center[1];

                var px = cos < 0 ? tx - leadValue : tx + leadValue;
                var py = ty + sin * leadValue;
                var cable = [mPoint(tx,ty),mPoint(tx + cos * leadValue,ty + sin * leadValue),mPoint(px,py)];

                layoutData.push({center : mPoint(center[0],center[1]), 
                                startAngle : sAngle,
                                endAngle : eAngle, 
                                radius : roseRadius || radiusRange,
                                cable : cable,
                                ratio : ratioValue, 
                                annotation :{x : px, y : py, text : xData[i] || ""}});
                sAngle = eAngle;
            }
            return layoutData;
        },
        /**
         * 获取或设置半径范围
         * @method  module:layouter/pielayouter.PieLayouter#radiusRange
         * @param   {Array} radiusValues - 半径范围
         * @param   {Boolean} roseValue - 是否计算半径占比(玫瑰图)
         * @return  {Pie | Array} - 当参数为空时返回半径范围否则返回Pie实例
         */
        radiusRange : function(radiusValues,roseValue){
            if(!radiusValues)return this._t._radiusRange();

            mAssert(mUtils.isArray(radiusValues),'radiusRange : parameter types error');

            this._t.set_radiusRange(radiusValues);

            if(roseValue) this._t.set_rose(roseValue);

            return this;
        },
        /**
         * 获取或设置角度范围
         * @method  module:layouter/pielayouter.PieLayouter#angleRange
         * @param   {Array} angleValues - 角度范围
         * @return  {Pie | Array} - 当参数为空时返回角度范围否则返回Pie实例
         */
        angleRange : function(angleValues){
            if(!angleValues) return this._t._angleRange();

            mAssert(mUtils.isArray(angleValues),'angleRange : parameter types error');

            this._t.set_angleRange(angleValues);

            return this;         
        },
        /**
         * 获取或设置中心点
         * @method  module:layouter/pielayouter.PieLayouter#center
         * @param   {Array} centerValues - 中心点
         * @return  {Pie | Array} - 当参数为空时返回中心点否则返回Pie实例
         */
        center : function(centerValues){
            if(!centerValues) return this._t._center();

            mAssert(mUtils.isArray(centerValues),'center : parameter types error');

            this._t.set_center(centerValues);

            return this;
        },
        /**
         * 获取或设置外连线的长度
         * @method  module:layouter/pielayouter.PieLayouter#annotationLead
         * @param   {Number} leadValue - 外连线的长度
         * @return  {Pie | Number} - 当参数为空时返回外连线的长度否则返回Pie实例
         */
        annotationLead : function(leadValue){
            if(!leadValue) return this._t._annotationLead();

            mAssert(mUtils.isNumber(leadValue),'annotationLead : parameter types error');

            this._t.set_annotationLead(leadValue);

            return this;
        },
        /**
         * 获取或设置需要水平映射的原始数据
         * @method  module:layouter/pielayouter.PieLayouter#xData
         * @param   {Array} dataValue - 需要映射的原始数据  
         * @return  {Pie | Array} - 当参数为空时返回原始数据否则返回Pie实例
         */
        xData : function(dataValue){
            if(!dataValue) return this._t._xData();

            mAssert(mUtils.isArray(dataValue),'xData : parameter types error');

            this._t.set_xData(dataValue);

            return this;
        },
        /**
         * 获取或设置需要垂直映射的原始数据
         * @method  module:layouter/pielayouter.PieLayouter#yData
         * @param   {Array} dataValue - 需要映射的原始数据 
         * @return  {Pie | Array} - 当参数为空时返回原始数据否则返回Pie实例
         */
        yData : function(dataValue){
            if(!dataValue) return this._t._yData();

            mAssert(mUtils.isArray(dataValue),'yData : parameter types error');

            this._t.set_yData(dataValue);

            return this;
        }
    },[PRIVATE("_radiusRange"),
       PRIVATE("_angleRange"),
       PRIVATE("_center"),
       PRIVATE("_annotationLead"),
       PRIVATE("_rose"),
       PRIVATE("_xData"),
       PRIVATE("_yData")]);

    return PieLayouter;
});