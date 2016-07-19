/*
 * Html Explorer, used to manage html list
 * @module   explorer/html
 * @author   genify(caijf@corp.netease.com)
 */
var path = require('path'),
    util = require('util'),
   _io   = require('../util/io.js'),
   _fs   = require('../util/file.js'),
   _dep  = require('../util/dependency.js'),
   _path = require('../util/path.js'),
   _util = require('../util/util.js');
// html explorer
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
 * dump nej module version map
 * @private
 * @param  {String} root - module root
 * @param  {Array}  list - output file list
 * @return {Object} version map
 */
pro._dumpModuleVersion = (function(){
    var verMap = {};
    return function(root,list,exclude){
        var map = {};
        list.forEach(function(file){
            if (file.indexOf(root)>=0&&
               (!exclude||file.indexOf(exclude)<0)){
                var ver = verMap[file];
                if (!ver){
                    ver = _util.md5(_io.getFromCache(file));
                    verMap[file] = ver;
                }
                map[file.replace(root,'')] = ver;
            }
        });
        return map;
    };
})();
/**
 * check resource in html file
 * @private
 * @param  {Object} options - resource check options
 * @param  {Boolean}options.lnkCheck    - check resource in script
 * @param  {String} options.webRoot     - webapp root
 * @param  {String} options.resRoot     - resource root
 * @param  {Boolean}options.versionStac - add version to resource
 * @param  {Array}  options.rsDomain    - resource domain
 * @return {Void}
 */
pro._checkResInHtmlFile = function(options){
    // check resource domain
    var domains = options.rsDomain;
    if (!options.lnkCheck||
        !domains||!domains.length){
        return;
    }
    // check all html file
    var handler = function(event){
        if (event.type=='script'){
            event.value = this._checkResInScript(
                event.file,
                event.content,
                options
            );
        }
    };
    // san all files
    this._list.forEach(
        function(parser){
            parser.scan(handler,this);
        },this
    );
};
/**
 * check resource in script
 * @param  {String} file    - script file path
 * @param  {String} content - script content
 * @param  {Object} options - resource check options
 * @param  {Boolean}options.lnkCheck    - check resource in script
 * @param  {String} options.webRoot     - webapp root
 * @param  {String} options.resRoot     - resource root
 * @param  {Boolean}options.versionStac - add version to resource
 * @param  {Array}  options.rsDomain    - resource domain * @private
 * @return {String} script content after resource merge
 */
pro._checkResInScript = (function(){
    var reg = /(['"])(\/.+?)(?=\1|\\)/g;
    return function(file,content,options){
        // check resource domain
        var domains = options.rsDomain;
        if (!options.lnkCheck||
            !domains||!domains.length){
            return content;
        }
        // check content
        var _this = this;
        reg.lastIndex = -1;
        return (content||'').replace(
            reg,function($1,$2,$3){
                // check resource uri
                var arr = $3.split('?'),
                    uri = arr[0].replace('/',options.webRoot);
                // for static resource
                if (!_fs.isdir(uri)&&
                    uri.indexOf(options.resRoot)===0){
                    // check resource exist
                    if (_fs.exist(uri)){
                        var domain = _util.randNext(domains);
                        arr[0] = uri.replace(options.webRoot,domain);
                        _this.emit('debug',{
                            data:[uri,file,arr[0]],
                            message:'find resource %s in script %s and adjust to %s'
                        });
                        if (!arr[1]&&options.versionStac){
                            arr[1] = _util.md5(_fs.raw(uri));
                        }
                        return util.format('%s%s',$2,arr.join('?'));
                    }
                    // warning error resource
                    _this.emit('warn',{
                        data:[uri,file],
                        message:'not find resource %s in script %s'
                    });
                }
                return $1;
            }
        );
    };
})();
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
        this.emit('debug',{
            data:[config.resType,parser.getURI(),ret],
            message:'%s used in file %s is %j'
        });
        ret.forEach(function(uri){
            if (!test[uri]){
                test[uri] = 0;
            }
            test[uri]++;
            if (test[uri]===count){
                list.push(uri);
            }
        });
    },this);
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
    this.emit('debug',{
        data:[ret],
        message:'page list order by module dependency is %j'
    });
    // merge parser
    for(var i=ret.length- 1,uri,parser;i>=0;i--){
        uri = ret[i];
        parser = map[uri];
        if (!!parser){
            ret[i] = parser;
        }else{
            ret.splice(i,1);
            this.emit('warn',{
                data:[uri],
                message:'module %s not exist'
            });
        }
    }
    // overwrite parser list
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
    var map = {
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
    this._scripts = map;
};
/**
 * minify script
 * @param  {Object} config - config object
 * @param  {String} cnofig.bags        - name bags file path
 * @param  {String} cnofig.level       - obfuscate level
 * @param  {String} cnofig.sourcemap   - output source map
 * @param  {Object} cnofig.variables   - global variables
 * @param  {String} cnofig.compatible  - use nej compatible mode
 * @param  {String} cnofig.dropconsole - drop console code
 * @param  {String} config.outputRoot  - output root
 * @param  {String} config.codeWrap    - script code wrapper
 * @param  {Object} options - resource check options
 * @param  {String} options.webRoot     - webapp root
 * @param  {String} options.resRoot     - resource root
 * @param  {Boolean}options.versionStac - add version to resource
 * @param  {Array}  options.rsDomain    - resource domain
 * @return {Void}
 */
