var _util = require('../util/util.js'),
    _pkg1 = require('./base.js');
/**
 * 类定义
 */
var _Class = function(){
    _pkg1.Base.call(this);
    this.name = '';
    this.file = '';
    this.alias = '';
    this.deps = [];
    this.sees = [];
};
var _pro = _util.extend(_Class,_pkg1.Base);
/**
 * 设置名称
 * @param  {String} 名称
 * @return {Void}
 */
_pro._$setName = function(_name){
    this.name = _name;
    if (!this.owner)
        this.owner = _name;
};
/**
 * 获取名称
 * @return {String} 名称
 */
_pro._$getName = function(){
    return this.name;
};
/**
 * 设置文件名
 * @param  {String} 所在文件
 * @return {Void}
 */
_pro._$setFileName = function(_filename){
    this.file = _filename;
};
/**
 * 获取文件名
 * @return {String} 所在文件
 */
_pro._$getFileName = function(){
    return this.file;
};
/**
 * 设置文件名
 * @param  {String} 所在文件
 * @return {Void}
 */
_pro._$setAlias = function(_alias){
    this.alias = _alias;
};
/**
 * 获取文件名
 * @return {String} 所在文件
 */
_pro._$getAlias = function(){
    return this.alias;
};
/**
 * 设置依赖文件
 * @param  {Array} 依赖文件列表
 * @return {Void}
 */
_pro._$setDependList = function(_list){
    this.deps = _list||[];
};
/**
 * 获取依赖文件列表
 * @return {Array} 依赖文件列表
 */
_pro._$getDependList = function(){
    return this.deps;
};
/**
 * 添加关联对象
 * @param  {See} 关联对象
 * @return {Void}
 */
_pro._$addSee = function(_see){
    if (_see instanceof require('./see.js').See){
        this.sees.push(_see);
        _see._$setOwner(this._$getName());
    }
};
/**
 * 取关联对象列表
 * @return {Array} 关联列表
 */
_pro._$getSee = function(){
    return this.sees;
};
/**
 * 获取所属拥有者信息
 * @return {String} 拥有者名称
 */
_pro._$getOwner = function(){
    return this.owner||this.name;
};
exports.Block = _Class;