/*
 * NEJ File Content Parser
 * @module   script/parser
 * @author   genify(caijf@corp.netease.com)
 */
var path   = require('path'),
    util   = require('util'),
   _nej    = require('./nej/util.js'),
   _fs     = require('../util/file.js'),
   _dep    = require('../util/dependency.js'),
   _util   = require('../util/util.js'),
   _path   = require('../util/path.js');
// nej file parser
// file           file path
// source         source code
// dependency     dependency list
var Parser = require('../util/klass.js').create();
var pro = Parser.extend(require('./parser.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    // init config
    config = config||{};
    this._file = config.file;
    this._source = config.source||'';
    this._dependencies = config.dependency||[];
};
/**
 * parse script file cotent
 * @param  {Object} config - parse config
 * @param  {String} config.webRoot  - web root path
 * @param  {String} config.libRoot  - nej lib root path
 * @param  {String} config.params   - other parameters config
 * @param  {String} config.nejPlatform - output platform config
 * @param  {String} config.nejInjector - nej injector function name
 * @return {Void}
 */
pro.parse = function(config){
    config = _util.merge(
        config,{
            pathRoot:path.dirname(this._file)+'/'
        }
    );
    // complete dependency list
    var platformName = -1,
        platformFile = _path.absolute(
            './base/platform.js',config.libRoot
        );
    this._dependencies.forEach(function(uri,index,list){
        var ret = _nej.parseURI(uri,config);
        list[index] = ret;
        if (ret.uri===platformFile){
            platformName = index;
        }
    });
    // check nej patch content
    var list, ret = _nej.parsePatch(this._source);
    if (!!ret){
        // dump platform name for patch
        if (platformName<0){
            this._dependencies.unshift({
                uri:platformFile
            });
            platformName = 'b'+(+new Date);
            ret.args.unshift(platformName);
        }else{
            platformName = ret.args[platformName];
        }
        config.platformName = platformName;
        var patch = this._mergePatch(ret,config);
        this._source = patch.source;
        list = patch.dependency||[];
    }
    // format source
    var ret = _nej.deps2injector(
        this._dependencies
    );
    ret.unshift(
        _fs.key(this._file),
        this._source
    );
    this._source = util.format(
        '%s(%s)',config.nejInjector,ret.join(',')
    );
    // cache dependency list
    var list = _util.concat(
        this._dependencies,
        list||[],function(it){
            return it.uri;
        }
    );
    _dep.set(this._file,list);
    // load dependency list
    if (list.length>0){
        var Explorer = require('../explorer/script.js'),
            opt = _util.merge(this.getLogger(),{
                file:this._file
            });
            script = new Explorer(opt);
        list.forEach(function(it){
            script.push(it.uri);
            if (!!it.patch){
                script.push(it.patch);
            }
        });
        script.parse(config);
    }
};
/**
 * stringify script file content
 * @param  {Object} config - parse config
 * @return {String} file content
 */
pro.stringify = function(config){
    return this._source;
};
/**
 * merge patch
 * @param  {Object} patch  - patch parse result
 * @param  {Object} config - config object
 * @return {Object} patch result, eg. {source:'',dependency:[]}
 */
pro._mergePatch = function(patch,config){
    var deps = [],
        code = [];
    var logger = this.getLogger(),
        Patcher = require('./nej/patcher.js');
    patch.patches.forEach(function(item){
        var opt = _util.merge(logger,item),
            patcher = new Patcher(opt);
        if (patcher.isFit(config.nejPlatform)){
            patcher.parse(config);
            code.push(patcher.stringify());
            deps.push.apply(deps,patcher.getDependencies());
        }
    });
    return {
        dependency:deps,
        source:util.format(
            'function(%s){%s%s}',
            patch.args.join(','),
            code.join('\n'),
            patch.riturn
        )
    };
};
/**
 * try parse file content as nej file
 * @param  {String} file    - file path
 * @param  {String} content - file content
 * @return {Parser} nej file parser instance if file is nej
 */
exports.try = function(file,content,logger){
    var ret = _nej.parseFileContent(content);
    if (!!ret){
        ret.file = file;
        return new Parser(
            _util.merge(ret,logger)
        );
    }
};