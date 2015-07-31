/*
 * NEJ File Content Parser
 * @module   script/parser
 * @author   genify(caijf@corp.netease.com)
 */
var path   = require('path'),
    util   = require('util'),
   _nej    = require('./nej/util.js'),
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
 * @return {Void}
 */
pro.parse = function(config){
    config = _util.merge(
        _nej.getConfig(),config,{
            pathRoot:path.dirname(this._file)+'/'
        }
    );
    // complete dependency list
    var platformName = -1,
        platformFile = _path.absolute(
            './base/platform.js',config.nejRoot
        ),
        depList = [];
    this._dependencies.forEach(function(uri,index,list){
        var ret = _nej.parseURI(uri,config);
        list[index] = ret;
        if (ret.uri===platformFile){
            platformName = index;
        }
        if (ret.deps){
            depList.push(ret.deps);
        }
    });
    // check nej patch content
    var ret = _nej.parsePatch(this._source);
    if (!!ret){
        this.emit('debug',{
            data:[this._file],
            message:'parse nej patch file %s'
        });
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
        this.emit('debug',{
            data:[platformName],
            message:'platform argument name is %s'
        });
        config.platformName = platformName;
        var patch = this._mergePatch(ret,config);
        this._source = patch.source;
        var list = patch.dependency||[];
        this.emit('debug',{
            data:[list],
            message:'patch merge result %j'
        });
        depList.push(list);
    }
    // check injector source
    if (!!this._source){
        // format source
        //_dep.injectable(!0);
        var ret = _nej.deps2injector(
            this._dependencies
        );
        ret.unshift(
            _path.uri2key(this._file),
            this._source
        );
        this._source = util.format(
            '%s(%s);',config.nejInjector,ret.join(',')
        );
    }
    // cache dependency list
    depList.unshift(
        _nej.NEJ_DEFINE_FILE,
        _dep.get(this._file),
        this._dependencies
    );
    depList.push(this._checkURIResult);
    // will be loaded later
    var list = _util.concat.apply(
        _util,depList
    );
    _dep.set(this._file,list);
    this.emit('debug',{
        data:[this._file,list],
        message:'cache nej dependency %s -> %j'
    });
    // load dependency list
    if (list.length>0){
        var script = new (require('../explorer/script.js'))(
            _util.merge(this.getLogger(),{
                file:this._file
            })
        );
        list.forEach(function(it){
            if (typeof it==='string'){
                script.push(it);
                return;
            }
            script.push(it.uri);
            if (!!it.patch){
                script.push(it.patch);
            }
            if (!!it.deps){
                script.push(it.deps);
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
 *
 * @param item
 * @returns {*}
 * @private
 */
pro._checkURIResult = function(item){
    if (typeof item==='string'){
        return item;
    }
    return item.uri;
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
            this.emit('debug',{
                data:[item.expression,config.nejPlatform],
                message:'patch expression %s fit to platform %s'
            });
            patcher.parse(config);
            code.push(patcher.stringify());
            deps.push.apply(deps,patcher.getDependencies());
        }else{
            this.emit('debug',{
                data:[item.expression,config.nejPlatform],
                message:'patch expression %s not fit to platform %s'
            });
        }
    },this);
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
 * @param  {Object} config - config object
 * @param  {String} config.file    - file path
 * @param  {String} config.content - file content
 * @return {Parser} nej file parser instance if file is nej
 */
exports.try = function(config){
    config = config||{};
    var ret = _nej.parseFileContent(
        config.content
    );
    if (!!ret){
        return new Parser(
            _util.merge(config,ret)
        );
    }
};
// export parser
exports.Parser = Parser;