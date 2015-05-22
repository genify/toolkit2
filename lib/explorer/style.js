/*
 * Style Explorer, used to manage style list
 * @module   explorer/style
 * @author   genify(caijf@corp.netease.com)
 */
var util       = require('util'),
   _Abstract   = require('./explorer.js');
// style explorer
var Explorer = module.exports = function(config){
    _Abstract.apply(this,arguments);
    
    // overwrite style parsing
    this._parseResource = function(res){
        return new require('../meta/style.js')(
            res,this.logger
        );
    };
};
util.inherits(Explorer,_Abstract);