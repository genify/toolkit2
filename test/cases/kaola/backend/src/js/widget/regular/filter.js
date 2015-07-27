/**
 * 表单字段生成组件
 * author yuqijun(yuqijun@corp.netease.com)
 */

NEJ.define([
    'base/util'
], function(_u,_p){
    // common filter
    _p.format = function(date, format){
        return _u._$format(date, format || "yyyy-MM-dd")
    }
    
    _p.escape = _u._$escape;

    /**
     * by hzwuyuedong
     * 字符串截取， 中英文都算一个len
     */
    _p.cutstr = function(str, len) {
      var temp,
        icount = 0,
        patrn = /[^\x00-\xff]/,
        strre = "";
      for (var i = 0; i < str.length; i++) {
        if (icount < len - 1) {
          temp = str.substr(i, 1);
          if (patrn.exec(temp) == null) {
            icount = icount + 1
          } else {
            icount = icount + 2
          }
          strre += temp
        } else {
          break;
        }
      }
      return strre + "..."
    };


    _p.concatObjValue = function(_object, _str){
      var _join = [];
      _u._$forIn(_object,function(_item,_index,_this){
        _join.push(_item);
      });
      return _join.join(_str);
    };
    _p.format = function(_date,_format){
       _format = 'yyyy-MM-dd';
        return !!_date? _u._$format(_date,_format):'';
      };
    /**
     * by hzwuyuedong
     * 浮点数值保留指定位数小数点
     */
    _p.fixed = function(_data, _len){
      return _u._$fixed(_data,_len);
    };
    _p.percent = function(_data, _len){
        return parseFloat(_data)*100 +'%';
      };
    
    return _p;
});