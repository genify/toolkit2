define(function(p){
  /**
   * String类型检测
   * @param  {Object}   source 
   * @return {Boolean}
   */
  p.isString = function(source){
    return typeof source === 'string';
  };
  /**
   * Function类型检测
   * @param  {Object}   source 
   * @return {Boolean}
   */
  p.isFunction = function(source){
    return Object.prototype.toString.call(source) === '[object Function]';
  };
  /**
   * Object类型检测
   * @param  {Object}  source
   * @return {Boolean}
   */
  p.isObject = function(source){
    return Object.prototype.toString.call(source) === '[object Object]';
  };
  /**
   * Number类型检测
   * @param  {Object}   source
   * @return {Boolean}
   */
  p.isNumber = function(source){
    return typeof source === 'number';
  };
  /**
   * Array类型检测
   * @param  {Object}   source
   * @return {Boolean}
   */
  p.isArray = function(source){
    return Object.prototype.toString.call(source) === '[object Array]';
  };
  /**
   * Boolean类型检测
   * @param  {Object}   source
   * @return {Boolean}
   */
  p.isBoolean = function(source){
    return typeof source === 'boolean';
  };
  /**
   * 去除数组中的重复元素
   * @param  {Array}   arr
   * @return {Array}
   */
  p.unique = function(arr){
    var tmp = new Array();
      for(var i in arr){
        if(tmp.indexOf(arr[i])==-1){
          tmp.push(arr[i]);
         }
      }
     return tmp;
 }

  return p;

});