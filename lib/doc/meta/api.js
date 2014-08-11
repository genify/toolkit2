var _util = require('../util/util.js'),
    _pkg1 = require('./process.js');
/**
 * 类定义
 */
var _Class = function(){
    _pkg1.Process.call(this);
    this.tag = 'api';
};
var _pro = _util.extend(_Class,_pkg1.Process);
/**
 * 设置方法标记
 * @param  {String} 标记名
 * @return {Void}
 */
_pro._$setFlag = function(_flag){
    this.flag = _flag;
};
/**
 * 设置方法标记
 * @return {String} 标记名
 */
_pro._$getFlag = function(){
    return this.flag;
};
exports.Api = _Class;