/*
 * Template Explorer, used to manage template list
 * @module   explorer/template
 * @author   genify(caijf@corp.netease.com)
 */

var Template = module.exports =
    require('../util/klass.js').create();
var pro = Template.extend(require('./explorer.js'));
/**
 * parse resource item
 * @protected
 * @param  {Object} res - resource config
 * @return {Void}
 */
pro._parseResource = (function(){
    var _rMap = {
        txt:'text',
        ntp:'text',
        jst:'text',
        js:'script',
        css:'style',
        html:'html',
        'nej/css':'style',
        'nej/html':'html',
        'nej/javascript':'script'
    };
    return function(res){
        var type = _rMap[res.type];
        if (!!type){
            var Module = require('../meta/'+type+'.js');
            return new Module(res);
        }
    };
})();

var util       = require('util'),
   _Abstract   = require('./explorer.js');
// template explorer
var Explorer = module.exports = function(config){
    _Abstract.apply(this,arguments);

    // overwrite script parsing
    // type     txt/ntp/jst or css/js/html
    var _rMap = {
        txt:'text',
        ntp:'text',
        jst:'text',
        js:'script',
        css:'style',
        html:'html',
        'nej/css':'style',
        'nej/html':'html',
        'nej/javascript':'script'
    };
    this._parseResource = function(res){
        var module = _rMap[res.type];
        if (!!module){
            return new require(module)(
                res,this.logger
            );
        }
    };
};
util.inherits(Explorer,_Abstract);