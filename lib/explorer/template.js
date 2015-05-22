/*
 * Template Explorer, used to manage template list
 * @module   explorer/template
 * @author   genify(caijf@corp.netease.com)
 */
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
        html:'template'
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