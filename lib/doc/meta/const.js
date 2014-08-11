var _util = require('../util/util.js'),
    _pkg1 = require('./block.js');
/**
 * 类定义
 */
var _Class = function(){
    _pkg1.Block.call(this);
    this.tag = 'const';
    this.type = null;
};
var _pro = _util.extend(_Class,_pkg1.Block);
var _sup = _pkg1.Block.prototype;
/**
 * 设置类型信息
 * @param  {Type} 类型信息
 * @return 
 */
_pro._$setType = function(_type){
    if (_type instanceof require('./type.js').Type){
        this.type = _type;
        _type._$setOwner(this._$getName());
    }
};
/**
 * 获取类型信息
 * @return {Type} 类型信息
 */
_pro._$getType = function(){
    return this.type;
};
/**
 * 解析描述信息
 * @return {Void}
 */
_pro._$parseDescription = function(){
    _sup._$parseDescription.call(this);
    if (!!this.type)
        this.type._$parseDescription();
};
// export class
exports.Const = _Class;