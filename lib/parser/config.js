/*
 * Config Content Parser
 * @module   parser/config
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
    path = require('path'),
   _fs   = require('../util/file.js'),
   _path = require('../util/path.js'),
   _util = require('../util/util.js');
// config plugins
var CONFIG_PLUGINS = {
    text:function(event){
        return event.content;
    },
    json:function(event){
        return event.content;
    },
    regular:function(event){
        var rgl = require(
            this.get('NEJ_REGULAR')
        );
        return JSON.stringify(
            rgl.parse(event.content)
        );
    },
    rgl:'regular'
};
// config filters
var CONFIG_FILTERS = [
{
    DIR_WEBROOT:function(v){
        // relative to DIR_CONFIG
        var dir = _path.absolute(
            (v||'.')+'/',this.get('DIR_CONFIG')
        );
        if (!_fs.exist(dir)){
            this.emit('error',{
                data:[dir],
                message:'DIR_WEBROOT[%s] not exist'
            });
        }
        return dir;
    }
},{
    DIR_SOURCE:function(v){
        // relative to DIR_WEBROOT
        return this._formatWithWebRoot(v);
    }
},{
    DIR_SOURCE_SUB:function(v){
        if (!v) return;
        // relative to DIR_SOURCE
        return this._formatSubDir(v,
            this.get('DIR_SOURCE')||
            this.get('DIR_WEBROOT')
        );
    }
},{
    DIR_OUTPUT:function(v){
        // relative to DIR_WEBROOT
        var root = this.get('DIR_WEBROOT'),
            dir = _path.absolute((v||'.')+'/',root);
        if (dir.indexOf(root)!=0){
            this.emit('warn',{
                data:[dir],
                message:'DIR_OUTPUT[%s] not in DIR_WEBROOT'
            });
        }
        _fs.mkdir(dir);
        return dir;
    }
},{
    DIR_SOURCE_TP:function(v){
        // relative to DIR_WEBROOT
        return this._formatWithWebRoot(v);
    }
},{
    DIR_SOURCE_TP_SUB:function(v){
        if (!v) return;
        // relative to DIR_SOURCE_TP
        return this._formatSubDir(v,
            this.get('DIR_SOURCE_TP')||
            this.get('DIR_WEBROOT')
        );
    }
},{
    DIR_OUTPUT_TP:function(v){
        var output = !!v
            ? this._formatWithWebRoot(v)
            : this.get('DIR_OUTPUT');
        _fs.mkdir(output);
        return output;
    }
},{
    DIR_OUTPUT_STATIC:function(v){
        var root = this.get('DIR_WEBROOT'),
            output = !!v
                ? this._formatWithWebRoot(v)
                : this.get('DIR_OUTPUT')||root;
        if (output.indexOf(root)!=0){
            this.emit('warn',{
                data:[output],
                message:'DIR_OUTPUT_STATIC[%s] is not sub directory of DIR_WEBROOT'
            });
        }
        _fs.mkdir(output);
        return output;
    }
},{
    DIR_STATIC:function(v){
        var dir = this._formatWithWebRoot(v||'./res');
        if (!_fs.exist(dir)){
            this.emit('warn',{
                data:[dir],
                message:'DIR_STATIC[%s] not exist'
            });
        }
        return dir;
    }
},{
    // @deprecated see ALIAS_MATCH
    ALIAS_START_TAG:function(v){
        return v||'${';
    },
    // @deprecated see ALIAS_MATCH
    ALIAS_END_TAG:function(v){
        return v||'}';
    }
},{
    ALIAS_MATCH:function(v){
        if (util.isRegExp(v)){
            return v;
        }
        if (!!v&&typeof v==='string'){
            return new RegExp(v,'ig');
        }
        // use start tag and end tag
        var reg = /([\$\(\)\[\]\*\+\|])/g,
            beg = this.get('ALIAS_START_TAG').replace(reg,'\\$1'),
            end = this.get('ALIAS_END_TAG').replace(reg,'\\$1');
        this.remove('ALIAS_END_TAG','ALIAS_START_TAG');
        return new RegExp(util.format('%s(.*?)%s',beg,end),'ig');
    }
},{
    ALIAS_DICTIONARY:function(v){
        // dict is json string
        if (typeof v==='string'){
            return JSON.parse(v||'{}');
        }
        // dict is object
        return v||{};
    }
},{
    DM_STATIC:function(v){
        return this._formatDomainList(v);
    }
},{
    DM_STATIC_RS:function(v){
        return this._formatDomainList(v,'DM_STATIC');
    }
},{
    DM_STATIC_CS:function(v){
        return this._formatDomainList(v,'DM_STATIC');
    }
},{
    DM_STATIC_JS:function(v){
        return this._formatDomainList(v,'DM_STATIC');
    }
},{
    DM_STATIC_MF:function(v){
        return this._formatDomainList(v,'DM_STATIC');
    }
},{
    DM_STATIC_MR:function(v){
        v = v||'';
        if (!!v&&!/\/$/.test(v)){
            return v+'/';
        }
        return v||null;
    }
},{
    // @deprecated see FILE_FILTER
    FILE_SUFFIXE:function(v){
        if (!!v){
            this.set(
                'FILE_FILTER',
                new RegExp('\\.(?:'+v+')$','i')
            );
        }
    }
},{
    FILE_FILTER:function(v){
        if (!v){
            return this.get('FILE_FILTER')||null;
        }
        if (typeof v==='string'){
            return new RegExp(v,'i');
        }
        return v;
    }
},{
    FILE_CHARSET:function(v){
        return (v||'utf-8').toLowerCase();
    }
},{
    MANIFEST_OUTPUT:function(v){
        return this._formatWithWebRoot(v);
    }
},{
    // @deprecated see VERSION_MODE
    NAME_SUFFIX:function(v){
        if (!!v){
            if (v.search(/[._-]/)!=0){
                v = '_'+v;
            }
            this.set('VERSION_MODE','[FILENAME]'+v);
        }
    },
    // @deprecated see VERSION_MODE
    RAND_VERSION:function(v){
        if (!!v&&this._formatBoolean(v)){
            this.set('VERSION_MODE',1);
        }
    }
},{
    VERSION_MODE:function(v){
        if (v==null||v==''){
            return this.get('VERSION_MODE')||0;
        }
        return this._formatNumber(v,0,1,v);
    }
},{
    // @deprecated see VERSION_STATIC
    STATIC_VERSION:function(v){
        this.set('VERSION_STATIC',this._formatBoolean(v));
    }
},{
    VERSION_STATIC:function(v){
        if (v==null||v==''){
            return !!this.get('VERSION_STATIC');
        }
        return this._formatBoolean(v);
    }
},{
    // @deprecated see X_NOCORE_FLAG
    X_NOCORE_STYLE:function(v){
        v = this._formatBoolean(v)?1:0;
        var x = this.get('X_NOCORE_FLAG')||0;
        this.set('X_NOCORE_FLAG',v+x);
    },
    // @deprecated see X_NOCORE_FLAG
    X_NOCORE_SCRIPT:function(v){
        v = this._formatBoolean(v)?2:0;
        var x = this.get('X_NOCORE_FLAG')||0;
        this.set('X_NOCORE_FLAG',v+x);
    }
},{
    X_NOCORE_FLAG:function(v){
        if (v==null||v==''){
            return this.get('X_NOCORE_FLAG')||0;
        }
        return this._formatNumber(v,0,3,0);
    }
},{
    // @deprecated see X_INSERT_WRAPPER
    X_MODULE_WRAPPER:function(v){
        this.set(
            'X_INSERT_WRAPPER',
            v||this.get('X_INSERT_WRAPPER')||'%s'
        );
    },
    // @deprecated see X_INSERT_WRAPPER
    X_SCRIPT_WRAPPER:function(v){
        this.set(
            'X_INSERT_WRAPPER',
            v||this.get('X_INSERT_WRAPPER')||'%s'
        );
    }
},{
    X_INSERT_WRAPPER:function(v){
        return v||this.get('X_INSERT_WRAPPER')||'%s';
    }
},{
    NEJ_DIR:function(v){
        if (!v){
            var root = this.get('DIR_WEBROOT');
            // check nej in lib
            v = root+'src/javascript/lib/nej/';
            if (_fs.exist(v+'define.js')){
                return v;
            }
            // check nej src directory
            v += 'src/';
            if (_fs.exist(v+'define.js')){
                return v;
            }
            return;
        }
        return this._formatWithWebRoot(v);
    },
    NEJ_REGULAR:function(v){
        if (!v){
            v = './src/javascript/lib/regularjs/dist/regular.js';
        }
        v = _path.absolute(v,this.get('DIR_WEBROOT'));
        return _fs.exist(v) ? v : 'regularjs';
    },
    NEJ_PLATFORM:function(v){
        return v||'';
    },
    NEJ_PROCESSOR:function(v){
        if (!v) return;
        // for file path
        var ret,
            file = _path.absolute(
                v,this.get('DIR_CONFIG')
            );
        try{
            ret = require(file);
        }catch(ex){
            // ignore
        }
        // merge processors
        ret = _util.merge(CONFIG_PLUGINS,ret);
        Object.keys(ret).forEach(
            function(key){
                var func = ret[key];
                if (typeof func==='string'){
                    func = ret[func];
                }
                ret[key] = func.bind(this);
            },this
        );
        return ret;
    },

    OPT_IMAGE_FLAG:function(v){
        return this._formatBoolean(v);
    },
    OPT_IMAGE_QUALITY:function(v){
        return this._formatNumber(v,1,100,100);
    },
    OPT_IMAGE_SPRITE:function(v){
        if (!!v){
            v = _path.absolute(
                v,this.get('DIR_STATIC')
            );
            if (!_fs.exist(v)){
                this.emit('warn',{
                    data:[v],
                    message:'OPT_IMAGE_SPRITE[%s] not exist'
                });
            }
            return v;
        }
    },

    MANIFEST_TEMPLATE:function(v){
        // no manifest
        if (!v&&!this.get('MANIFEST_OUTPUT')){
            return;
        }
        // dump content
        var content;
        if (!!v){
            // relative to DIR_CONFIG
            var mtpl = _path.absolute(
                v,this.get('DIR_CONFIG')
            );
            if (!_fs.exist(mtpl)){
                this.emit('warn',{
                    data:[mtpl],
                    message:'MANIFEST_TEMPLATE[%s] not exist'
                });
            }else{
                var list = _fs.read(mtpl);
                if (!!list&&list.length>0){
                    content = list.join('\n');
                }else{
                    this.emit('warn',{
                        data:[mtpl],
                        message:'MANIFEST_TEMPLATE[%s] is empty'
                    });
                }
            }
        }
        // check content
        if (!content){
            content = [
                'CACHE MANIFEST',
                '#VERSION = #<VERSION>','',
                'CACHE:','#<CACHE_LIST>','',
                'NETWORK:','*','',
                'FALLBACK:',''
            ].join('\n');
        }
        return content;
    },
    MANIFEST_FILTER:function(v){
        if (!v) return;
        if (typeof v==='string'){
            return new RegExp(v,'i');
        }
        return v;
    },

    OBF_LEVEL:function(v){
        return this._formatNumber(v,0,3,3);
    },
    OBF_NAME_BAGS:function(v){
        return _path.absolute(
            v||'./names.json',
            this.get('DIR_CONFIG')
        );
    },
    OBF_COMPATIBLE:function(v){
        if (v==null||v==''){
            return true;
        }
        return this._formatBoolean(v);
    },
    OBF_SOURCE_MAP:function(v){
        v = this._formatBoolean(v);
        if (!!v){
            var dir = this.get('DIR_OUTPUT_STATIC')+'s/';
            this.set('DIR_SOURCE_MAP',dir);
            _fs.mkdir(dir);
        }
        return v;
    },
    OBF_MAX_CS_INLINE_SIZE:function(v){
        v = parseInt(v,10);
        if (isNaN(v)){
            v = 50;
        }
        return v;
    },
    OBF_MAX_JS_INLINE_SIZE:function(v){
        v = parseInt(v,10);
        if (isNaN(v)){
            v = 0;
        }
        return v;
    },
    OBF_DROP_CONSOLE:function(v){
        return this._formatBoolean(v);
    },

    CORE_LIST_JS:function(v){
        return this._formatCoreList(v);
    },
    CORE_LIST_CS:function(v){
        return this._formatCoreList(v);
    },
    CORE_MASK_JS:function(v){
        return this._formatCoreList(v);
    },
    CORE_MASK_CS:function(v){
        return this._formatCoreList(v);
    },
    CORE_FREQUENCY_JS:function(v){
        this._formatNumber(v,2,1000000,2);
    },
    CORE_FREQUENCY_CS:function(v){
        this._formatNumber(v,2,1000000,2);
    },
    CORE_IGNORE_ENTRY:function(v){
        return this._formatBoolean(v);
    },

    X_NOCOMPRESS:function(v){
        return this._formatBoolean(v);
    },
    X_NOPARSE_FLAG:function(v){
        v = parseInt(v);
        if (isNaN(v)||v<0||v>3){
            v = 0;
        }
        return v;
    },
    X_AUTO_EXLINK_PATH:function(v){
        return this._formatBoolean(v);
    },
    X_AUTO_EXLINK_PREFIX:function(v){
        if (util.isRegExp(v)){
            return v;
        }
        if (!!v&&typeof v==='string'){
            return new RegExp('^(?:'+v+')$','i');
        }
    },
    X_RELEASE_MODE:function(v){
        return (v||'online').toLowerCase();
    },
    X_LOGGER_LEVEL:function(v){
        return (v||'all').toUpperCase();
    },
    X_LOGGER_FILE:function(v){
        return v||(
            this.get('DIR_CONFIG')+
            _util.getFormatTime('%s%s%s%s%s%s%s.log')
        );
    },
    X_KEEP_COMMENT:function(v){
        return this._formatBoolean(v);
    }
}];
// config parser
// file     config file path
// config   config json object
var Parser = module.exports =
    require('../util/klass.js').create();
var pro = Parser.extend(require('../util/event.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    // init config
    config = config||{};
    if (!!config.file){
        this.update(config.file);
    }else if(!!config.config){
        this.update(config.config);
    }
};
/**
 * get config value by key
 * @param  {String} key - config key
 * @return {*}     config value
 */
