var util       = require('util'),
   _util       = require('../util/util.js'),
   _ResScript  = require('../meta/script.js'),
   _Abstract   = require('../event.js');
// script exporter
// file         file path relative to
// list         script file list, eg. ['base/util',{text:'var a=111;'}]
var Explorer = module.exports = function(config){
    _Abstract.apply(this,arguments);
    
    
    
    
};
util.inherits(Explorer,_Abstract);