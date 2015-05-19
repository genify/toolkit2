var util       = require('util'),
   _util       = require('../util/util.js'),
   _ResStyle   = require('../meta/style.js'),
   _Abstract   = require('./explorer.js');
// style exporter
var Explorer = module.exports = function(config){
    _Abstract.apply(this,arguments);
    
    
};
util.inherits(Explorer,_Abstract);