pro.get = function(key){
    return this._cache[this._formatKey(key)];
};
/**
 * set config value with key
 * @param  {String} key   - config key
 * @param  {*}      value - config value
 * @return {Void}
 */
pro.set = function(key,value){
    this._cache[this._formatKey(key)] = value;
};
/**
 * remove config value with key
 * @param  {String} key - config key
 * @return {Void}
 */
pro.remove = function(){
    for(var i=arguments.length-1;i>=0;i--){
        delete this._cache[
            this._formatKey(arguments[i])
        ];
    }
};
/**
 * dump config data
 * @returns {Object} config data
 */
pro.dump = function(){
    return this._cache;
};
/**
 * update config
 * @param  {String|Object} file - config file or json object
 * @return {Void}
 */
pro.update = function(file){
    this._cache = {};
    var conf = this._dumpConfigFromFile(file);
    // format config
    CONFIG_FILTERS.forEach(function(map){
        Object.keys(map).forEach(
            function(k){
                var key = this._formatKey(k),
                    value = conf[key],
                    filter = map[k];
                if (!!filter){
                    value = filter.call(this,value);
                }
                if (value!=null){
                    this.set(key,value);
                }
                delete conf[key];
            },this
        );
    },this);
    // cache config left
    Object.keys(conf).forEach(
        function(k){
            this.set(this._formatKey(k),conf[k]);
        },this
    );
    // check condition
    if (!this.get('DIR_SOURCE')&&
        !this.get('DIR_SOURCE_SUB')&&
        !this.get('DIR_SOURCE_TP')&&
        !this.get('DIR_SOURCE_TP_SUB')){
        this.emit('error',{
            message:'no input for deploy'
        });
    }
    // log debug info
    this.emit('debug',{
        data:[this.dump()],
        message:'config result -> %j'
    });
};
/**
 * dump config from file
 * @private
 * @param   {String|Object} file - config file path or json object
 * @return {Object} config object
 */
