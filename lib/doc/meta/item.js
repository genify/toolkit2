var _util = require('../util/util.js'),
    _pkg1 = require('./base.js');
/**
 * 类定义
 */
var _Class = function(){
    _pkg1.Base.call(this);
    this.type = '';
};
var _pro = _util.extend(_Class,_pkg1.Base);
/**
 * 设置类型
 * @param  {String} 类型
 * @return {Void}
 */
_pro._$setType = function(_type){
    this.type = _type;
};
/**
 * 获取类型
 * @return {String} 类型
 */
_pro._$getType = function(){
    return this.type;
};
exports.Item = _Class;