/*
 * ------------------------------------------
 * 线性量化(刻度)
 * @version  0.0.1
 * @author   zjy(zhangjianyi@corp.netease.com)
 * ------------------------------------------
 */
/** @module scale */
define(['{pro}/scale/base.js',
        '{pro}/libs/colortraits.js',
        '{pro}/tools/assert.js',],function(mBase,mColortraits,mAssert){

          var PRIVATE = mColortraits.PRIVATE;
          /**
           * 线性量化(刻度)
           * @class   module:scale/linear.Linear
           * @extends module:scale/base.Base
           */
          var Linear = mBase.extend({
            /**
             * 初始化
             * @return  {Linear} - Linear实例
             */
            initialize : function(){
              this._t.set_domain([0,1]);
              this._t.set_range([0,1]);
              this._t.set_realDomain([0, 1]);
              this._t.set_tickCount(11);

              this.settype("linear");
            },
            /**
             * 执行指定范围值的转换映射
             * @method  module:scale/linear.Linear#exec
             * @param   {Number} value - 需要转换映射的值
             * @param   {Boolean} invert - 默认false指定转换规则是从输入范围到输出范围反之则是从输出范围到输入范围
             * @return  {Number} - 转换映射后的值
             * @example
             * var linear = Linear.create()
             *              .domian([0,10])
             *              .range([0,100]);
             * linear.exec(5); //50
             * linear.exec(5,true);//0.5
             */
            exec : function(x,invert){
              var realDomain = this._t._realDomain();
              var range  = this._t._range();
 
              var d0 = realDomain[0];
              var d1 = realDomain[1];
 
              var r0 = range[0];
              var r1 = range[1];
              
              if(invert)
                return d0 + ((x - r0)/(r1 - r0)) * (d1 - d0);
              else
                return r0 + ((x - d0)/(d1 - d0)) * (r1 - r0);
            },
            /**
             * 获取输入范围的刻度代表值，为了保证邻值相差一致，指定的数量只是一个暗示，最终返回的刻度代表值数量或多或少
             * @method  module:scale/linear.Linear#ticks
             * @return  {Array} - 刻度代表值列表
             * @example
             * var linear = Linear.create()
             *              .domian([0,10])
             *              .range([0,100]);
             * linear.ticks() //[0, 2, 4, 6, 8, 10]
             */
            ticks : function(){
              //var extent = this._t.__extractMinMax(this._t._tickCount());
              var extent = this._t.__newExtractMinMax(this._t._tickCount());
              this._t.set_realDomain([extent.min, extent.max]);

              var _ticks =  this._t.__rangeValues(extent.min,extent.max,extent.step); 

              return _ticks;
            },
            /**
             * 获取或设置刻度的个数
             * @method  module:scale/linear.Linear#ticksCount
             * @param   {Number} count - 刻度代表值的数量
             * @return  {Number | Linear} - 当参数为空时返回tick个数否则返回Linear实例
             */
            ticksCount : function(count){
              if(!count) return this._t._tickCount();

              this.execProto("ticksCount",count);

              this._t.set_tickCount(count);

              return this;
            },
            /**
             * 获取或设置刻度的输入范围
             * @method  module:scale/linear.Linear#domain
             * @param   {Array} domainValues - 输入范围值
             * @return  {Linear | Array} - 当参数为空时返回输入范围值否则返回Linear实例
             * @example
             * var linear = Linear.create();
             * linear.domian([0,10]);//返回Linear实例
             * linear.domian();//[0,10]返回设置的domain value默认值[0,1]
             */
            domain : function(domainValue){
              if(!domainValue) return this._t._domain();
              
              this.execProto("domain",domainValue);

              var _domainValue = [];
              if(domainValue.length > 2){
                _domainValue[0] = Math.min.apply(null,domainValue)
                _domainValue[1] = Math.max.apply(null,domainValue)
              }else{
                _domainValue = domainValue;
              }

              this._t.set_domain(_domainValue);
              this._t.set_realDomain(_domainValue);

              return this;
            },
            /**
             * 获取或设置刻度的输出范围
             * @method  module:scale/linear.Linear#range
             * @param   {Array} rangeValues - 输出范围值
             * @return  {Linear | Array} - 当参数为空时返回输出范围值否则返回Linear实例
             * @example
             * var linear = Linear.create();
             * linear.range([0,100]);//返回Linear实例
             * linear.range();//[0,100]返回设置range value默认值[0,1]
             */
            range : function(rangeValue){
              if(!rangeValue) return this._t._range();

              this.execProto("range",rangeValue);

              this._t.set_range(rangeValue);

              return this;
            },
            /**
             * 获取或设置刻度的输出范围,并且确定输入范围到输出范围的转换精确整数
             * @method  module:scale/linear.Linear#rangeRound
             * @param   {Array} rangeValue - 输出范围值
             * @return  {Linear | Array} - 当参数为空时返回输出范围值否则返回Linear实例
             * @example
             * var linear = Linear.create()
             *              .domain([0,210])
             *              .rangeRound([0,55]);
             *              
             * linear.exec(10); //3
             *     
             * linear.range([0,55]).exec(10);//2.619047619047619
             */
            rangeRound : function(rangeValue){
/*              if(!rangeValue) return this._t._range();

              this.execProto("range",rangeValue);

              this._t.set_range(rangeValue);

              return this;*/
            },
            /**
             * 提取极值
             * @private
             * @method  module:scale/linear.Linear#__extractMinMax
             * @param   {Number} count - 刻度代表值的数量
             * @return  {Object} - 极值对象
             */
            __extractMinMax : function(count){
              this._t.__newExtractMinMax(count);
              var domain = this._t._domain();
              var min = domain[0];
              var max = domain[1];

              if(domain[0] == domain[1] ){
              	if(domain[0]===0){
              		min=0;
              		max=1;
              	}else if(domain[0]>0){
              		min=0;
              		max=2*domain[0];
              	}else{
              		min=2*domain[0];
              		max=0;
              	}
              }
              var span = max - min;
              var step = Math.pow(10,parseInt(Math.log(span/count)/Math.LN10));
              var err = count/span*step;
              if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= 0.75) step *= 2;
              min = Math.floor(min / step) * step;
              // min = min > 0 ? 0 : min;
              max = Math.ceil(max / step) * step + step * .5;   
              return {min : min, max : max, step : step};
            },
            /**
             * 提取极值
             * @private
             * @method  module:scale/linear.Linear#__newExtractMinMax
             * @param   {Number} count - 刻度代表值的数量
             * @return  {Object} - 极值对象
             */
            __newExtractMinMax : function(count){
              var domain = this._t._domain();
              var min = domain[0];
              var max = domain[1];
              if(domain[0] == domain[1]){
                if(domain[0] == 0){
                  min = 0;
                  max = 1;
                }
                else if(domain[0]>0){
                  max = 2*min;
                  min = 0;
                }
                else{
                  min = 2*min;
                  max = 0;
                }
              }
              var span = max-min;
              var step = Math.pow(10, Math.floor(Math.log(span/count)/Math.LN10));//此时这个step肯定是小的
              //参数为1 , 1.5 , 2 , 2.5 , 5 , 10找到一个tick数目与count最接近的即可
              var weight = [1, 2, 2.5, 5, 10];
              var result = this._t.__getTickNumByStep(min, max, step, weight);
              var diffValue = -1, index;
              for (var i = 0; i < result.length; i++) {
                if(diffValue < 0){
                  index = i;
                  diffValue = Math.abs(result[i] - count);
                  continue;
                };
                if(diffValue > Math.abs(result[i] - count)){
                  index = i;
                  diffValue = Math.abs(result[i] - count);
                }
              };
              // console.log('weight: ',weight[index]);
              // console.log('step: ',step*weight[index]);
              step *= weight[index];
              min = Math.floor(min / step) * step;
              // if(min > 0){
              //   if(min - 0.5 * step <= 0)
              //     min = 0;
              //   else
              //     min -= 0.5* step;
              // }
              max = Math.ceil(max / step) * step + step * .5;   
              return {min : min, max : max, step : step};
            },
            __getTickNumByStep : function(min, max, step, weight){
              var result = [];
              var m,n,s;
              for (var i = 0; i < weight.length; i++) {
                s = step * weight[i];
                n = Math.floor(min / s) * s;
                m = Math.ceil(max / s) * s + s * 0.5;
                result.push(Math.ceil((m-n)/s));
              };
              return result;
            },
            /**
             * 区间整数倍
             * @private
             * @method  module:scale/linear.Linear#__integer
             * @param   {Number} value - 区间数量
             * @return  {Number} - 区间倍数
             */
            __integer : function(value){
              var r = 1;
              while(value * r % 1){
                r *= 10;
              }
              return r;
            },
            /**
             * 定值区间
             * @private
             * @method  module:scale/linear.Linear#__rangeValues
             * @param   {Number} start - 区间起始值
             * @param   {Number} stop - 区间结束值
             * @param   {Number} step - 区间步进值
             * @return  {Array} - 定值区间
             */
            __rangeValues : function(start,stop,step){
              if(!step && step != 0) step = 1;
              if(!stop && stop != 0) stop = start, start = 0;

              mAssert((stop - start) / step !== Infinity,'__rangeValues : infinite range');

              var integer = this._t.__integer(Math.abs(step)), range = [], i = -1, j;
              start *= integer; 
              stop  *= integer; 
              step  *= integer;
              if (step < 0) 
                while ((j = start + step * ++i) > stop) range.push(j / integer);
              else 
                while ((j = start + step * ++i) < stop){
                  range.push(j/integer);
                }
              return range;
            }
          },[PRIVATE("_domain"),PRIVATE("_range"),PRIVATE("_tickCount"),PRIVATE("_realDomain")]);

        return Linear;
});