pro._dumpConfigFromFile = function(file){
    var ret;
    if (typeof file==='string'){
        // dump config from file
        file = _path.absolute(file,process.cwd()+'/');
        if (!_fs.exist(file)){
            this.emit('error',{
                data:[file],
                message:'config file [%s] not exist'
            });
        }
        this.set('DIR_CONFIG',path.dirname(file)+'/');
        this.emit('info',{
            data:[file],
            message:'parse config file %s'
        });
        try{
            // parse config from json file
            ret = require(file);
        }catch(ex){
            // ignore
        }
        if (!ret){
            // parse config from property file
            ret = {};
            var list = _fs.read(file);
            if (!!list&&list.length>0){
                var sep = /=/,
                    cmt = /^\s*#/;
                list.forEach(function(line){
                    // comment line
                    if (cmt.test(line)){
                        return;
                    }
                    // config line
                    var arr = line.split(sep),
                        key = (arr.shift()||'').trim().toUpperCase();
                    ret[key] = (arr.join('=')||'').trim();
                });
            }
        }
    }else{
        // config object
        ret = file||{};
        if (!ret.DIR_CONFIG){
            this.set('DIR_CONFIG',_path.absolute(
                './',process.cwd()+'/'
            ));
        }
    }
    return ret;
};
/**
 * format config key
 * @private
 * @param  {String} key - config key
 * @return {String} key after formatted
 */
