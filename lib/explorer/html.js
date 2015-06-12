/*
 * Html Explorer, used to manage html list
 * @module   explorer/html
 * @author   genify(caijf@corp.netease.com)
 */
var _io   = require('../util/io.js'),
    _dep  = require('../util/dependency.js'),
    _util = require('../util/util.js');
// style explorer
var Html = module.exports =
    require('../util/klass.js').create();
var pro = Html.extend(require('./explorer.js'));
/**
 * parse resource item
 * @protected
 * @param  {Object} res - resource config
 * @return {Void}
 */
pro._parseResource = function(res){
    return new (require('../meta/html.js'))(res);
};
/**
 *  dump core resource list
 *  @param  {Object}  config - config object
 *  @param  {Number}  config.resFreq - core resource count
 *  @param  {String}  config.resType - core resource type, style or script
 *  @param  {Boolean} config.ignoreEntry - ignore entry for script
 *  @return {Array}   core list
 */
pro.getCoreList = function(config){
    var list  = [],
        test  = {},
        count = config.resFreq;
    this._list.forEach(function(parser){
        var ret = parser.getDependencies({
            checkCoreConfig:!0,
            resType:config.resType,
            ignoreEntry:config.ignoreEntry
        });
        ret.forEach(function(uri){
            if (!test[uri]){
                test[uri] = !0;
            }
            test[uri]++;
            if (test[uri]===count){
                list.push(uri);
            }
        });
    });
    return list;
};
/**
 * resort html sort
 * @return {Void}
 */
pro.sort = function(){
    var ret = [],
        map = {};
    // calculate dependency list
    this._list.forEach(function(parser){
        var uri = parser.getURI(),
            list = parser.getTemplateDependencies();
        _dep.set(uri,list);
        map[uri] = parser;
        ret.push(uri);
    });
    // resort html sort
    ret = _dep.complete(ret);
    ret.forEach(function(uri,index,list){
        list[index] = map[uri];
    });
    this._list = ret;
};
/**
 * merge resource
 * @param  {Object} config - config object
 * @param  {Array}  config.coreStyle  - core style list
 * @param  {Array}  config.coreScript - core script list
 * @return {Void}
 */
pro.merge = function(config){
    // cache core list
    _io.cache(
        'core.css',
        _io.fill(config.coreStyle)
    );
    _io.cache(
        'core.js',
        _io.fill(config.coreScript)
    );
    // merge resource
    this._scripts = {
        'core.js':['core.js']
    };
    this._list.forEach(function(parser){
        parser.begMerge(config);
        parser.mergeStyle({
            core:config.coreStyle
        });
        var ret = parser.mergeScript({
            core:config.coreScript
        });
        ret.forEach(function(name){
            map[name] = [name];
        });
    },this);
};
/**
 * minify script
 * @param  {Object} config - config object
 * @param  {String} cnofig.bags        - name bags file path
 * @param  {String} cnofig.level       - obfuscate level
 * @param  {String} cnofig.sourcemap   - output source map
 * @param  {String} cnofig.compatible  - use nej compatible mode
 * @param  {String} cnofig.dropconsole - drop console code
 * @param  {String} config.outputRoot  - output root
 * @return {Void}
 */
pro.minify = function(config){
    config = config||{};
    // parse name bags
    var bagfile = config.bags;
    try{
        config.bags = require(config.bags);
    }catch(ex){
        config.bags = {};
    }
    // obfuscate script
    var Parser = require('../adapter/script.js'),
        parser = new Parser({
            code:_io.dump(),
            map:this._scripts
        });
    // check source map config
    if (config.sourcemap){
        config.sourcemap = {
            root:config.outputRoot+'s/'
        };
    }else{
        delete config.sourcemap;
    }
    // do compress and obfuscate script
    parser.parse(config);
    var ret = parser.dump();
    // cache script content
    Object.keys(ret.code).forEach(function(name){
        _io.cache(name,ret.code[name]);
    });
    // output name bags
    this.emit('info',{
        data:[bagfile],
        message:'output script name bags to %s'
    });
    _fs.writeAsync(bagfile,JSON.stringify(ret.bags||{}));
    // output source map
    if (!!ret.sourcemap){
        var root = config.sourcemap.root;
        Object.keys(ret.sourcemap).forEach(function(name){
            var content = ret.sourcemap[name]||'';
            if (!!content){
                this.emit('info',{
                    data:[root,name],
                    message:'output sourcemap %s%s'
                });
                _fs.writeAsync(root+name,content);
            }
        });
    }
};
/**
 * embed resource
 * @param  {Object} config - config object
 * @param  {String} config.resWrap   - inline resource wrapper
 * @param  {String} config.inCSWrap  - inline style template wrap
 * @param  {String} config.exCSWrap  - external style template wrap
 * @param  {String} config.inJSWrap  - inline script template wrap
 * @param  {String} config.exJSWrap  - external script template wrap
 * @param  {String} config.inTPWrap  - inline template wrap
 * @param  {Number} config.maxCSSize - max style inline size
 * @param  {Number} config.maxJSSize - max script inline size
 * @return {Void}
 */
pro.embed = function(config){
    // embed resource
    this._list.forEach(function(parser){
        parser.embedStyle({
            maxSize:config.maxCSSize,
            inlineWrap:config.inCSWrap,
            externalWrap:config.exCSWrap
        });
        parser.embedScript({
            resWrap:config.resWrap,
            maxSize:config.maxJSSize,
            inlineWrap:config.inJSWrap,
            externalWrap:config.exJSWrap
        });
        parser.embedTemplate({
            resWrap:config.resWrap,
            inlineWrap:config.inTPWrap
        });
    });
};


pro.output = function(){

};