var _util = require('../util/util.js'),
    _pkg1 = require('./item.js');
/**
 * 类定义
 */
var _Class = function(){
    _pkg1.Item.call(this);
    this.configs = [];
};
var _pro = _util.extend(_Class,_pkg1.Item);
var _sup = _pkg1.Item.prototype;
/**
 * 添加配置信息 
 * @param  {Config} 配置对象
 * @return {Void}
 */
_pro._$addConfig = function(_config){
    if (_config instanceof require('./config.js').Config){
        this.configs.push(_config);
        _config._$setOwner(this._$getOwner());
    }
};
/**
 * 取配置列表
 * @return {Array} 配置列表 
 */
_pro._$getConfig = function(){
    return this.configs;
};
/**
 * 解析描述信息
 * @return {Void}
 */
_pro._$parseDescription = function(){
    _sup._$parseDescription.call(this);
    if (this.configs.length>1){
        for(var i=0,l=this.configs.length;i<l;i++)
            this.configs[i]._$parseDescription();
    }
};
exports.ItemX = _Class;