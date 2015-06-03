/*
 * Abstract Explorer Class
 * Explorer is used to manage resource list
 * @module   explorer/explorer
 * @author   genify(caijf@corp.netease.com)
 */
// abstract explorer
// input config
// - file       file path that resource relative to
// - list       resource file list, eg. ['base/util',{text:'var a=111;'}]
var Explorer = module.exports =
    require('../util/klass.js').create();
var pro = Explorer.extend(require('../util/event.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    // init config
    config = config||{};
    this._list = [];
    this._file = config.file;
    if (!!config.list){
        config.list.forEach(
            this.push,this
        );
    }
};
/**
 * push resource uri
 * ['/path/to/a.css',{text:'.a{color:#aaa;}'},...]
 * @param  {Object} item - item config object
 * @return {Void}
 */
pro.push = function(item){
    if (typeof item==='string'){
        item = { uri:item };
    }
    item.file = this._file;
    this._list.push(item);
};
/**
 * parse resource list
 * @param  {Object} config - config object
 * @return {Void}
 */
pro.parse = function(config){
    var Resource = require('../meta/resource.js');
    this._list.forEach(function(item,index,list){
        if (item instanceof Resource){
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
// resType          resource type for html, default is "js", eg. cs/js
// ignoreEntry      ignore page entry script
// noRecursion      not dump dependency recursion
// ['/path/to/a.js','/path/to/inline-xxxx']
pro.getDependencies = function(config){
    var ret = [];
    this._list.forEach(function(inst){
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
/**
 * parse resource item, overwrited by subclass
 * @protected
 * @param  {Object} res - resource config
 * @return {Void}
 */
pro._parseResource = function(res){
    // OVERWRITE SubClass implementation
};