var _parser = require('../desc.js');
/**
 * 类定义
 */
var _Class = function(){
    this.tag = '';
    this.desc = '';
    this.owner = '';
};
var _pro = _Class.prototype;
/**
 * 设置描述信息
 * @param  {String} 名称
 * @return {Void}
 */
_pro._$setDescription = function(_description){
    this.desc = _description||'';
};
/**
 * 获取描述信息
 * @return {String} 名称
 */
_pro._$getDescription = function(){
    return this.desc;
};
/**
 * 设置所属拥有者信息
 * @param  {String} 拥有者名称
 * @return {Void}
 */
_pro._$setOwner = function(_owner){
    this.owner = _owner||'';
};
/**
 * 获取所属拥有者信息
 * @return {String} 拥有者名称
 */
_pro._$getOwner = function(){
    return this.owner;
};
/**
 * 取标记名称
 * @return {String} 标记名称
 */
_pro._$getTag = function(){
    return this.tag;
};
/**
 * 取当前对象所在名字空间
 * @return {String} 名字空间
 */
_pro._$getNameSpace = function(){
    var _space = this._$getOwner()||'';
    // for class
    if (_space.indexOf('_$$')>0)
        return _space;
    // for api
    _space = _space.split('.');
    _space.pop();
    return _space.join('.');
};
/**
 * 解析描述信息
 * @return {Void}
 */
_pro._$parseDescription = function(){
    if (!this.desc) return;
    this.desc = _parser.parse(
                    _parser.link(this.desc,
                        this._$getNameSpace()));
};
exports.Base = _Class;