pro._formatKey = function(key){
    return (key||'').trim().toUpperCase();
};
/**
 * format path with webroot
 * @private
 * @param  {String} dir - path directory
 * @return {String} absolute path with relative to webroot
 */
pro._formatWithWebRoot = function(dir){
    if (!!dir){
        return _path.absolute(
            dir+'/',this.get('DIR_WEBROOT')
        );
    }
};
/**
 * format sub root
 * @private
 * @param  {String} sub  - sub directory
 * @param  {String} root - relative directory
 * @return {Array}  directories after formatted
 */
pro._formatSubDir = function(sub,root){
    var list = [];
    sub.split(/[,;\s]+/).forEach(function(dir){
        var subdir = _path.absolute(
            (dir||'.')+'/',root
        );
        if (list.indexOf(subdir)<0){
            list.push(subdir);
        }
    });
    return list;
};
/**
 *  format domain value
 * @private
 * @param  {String} domain - config domain
 * @return {String} domain after format
 */
pro._formatDomain = function(domain){
    if (!domain){
        return null;
    }
    if (domain.indexOf('/')>=0){
        return domain;
    }
    return 'http://'+domain+'/';
};
/**
 * format domain list
 * @private
 * @param  {String} domain - domain string separate by , or ; or space
 * @param  {String} dftkey - default domain key
 * @return {Array}  domain list
 */
