var _util = require('../util/util.js'),
    _pkg1 = require('./item.js');
/**
 * 类定义
 */
var _Class = function(){
    _pkg1.Item.call(this);
    this.tag = 'config';
    this.name = '';
};
var _pro = _util.extend(_Class,_pkg1.Item);
/**
 * 设置名称
 * @param  {String} 名称
 * @return {Void}
 */
_pro._$setName = function(_name){
    this.name = _name;
};
/**
 * 获取名称
 * @return {String} 名称
 */
_pro._$getName = function(){
    return this.name;
};
exports.Config = _Class;