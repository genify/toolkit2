var util     = require('util'),
    path     = require('path'),
   _fs       = require('../util/file.js'),
   _path     = require('../util/path.js'),
   _Abstract = require('../event.js');
// style parser
var Parser = module.exports = function(config){
    _Abstract.apply(this,arguments);
    
    
    
    
};
util.inherits(Parser,_Abstract);