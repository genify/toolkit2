var util       = require('util'),
   _util       = require('../util/util.js'),
   _Abstract   = require('../event.js');
// script explorer
// file         file path that resource relative to
// list         resource file list, eg. ['base/util',{text:'var a=111;'}]
var Explorer = module.exports = function(config){
    _Abstract.apply(this,arguments);
    
    // private variable
    var _gResList = [];
    // parse resource item
    this._parseResource = function(res){
        // TODO SubClass implementation
    };
    // push resource uri
    // ['/path/to/a.css',{text:'.a{color:#aaa;}'},...]
    this.push = function(item){
        if (typeof item==='string'){
            item = { uri:item };
        }
        item.file = this.file;
        _gResList.push(item);
    };
    // parse resource list
    this.parse = function(config){
        _gResList.forEach(function(item,index,list){
            var ret = this._parseResource(item);
            if (!!ret){
                list[index] = ret;
                ret.parse(config);
            }
        },this);
    };
    // dump complete dependency list
    this.getDependencies = function(){
        var ret = [];
        _gResList.forEach(function(inst){
            var list = inst.getDependencies();
            if (!list||!list.length){
                return;
            }
            list.forEach(function(uri){
                if (ret.indexOf(uri)<0){
                    ret.push(uri);
                }
            });
        });
        return ret;
    };
    // init config
    config = config||{};
    if (!!config.file){
        this.file = file;
    }
    if (!!config.list){
        config.list.forEach(
            this.push,this
        );
    }
};
util.inherits(Explorer,_Abstract);