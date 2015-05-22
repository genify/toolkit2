/*
 * Script Explorer, used to manage script list
 * @module   explorer/script
 * @author   genify(caijf@corp.netease.com)
 */
var util       = require('util'),
   _Abstract   = require('./explorer.js');
// script explorer
var Explorer = module.exports = function(config){
    _Abstract.apply(this,arguments);
    
    // overwrite script parsing
    this._parseResource = function(res){
        return new require('../meta/script.js')(
            res,this.logger
        );
    };
};
util.inherits(Explorer,_Abstract);