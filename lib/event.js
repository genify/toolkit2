/*
 * Abstract Class with Event Emitter
 * @module   event
 * @author   genify(caijf@corp.netease.com)
 */
var _util = require('./util/util.js');
// Abstract Event Class
var Event = module.exports =
    require('./util/klass.js').create();
var pro = Event.prototype;
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._listeners = {};
    config = config||{};
    Object.keys(config).forEach(function(key){
        if (_util.isFunction(config[key])){
            this.on(key,config[key]);
        }
    },this);
};
/**
 * add event listener
 * @param  {String}   name  - event name
 * @param  {Function} event - event handler
 * @return {Void}
 */
pro.on = function(name,event){
    // check function
    if (!_util.isFunction(event)){
        return;
    }
    // cache event handler
    var ret = this._listeners[name];
    if (!ret){
        ret = [];
        this._listeners[name] = ret;
    }
    ret.push(event);
};
/**
 * remove event handler
 * @param  {String}   name  - event name
 * @param  {Function} event - event handler
 * @return {Void}
 */
pro.off = function(name,event){
    var ret = this._listeners[name];
    if (!ret){
        return;
    }
    // remove all if not pass event
    if (!event){
        delete this._listeners[name];
        return;
    }
    // remove one event
    var index = ret.indexOf(event);
    if (index>=0){
        ret.splice(index,1);
    }
};
/**
 * emit event with config
 * @param  {String} name   - event name
 * @param  {Object} config - event config
 * @return {Void}
 */
pro.emit = function(name,config){
    var ret = this._listeners[name];
    if (!!ret){
        ret.forEach(function(func){
            func.call(this,config);
        });
    }
};