pro._formatDomainList = function(domain,dftkey){
    var dftval = this.get(dftkey)||[];
    if (!domain){
        return dftval;
    }
    // check domain string
    var arr = [];
    if (typeof domain==='string'){
        arr = domain.split(/[,;\s]+/);
    }else if(util.isArray(v)){
        arr = v;
    }
    // parse each domain value
    var brr = [];
    arr.forEach(
        function(d){
            if (!!d){
                var dm = this._formatDomain[d];
                if (!!dm) brr.push(dm);
            }
        },this
    );
    // return list
    if (!brr.length){
        return dftval;
    }
    return brr;
};
/**
 * format boolean value
 * @private
 * @param  {String|*} value - config value
 * @return {Boolean}  boolean value,'true' -> true; 0/false/null/undefined will be false
 */
pro._formatBoolean = function(value){
    if (typeof value==='string'){
        return value.toLowerCase()==='true';
    }
    return !!value;
};
/**
 * format number value
 * @private
 * @param  {String|Number} value - config value
 * @param  {Number} low  - lower value
 * @param  {Number} high - higher value
 * @param  {Number} def  - default value
 * @return {Number} number after format
 */
pro._formatNumber = function(value,low,high,def){
    value = parseInt(value,10);
    if (isNaN(value)||value<low||value>high){
        value = def;
    }
    return value;
};
/**
 * format core list in config file
 * @private
 * @param  {String|Array} value - core list config
 * @return {Array} core list
 */
pro._formatCoreList = function(value){
    if (!value){
        return null;
    }
    if (util.isArray(value)){
        return value;
    }
    // for json string
    var list;
    try{
        list = JSON.parse(value);
    }catch(ex){
        // ignore
    }
    if (util.isArray(list)){
        return list;
    }
    // for file path
    var file = _path.absolute(
        value,this.get('DIR_CONFIG')
    );
    try{
        list = require(file);
    }catch(ex){
        // ignore
    }
    if (util.isArray(list)){
        return list;
    }
};
