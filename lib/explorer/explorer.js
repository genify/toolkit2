/*
 * Abstract Explorer Class
 * Explorer is used to manage resource list
 * @module   explorer/explorer
 * @author   genify(caijf@corp.netease.com)
 */
var util       = require('util'),
   _Abstract   = require('../event.js'),
   _Resource   = require('../meta/resource.js');
// abstract explorer
// file         file path that resource relative to
// list         resource file list, eg. ['base/util',{text:'var a=111;'}]
var Explorer = module.exports = function(config){
    _Abstract.apply(this,arguments);
    
    // private variable
    var _gResList = [];
    // parse resource item
    this._parseResource = function(res){
        // OVERWRITE SubClass implementation
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
            if (item instanceof _Resource){
                return;
            }
            var ret = this._parseResource(item);
            if (!!ret){
                list[index] = ret;
                ret.parse(config);
            }
        },this);
    };
    // dump complete dependency list
    // ignoreEntry      ignore page entry script
    // ['/path/to/a.js','/path/to/inline-xxxx']
    this.getDependencies = function(config){
        var ret = [];
        _gResList.forEach(function(inst){
            var list = inst.getDependencies(config);
            if (!list||!list.length){
                return;
            }
            list.forEach(function(item){
                if (ret.indexOf(item)<0){
                    ret.push(item);
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