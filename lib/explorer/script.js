var util       = require('util'),
   _Resource   = require('../meta/script.js'),
   _Abstract   = require('./explorer.js');
// script explorer
var Explorer = module.exports = function(config){
    _Abstract.apply(this,arguments);
    
    // parse resource
    this._parseResource = function(res){
        return new _Resource(
            res,this.logger
        );
    };
};
util.inherits(Explorer,_Abstract);