pro.minify = function(config,options){
    // check resource in html file
    this._checkResInHtmlFile(options);
    // format config
    config = config||{};
    // parse name bags
    var bagfile = config.bags;
    config.bags = _util.file2json(bagfile);
    // fill content
    var wrap = config.codeWrap||'%s',
        smap = this._scripts,
        rmap = {};
    Object.keys(smap).forEach(function(file){
        var content = util.format(wrap,_io.fill(smap[file]));
        rmap[file] = this._checkResInScript(
            file,content,options
        );
    },this);
    // obfuscate script
    var parser = new (require('../adapter/script.js'))(
        _util.merge(
            this.getLogger(),{
                map:rmap
            }
        )
    );
    // check source map config
    if (config.sourcemap){
        config.sourcemap = {
            root:config.outputRoot+'s/',
            uri:_path.wrapURI('sm','%s')
        };
    }else{
        delete config.sourcemap;
    }
    // do compress and obfuscate script
    parser.parse(config);
    var ret = parser.dump();
    // cache script content
    Object.keys(ret.code).forEach(function(name){
        _io.cache(name,ret.code[name]||'');
    });
    // output name bags
    this.emit('debug',{
        data:[bagfile],
        message:'output script name bags to %s'
    });
    _io.output(bagfile,JSON.stringify(ret.bags||{},null,4));
    // output source map
    if (!!ret.sourcemap){
        var root = config.sourcemap.root;
        Object.keys(ret.sourcemap).forEach(function(name){
            var content = ret.sourcemap[name]||'';
            if (!!content){
                this.emit('debug',{
                    data:[root,name],
                    message:'output sourcemap %s%s'
                });
                _io.output(root+name,content);
            }
        },this);
    }
};
/**
 * embed resource
 * @param  {Object} config - config object
 * @param  {String} config.resWrap      - inline resource wrapper
 * @param  {String} config.inCSWrap     - inline style template wrap
 * @param  {String} config.exCSWrap     - external style template wrap
 * @param  {String} config.inJSWrap     - inline script template wrap
 * @param  {String} config.exJSWrap     - external script template wrap
 * @param  {String} config.inTPWrap     - inline template wrap
 * @param  {String} config.inStyleWrap  - inline style wrap
 * @param  {String} config.exStyleWrap  - external style wrap
 * @param  {String} config.inScriptWrap - inline script wrap
 * @param  {String} config.exScriptWrap - external script wrap
 * @param  {Number} config.maxCSSize    - max style inline size
 * @param  {Number} config.maxJSSize    - max script inline size
 * @return {Void}
 */
pro.embed = function(config){
    // embed resource
    this._list.forEach(function(parser){
        parser.embedStyle({
            maxSize:config.maxCSSize,
            inlineWrap:config.inCSWrap,
            externalWrap:config.exCSWrap,
            inlineStyle:config.inStyleWrap,
            externalStyle:config.exStyleWrap
        });
        parser.embedScript({
            resWrap:config.resWrap,
            maxSize:config.maxJSSize,
            inlineWrap:config.inJSWrap,
            externalWrap:config.exJSWrap,
            inlineScript:config.inScriptWrap,
            externalScript:config.exScriptWrap
        });
        // parser.embedResource({
        //     resWrap:config.resWrap,
        //     maxSize:config.maxJSSize,
        //     inlineScript:config.inScriptWrap,
        //     externalScript:config.exScriptWrap
        // });
        parser.embedTemplate({
            resWrap:config.resWrap,
            inlineWrap:config.inTPWrap
        });
    });
};
/**
 * output manifest
 * @private
 * @return {Void}
 */
pro._outputManifest = function(list,config){
    // static version map
    var res = _io.dumpResource();
    if (res.manifested!==!0){
        return;
    }
    // html version map
    delete res.manifested;
    var exf = config.outHtmlRoot!==config.outTmplRoot
            ? config.outTmplRoot : '';
    var mdls = this._dumpModuleVersion(
        config.outHtmlRoot,list,exf
    );
    // check list
    var arr = [],
        ver = [],
        map = _util.merge(res,mdls),
        ret = Object.keys(map).sort(),
        filter = config.manFilter;
    ret.forEach(function(uri,index,list){
        var ruri = _path.normalize('/'+uri);
        if (!filter||!filter.test(ruri)){
            arr.push(ruri);
            ver.push(map[uri]);
        }
    });
    this.emit('debug',{
        data:[ver],
        message:'version for manifest %j'
    });
    this.emit('debug',{
        data:[arr],
        message:'resource list for manifest %j'
    });
    // merge manifest template
    var dict = {
        VERSION:_util.md5(ver.join(',')),
        CACHE_LIST:arr.join('\n')
    };
    var content = config.manTemplate.replace(
        /#<(.+?)>/g,function($1,$2){
            return dict[$2]||$1;
        }
    );
    // output manifest
    var file = config.manOutput;
    this.emit('debug',{
        data:[file],
        message:'output manifest %s'
    });
    _fs.mkdir(path.dirname(file));
    _io.output(file,content,config.charset);
};
/**
 * output content
 * @param  {Object} config - config object
 * @return {Void}
 */
pro.output = function(config){
    // dump file content
    var ret = [];
    this._list.forEach(function(parser){
        ret.push(parser.output(config))
    });
    // update nej module version
    var exf = config.outHtmlRoot!==config.outTmplRoot
            ? config.outTmplRoot : '';
    ret.forEach(function(file){
        var content = _path.unwrapVersion(
            _io.getFromCache(file),function(mpath){
                var map = this._dumpModuleVersion(
                    mpath.replace(
                        config.srcRoot,
                        config.outHtmlRoot
                    ),ret,exf
                );
                return JSON.stringify(map);
            }.bind(this)
        );
        // output file
        this.emit('debug',{
            data:[file],
            message:'output file %s'
        });
        _io.cache(file,content);
        _fs.mkdir(path.dirname(file));
        _io.output(file,content,config.charset);
    },this);
    // output manifest
    this._outputManifest(ret,config);
};