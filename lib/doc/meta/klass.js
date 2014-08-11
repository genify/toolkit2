var _util = require('../util/util.js'),
    _pkg1 = require('./process.js');
/**
 * 类定义
 */
var _Class = function(){
    _pkg1.Process.call(this);
    this.tag = 'class';
    this.uses = [];
    this.super = '';
    this.methods = [];
    this.singleton = !1;
};
var _pro = _util.extend(_Class,_pkg1.Process);
var _sup = _pkg1.Process.prototype;
/**
 * 设置单例标识
 * @return {Void}
 */
_pro._$setSingleton = function(){
    this.singleton = !0;
};
/**
 * 取单例标识
 * @return {Boolean} 单例标识
 */
_pro._$isSingleton = function(){
    return this.singleton;
};
/**
 * 设置父类
 * @param  {String} 父类对象名称
 * @return {Void}
 */
_pro._$setSuper = function(_super){
    this.super = _super;
};
/**
 * 获取父类
 * @return {String} 父类对象名称
 */
_pro._$getSuper = function(){
    return this.super;
};
/**
 * 添加关联类
 * @param  {String} 关联类名称
 * @return {Void}
 */
_pro._$addUsedClass = function(_klass){
    this.uses.push(_klass);
};
/**
 * 获取关联类
 * @return {Array} 关联类
 */
_pro._$getUsedClass = function(){
    return this.uses;
};
/**
 * 添加方法
 * @param  {Method} 方法
 * @return {Void}
 */
_pro._$addMethod = function(_method){
    if (_method instanceof require('./method.js').Method){
        this.methods.push(_method);
        _method._$setOwner(this._$getName());
    }
};
/**
 * 获取方法列表
 * @return {Array} 方法列表
 */
_pro._$getMethod = function(){
    return this.methods;
};
/**
 * 解析描述信息
 * @return {Void}
 */
_pro._$parseDescription = function(){
    _sup._$parseDescription.call(this);
    if (this.methods.length>1){
        for(var i=0,l=this.methods.length;i<l;i++)
            this.methods[i]._$parseDescription();
    }
};
// export class
exports.Klass = _Class;