var _util = require('../util/util.js'),
    _pkg1 = require('./block.js');
/**
 * 类定义
 */
var _Class = function(){
    _pkg1.Block.call(this);
    this.params = [];
    this.events = [];
    this.riturn = null;
};
var _pro = _util.extend(_Class,_pkg1.Block);
var _sup = _pkg1.Block.prototype;
/**
 * 添加参数项
 * @param  {Param} 参数对象
 * @return {Void}
 */
_pro._$addParam = function(_param){
    if (_param instanceof require('./param.js').Param){
        this.params.push(_param);
        _param._$setOwner(this._$getName());
    }
};
/**
 * 取参数列表
 * @return {Array} 参数列表
 */
_pro._$getParam = function(){
    return this.params;
};
/**
 * 添加支持回调事件
 * @param  {Event} 事件
 * @return {Void}
 */
_pro._$addEvent = function(_event){
    if (_event instanceof require('./event.js').Event){
        this.events.push(_event);
        _event._$setOwner(this._$getName());
    }
};
/**
 * 获取回调事件列表
 * @return {Array} 回调事件列表
 */
_pro._$getEvent = function(){
    return this.events;
};
/**
 * 设置返回信息
 * @param  {Return} 返回信息
 * @return {Void}
 */
_pro._$setReturn = function(_return){
    if (_return instanceof require('./return.js').Return){
        this.riturn = _return;
        _return._$setOwner(this._$getName());
    }
};
/**
 * 取返回信息
 * @return {Return} 返回信息
 */
_pro._$getReturn = function(){
    return this.riturn;
};
/**
 * 解析描述信息
 * @return {Void}
 */
_pro._$parseDescription = function(){
    _sup._$parseDescription.call(this);
    if (this.params.length>1){
        for(var i=0,l=this.params.length;i<l;i++)
            this.params[i]._$parseDescription();
    }
    if (this.events.length>1){
        for(var i=0,l=this.events.length;i<l;i++)
            this.events[i]._$parseDescription();
    }
    if (!!this.riturn)
        this.riturn._$parseDescription();
};
exports.Process = _Class;