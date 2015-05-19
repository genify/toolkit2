var util       = require('util'),
   _util       = require('../util/util.js'),
   _ResScript  = require('../meta/script.js'),
   _Abstract   = require('./explorer.js');
// script exporter
// webRoot      web root
// aliasReg     regexp of alias in path
// aliasDict    dictionary of alias in path
var Explorer = module.exports = function(config){
    _Abstract.apply(this,arguments);
    
    var _gScriptList;
    // update script list
    this.update = function(config){
        _gScriptList = [];
        var list = config.list||[];
        list.forEach(function(file){
            var conf = {
                file:config.file
            };
            if (typeof file==='string'){
                conf.url = file;
            }else{
                conf = _util.merge(conf,file);
            }
            var script = new _ResScript(conf);
            _gScriptList.push(script);
            script.parse(config);
        });
    };
    
    if (!!config){
        this.update(config);
    }
};
util.inherits(Explorer,_Abstract);