/*
 * Template Explorer, used to manage template list
 * @module   explorer/template
 * @author   genify(caijf@corp.netease.com)
 */
var _util = require('../util/util.js');
// resource type map
var RESOURCE = {
    txt:'text',
    ntp:'text',
    jst:'text',
    js:'script',
    css:'style',
    html:'template',
    'nej/css':'style',
    'nej/html':'template',
    'nej/javascript':'script'
};
// template explorer
var Template = module.exports =
    require('../util/klass.js').create();
var pro = Template.extend(require('./explorer.js'));
/**
 * parse resource item
 * @protected
 * @param  {Object} res - resource config
 * @return {Void}
 */
pro._parseResource = function(res){
    var type = RESOURCE[res.type];
    if (!!type){
        return new (require('../meta/'+type+'.js'))(res);
    }
};
/**
 * check whether item matches resource
 * @protected
 * @param  {Object}  res - resource item
 * @param  {Object}  config - config object
 * @return {Boolean} whether item matches resource
 */
pro._isResMatch = function(res,config){
    var type = config.resType;
    if (!type){
        return !1;
    }
    return res instanceof (
        require('../meta/'+type+'.js')
    );
};
/**
 * stringify content
 * @param  {Object} config - config object
 * @return {String} content
 */
pro.stringify = function(config){
    var ret = [];
    this._list.forEach(
        function(inst){
            if (this._isResMatch(inst,config)){
                ret.push(inst.stringify(config));
            }
        },this
    );
    return ret.join('\n');
};
