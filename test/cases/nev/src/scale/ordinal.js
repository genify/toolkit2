/*
 * ------------------------------------------
 * 等级分类(刻度)
 * @version  0.0.1
 * @author   zjy(zhangjianyi@corp.netease.com)
 * ------------------------------------------
 */
/** @module scale */
define(['{pro}/scale/base.js',
  '{pro}/libs/colortraits.js',
  '{pro}/tools/assert.js',
  '{pro}/tools/utils.js'
], function(mBase, mColortraits, mAssert, mTypeHelper) {

  var PRIVATE = mColortraits.PRIVATE;
  var isArray = mTypeHelper.isArray;
  var isObject = mTypeHelper.isObject;
  /**
   * 等级分类(刻度)
   * @class   module:scale/ordinal.Ordinal
   * @extends module:scale/base.Base
   */
  var Ordinal = mBase.extend({
    /**
     * 初始化
     * @return  {Ordinal} - Ordinal实例
     */
    initialize: function() {
      this._t.set_domain([0, 1]);
      this._t.set_domainMap({});
      this._t.set_range([0, 1]);
      this._t.set_rangeBand(0);
      this._t.set_id([]);
      this._t.set_ranger({
        t: "range",
        a: []
      });
      this._t.set_tickCount(null);
      this.settype("ordinal");
      this._t.set_step(0);
    },
    /**
     * 执行指定范围值的转换映射
     * @method  module:scale/ordinal.Ordinal#exec
     * @param   {Number} value - 需要转换映射的值
     * @return  {Number} - 转换映射后的值
     * @example
     * var ordinal = Ordinal.create()
     *               .domain(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'])
     *               .rangeBands([0,100]);
     * ordinal.exec('Fed');//8.333333333333334
     */
    exec: function(value) {
      var domainMap = this._t._domainMap();
      var domain = this._t._domain();
      var range = this._t._range();
      var ids = this._t._id();
      var index = NaN;

      if (typeof(value) === 'string') {
        index = ((domainMap[value] ? domainMap[value] : NaN) - 1) % range.length;
      }
      if (typeof(value) === "number") {
        for (var i = 0; i < ids.length; i++) {
          if (ids[i] === value) {
            index = i;
          }
        };
      }
      //var index = ((domainMap[value] ? domainMap[value] : NaN) - 1) % range.length;
      // return range[index] + this._t._step() / 2;
      return range[index] || NaN;
    },


    /**
     * 获取或设置刻度的输入范围
     * @method  module:scale/ordinal.Ordinal#domain
     * @param   {Array} domainValues - 输入范围值
     * @return  {Ordinal | Array} - 当参数为空时返回输入范围值否则返回Ordinal实例
     * @example
     * var ordinal = Ordinal.create();
     * ordinal.domain(['香蕉','苹果','橙子','梨']);//返回Ordinal实例
     * ordinal.domain();//['香蕉','苹果','橙子','梨']返回设置的domain value默认值[0,1]
     */
    domain: function(domainValue) {
      if (!domainValue) return this._t._domain();

      var mapValues = {};

      var index = 1;
      for (var key in domainValue) {
        //console.log(key);
        mapValues[domainValue[key]] = index++;
      };
      this._t.set_domainMap(mapValues);

      this._t.set_domain(domainValue);
    //  console.log('设置定义域：', domainValue);
      return this;
    },
    /**
     * 获取或设置刻度的输出范围
     * @method  module:scale/ordinal.Ordinal#range
     * @param   {Array} rangeValues - 输出范围值
     * @return  {Ordinal | Array} - 当参数为空时返回输出范围值否则返回Ordinal实例
     * @example
     * var ordinal = Ordinal.create();
     * ordinal.range([0,100]);//返回Ordinal实例
     * ordinal.range();//[0.0076335877862595426, 0.08396946564885496, 0.1603053435114504, 0.2366412213740458, 0.31297709923664124, 0.3893129770992367, 0.46564885496183206, 0.5419847328244275, 0.6183206106870229, 0.6946564885496184, 0.7709923664122138, 0.8473282442748092, 0.9236641221374046]
     */
    range: function(rangeValue) {
      if (!rangeValue) return this._t._range();

      this.execProto("range", rangeValue);

      this._t.set_range(rangeValue);

      return this;
    },
    ids: function(idArray) {
      if (!idArray) return this._t._id();

      mAssert(isArray(idArray), "your index in ordinal scale is not the array.");
    //  console.log('设置索引值:', idArray);
      this._t.set_id(idArray);

      return this;
    },
    /**
     * 获取或设置刻度的输出范围,根据输入域的数量划分为n个等间距的点并且允许指定首尾边缘填充间距
     * @method  module:scale/ordinal.Ordinal#rangePoints
     * @param   {Array} rangeValue - 输出范围值
     * @param   {Number} padding - 首尾边缘的填充间距(1则代表等间距的一半)
     * @return  {Ordinal | Array} - 当参数为空时返回输出范围值否则返回Ordinal实例
     * @example
     * var ordinal = Ordinal.create()
     *               .domain(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'])
     *               .rangePoints([0,100]);
     * ordinal.range();//[0, 9.090909090909092, 18.181818181818183, 27.272727272727273, 36.36363636363637, 45.45454545454546, 54.54545454545455, 63.63636363636364, 72.72727272727273, 81.81818181818183, 90.90909090909092, 100.00000000000001]
     * ordinal.rangePoints([0,100],1).range();//[4.166666666666667, 12.5, 20.833333333333336, 29.166666666666668, 37.5, 45.833333333333336, 54.166666666666664, 62.5, 70.83333333333334, 79.16666666666667, 87.50000000000001, 95.83333333333334]
     */
    rangePoints: function(rangeValue, padding) {
      /*              if(!padding && padding != 0) padding = 0;
                    var length = this._t._domain().length;
                    var start = rangeValue[0], 
                         stop = rangeValue[1], 
                         step = (stop - start) / (Math.max(1, length - 1) + padding),
                       values = this._t.__steps(length < 2 ? (start + stop) / 2 : start + step * padding / 2, step);
                    this.range(values);

                    this._t.set_ranger({this._t : "rangePoints", a : arguments});

                    return this;*/
    },
    /**
     * 获取或设置刻度的输出范围,根据输入域的数量划分为n个等间距的点，允许指定首尾填充间距和相邻点之间的填充间距
     * @method  module:scale/ordinal.Ordinal#rangeBands
     * @param   {Array} rangeValue - 输出范围值
     * @param   {Number} padding - 相邻点之间的填充间距(通常值[0,1]之间)
     * @param   {Number} outerPadding - 首尾边缘的填充间距(对应相邻间距的分配范围)
     * @return  {Ordinal | Array} - 当参数为空时返回输出范围值否则返回Ordinal实例
     * @example
     * var ordinal = Ordinal.create()
     *               .domain(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'])
     *               .rangeBands([0,100]);
     * ordinal.range();//[0, 8.333333333333334, 16.666666666666668, 25, 33.333333333333336, 41.66666666666667, 50, 58.333333333333336, 66.66666666666667, 75, 83.33333333333334, 91.66666666666667]
     * ordinal.rangeBands([0,100],1).range();//[7.6923076923076925, 15.384615384615385, 23.076923076923077, 30.76923076923077, 38.46153846153846, 46.15384615384615, 53.84615384615385, 61.53846153846154, 69.23076923076923, 76.92307692307692, 84.61538461538461, 92.3076923076923]
     * ordinal.rangeBands([0,100],0.5).range();//[4, 12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92]
     * ordinal.rangeBands([0,100],1,0.5).range();//[4.166666666666667, 12.5, 20.833333333333336, 29.166666666666668, 37.5, 45.833333333333336, 54.166666666666664, 62.5, 70.83333333333334, 79.16666666666667, 87.50000000000001, 95.83333333333334]
     */
    rangeBands: function(rangeValue, padding, outerPadding1, outerPadding2) {
      if (!padding && padding != 0) padding = 0;
      if (!outerPadding1 && outerPadding1 != 0) outerPadding1 = padding;
      if (!outerPadding2 && outerPadding2 != 0) outerPadding2 = padding;
      var length = this._t._domain().length;
      var reverse = rangeValue[1] < rangeValue[0],
        start = rangeValue[reverse - 0],
        stop = rangeValue[1 - reverse],
        step = (stop - start) / (length - padding + outerPadding1 + outerPadding2);
        //   step = (stop - start) / (length - padding + 2 * outerPadding),

        start = (reverse ? outerPadding2 : outerPadding1) * step + start + step / 2;
    //  console.log("step",step,start)
      values = this._t.__steps(start, step);
      //t.__steps(start+step, step);需要确定
   //   console.log("++++",values)

      this.range(reverse ? values.reverse() : values);
      this.setouterPadding2(outerPadding2);
      this.setouterPadding1(outerPadding1);
      this._t.set_rangeBand(step * (1 - padding));
      this._t.set_step(step);
      this._t.set_ranger({
        t: "rangeBands",
        a: arguments
      });

      return this;
    },


    getCategoryByIndex: function(index) {
      var domain = this._t._domain();
      var ids = this._t._id();
      for (var i = 0; i < ids.length; i++) {
        if (ids[i] === index) {
          return domain[i];
        }
      };
      //return domain[index];
    },
    /**
     * 获取或设置刻度的输出范围,根据输入域的数量划分为n个等间距的点(转换精确到整数)，允许指定首尾填充间距和相邻点之间的填充间距
     * @method  module:scale/ordinal.Ordinal#rangeRoundBands
     * @param   {Array} rangeValue - 输出范围值
     * @param   {Number} padding - 相邻点之间的填充间距(通常值[0,1]之间)
     * @param   {Number} outerPadding - 首尾边缘的填充间距(对应相邻间距的分配范围)
     * @return  {Ordinal | Array} - 当参数为空时返回输出范围值否则返回Ordinal实例
     * @example
     * var ordinal = Ordinal.create()
     *               .domain(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'])
     *               .rangeRoundBands([0,100]);
     * ordinal.range();//[2, 10, 18, 26, 34, 42, 50, 58, 66, 74, 82, 90]
     * ordinal.rangeRoundBands([0,100],1).range();//[12, 19, 26, 33, 40, 47, 54, 61, 68, 75, 82, 89]
     * ordinal.rangeRoundBands([0,100],0.5).range();//[4, 12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92]
     * ordinal.rangeRoundBands([0,100],1,0.5).range();//[6, 14, 22, 30, 38, 46, 54, 62, 70, 78, 86, 94]
     */
    rangeRoundBands: function(rangeValue, padding, outerPadding) {
      /*              if(!padding && padding != 0) padding = 0;
                    if(!outerPadding && outerPadding != 0) outerPadding = padding;
                    var length = this._t._domain().length;
                    var reverse = rangeValue[1] < rangeValue[0], 
                          start = rangeValue[reverse - 0], 
                          stop = rangeValue[1 - reverse], 
                          step = Math.floor((stop - start) / (length - padding + 2 * outerPadding)), 
                         error = stop - start - (length - padding) * step,
                        values = this._t.__steps(start + Math.round(error / 2), step);
                    this.range(reverse ? values.reverse() : values);
                    this._t.set_rangeBand(Math.round(step * (1 - padding)));
                    this._t.set_ranger({t : "rangeRoundBands", a : arguments});
                    return this;*/
    },
    /**
     * 当配置输出范围rangeBands或rangeRoundBands,则返回间距值；否则返回0
     * @method  module:scale/ordinal.Ordinal#rangeBand
     * @return  {Number} - 间距值
     * @example
     * var ordinal = Ordinal.create()
     *               .domain(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'])
     *               .rangeRoundBands([0,100]);
     * ordinal.range();//[2, 10, 18, 26, 34, 42, 50, 58, 66, 74, 82, 90]
     * ordinal.rangeBand();//8
     * ordinal.rangePoints([0,100]).rangeBand();//0
     */
    rangeBand: function() {
      /* return this._t._rangeBand();*/
    },
    /**
     * 输出tick之间的step值(rangeBand)
     * @method  module:scale/ordinal.Ordinal#step
     * @return  {Array} - 输出step
     */
    step: function() {
      return this._t._step();
    },
    /**
     * 获取输出的最小和最大值范围
     * @method  module:scale/ordinal.Ordinal#rangeExtent
     * @return  {Array} - 输出的最小和最大值范围
     * @example
     * var ordinal = Ordinal.create()
     *               .domain(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'])
     *               .rangeRoundBands([0,100]);
     * ordinal.rangeExtent();//[0, 100]
     */
    rangeExtent: function() {
      var ranger = this._t._ranger();
      return this.execProto("scaleExtent", ranger.a[0]);
    },
    /**
     * 根据输入域的数据长度从输出域获得区间列表
     * @private
     * @param   {Number} start - 区间起始点
     * @param   {Number} step - 区间步进宽度
     * @return  {Array} - 区间列表
     */
    __steps: function(start, step) {
      var t = this._t,
        result = [];
      var length = t._domain().length;
      for (var i = 0; i < length; i++) {
        result.push(start + step * i);
      }
      return result;
    },
    /**
     * 获取输入范围的刻度代表值，为了保证邻值相差一致，指定的数量只是一个暗示，最终返回的刻度代表值数量或多或少
     * @method  module:scale/ordinal.Ordinal#ticks
     * @return  {Array} - 刻度代表值列表
     * @example
     * var Ordinal = Ordinal.create()
     *              .domain(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'])
     *              .tickCount(4);
     * Ordinal.ticks() //['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
     */
    ticks: function() {
      //var realdomain = this._t.__uniformRealDomain(this._t._tickCount());
      //var realdomain = this._t.__nonuniformRealDomain(this._t._tickCount());
      var realdomain = this._t.__newPolicyRealDomain(this._t._tickCount());

      this._t.set_realDomain(realdomain);
      return realdomain;
    },
    __uniformRealDomain: function(count) {
      var domain = this._t._domain();
      var realcount = domain.length;
      if (count && count >= 2) {
        for (var i = count, length = domain.length; i < length; i++) {
          if (parseInt((length - 1) / (i - 1)) === (length - 1) / (i - 1)) {
            realcount = i;
            break;
          }
        }
      }

      if (realcount == domain.length) {
        return domain;
      } else {
        var step = (domain.length - 1) / (realcount - 1);
        var realdomain = domain.filter(function(data, index) {
          return parseInt(index / step) === (index / step);
        });

        return realdomain;
      }
    },
    __nonuniformRealDomain: function(count) {
      var domain = this._t._domain();
      var interval = 0;
      if (count && count >= 2 && count < domain.length) {
        interval = parseInt((domain.length - 1) / (count - 1));
      }

      if (interval == 0) {
        return domain;
      } else if (interval > 0) {
        var realdomain = [];
        var i = 0;
        while (i < domain.length - 1) {
          realdomain.push(domain[i]);
          i += interval;
        }
        //realdomain.push(domain[domain.length - 1]);

        return realdomain;
      }
    },
    //domain:['Feb','Feb','Mar','Apr','May']
    //ids : [2,4,6,8,9]
    //可能输出index为[2,6,9] 这是指的就是第1个'Feb','Mar','May'
    __newPolicyRealDomain: function(count) {
      var domain = this._t._domain();
      var ids = this._t._id();
      var interval = 0;
      var index = [];
      for (var i = 0; i < domain.length; i++) {
        index.push(ids[i]); //注入id的值
      };
      if (count && count < domain.length) {
        interval = Math.ceil(domain.length / count);
      }
      if (interval == 0)
        return index;
      else if (interval > 0) {
        var realdomain = [];
        var i = parseInt(interval / 2);
        while (i < domain.length) {
          realdomain.push(ids[i]);
          i += interval;
        }
        return realdomain;
      }
      return index;
    },
    // __newPolicyRealDomain:function(count){
    //   var domain = this._t._domain();
    //   var interval = 0;
    //   //var tickNumPerSet = 0;
    //   if(count && count < domain.length){
    //     interval = Math.ceil(domain.length/count);
    //   }
    //   if(interval == 0)
    //     return domain;
    //   else if(interval > 0){
    //     var realdomain = [];
    //     var i = parseInt(interval/2);
    //     while(i < domain.length){
    //       realdomain.push(domain[i]);
    //       i += interval;
    //     }
    //     return realdomain;
    //   }
    //   return domain;
    // },
    /**
     * 获取或设置刻度的个数
     * @method  module:scale/ordinal.Ordinal#ticksCount
     * @param   {Number} count - 刻度代表值的数量
     * @return  {Number | Ordinal} - 当参数为空时返回tick个数否则返回Ordinal实例
     */
    ticksCount: function(count) {
      if (!count) return this._t._tickCount();

      this.execProto("ticksCount", count);

      this._t.set_tickCount(count);

      return this;
    },
  }, [PRIVATE("_domain"), PRIVATE("_range"), PRIVATE("_id"), PRIVATE("_realDomain"), PRIVATE("_ranger"), PRIVATE("_rangeBand"), PRIVATE("_domainMap"), PRIVATE("_tickCount"), PRIVATE("_step"), "outerPadding1", "outerPadding2"]);

  return Ordinal;
});