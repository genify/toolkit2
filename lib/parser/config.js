var util     = require('util'),
    path     = require('path'),
   _fs       = require('../util/file.js'),
   _path     = require('../util/path.js'),
   _util     = require('../util/util.js'),
   _Abstract = require('../event.js');
// config parser
var Parser = module.exports = function(config){
    _Abstract.apply(this,arguments);

    // filter function map
    var _doSubDir = function(sub,root){
        var list = [];
        sub.split(/[,;\s]+/).forEach(function(dir){
            var abph = _path.absolute(
                (dir||'.')+'/',root
            );
            if (list.indexOf(abph)<0){
                list.push(abph);
            }
        });
        return list;
    };
    var _doWebRoot = function(dir){
        if (!!dir){
            return _path.absolute(
                dir+'/',this.get('DIR_WEBROOT')
            );
        }
    };
    var _doFormatDomain = function(domain){
        if (!domain){
            return;
        }
        if (domain.indexOf('/')>=0){
            return domain;
        }
        return 'http://'+domain+'/';
    };
    var _doFormatKey = function(key){
        return (key||'').trim().toUpperCase();
    };
    var _doFormatBoolean = function(value){
        if (typeof value==='string'){
            return value.toLowerCase()==='true';
        }
        return !!value;
    };
    var _doFormatNumber = function(value,low,high,def){
        value = parseInt(value,10);
        if (isNaN(value)||value<low||value>high){
            value = def;
        }
        return value;
    };
    var _doFormatCoreList = function(value){
        if (!value) return;
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
        var crph = _path.absolute(
            value,this.get('DIR_CONFIG')
        );
        try{
            list = require(crph);
        }catch(ex){
            // ignore
        }
        if (util.isArray(list)){
            return list;
        }
    };
    
    // config cache
    var _cache;
    // event parameter property for plugin
    // uri          file absolute path
    // content      file content
    // webroot      web root path
    var _plugin = {
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
        }
    };
    var _filters = [{
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
            return _doWebRoot.call(this,v);
        }
    },{
        DIR_SOURCE_SUB:function(v){
            if (!v) return;
            // relative to DIR_SOURCE
            return _doSubDir(v,
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
            return _doWebRoot.call(this,v);
        }
    },{
        DIR_SOURCE_TP_SUB:function(v){
            if (!v) return;
            // relative to DIR_SOURCE_TP
            return _doSubDir(v,
                this.get('DIR_SOURCE_TP')||
                this.get('DIR_WEBROOT')
            );
        }
    },{
        DIR_OUTPUT_TP:function(v){
            var output = !!v 
                ? _doWebRoot.call(this,v)
                : this.get('DIR_OUTPUT');
            _fs.mkdir(output);
            return output;
        }
    },{
        DIR_OUTPUT_STATIC:function(v){
            var root = this.get('DIR_WEBROOT'),
                output = !!v 
                    ? _doWebRoot.call(this,v)
                    : this.get('DIR_OUTPUT')||root;
            if (output.indexOf(root)!=0){
                this.emit('warn',{
                    data:[output],
                    message:'DIR_OUTPUT_STATIC[%s] not in DIR_WEBROOT'
                });
            }
            _fs.mkdir(output);
            return output;
        }
    },{
        DIR_STATIC:function(v){
            var dir = _doWebRoot.call(this,v||'./res');
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
            delete _cache['ALIAS_END_TAG'];
            delete _cache['ALIAS_START_TAG'];
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
            return _doFormatDomain(v);
        }
    },{
        DM_STATIC_RS:function(v){
            if (!v){
                return this.get('DM_STATIC');
            }
            var arr = [];
            if (typeof v==='string'){
                arr = v.split(/[,;\s]+/);
            }else if(util.isArray(v)){
                arr = v;
            }
            var brr = [];
            arr.forEach(function(d){
                var dm = _doFormatDomain[d];
                if (!!dm) brr.push(dm);
            });
            if (!brr.length){
                brr.push(this.get('DM_STATIC'));
            }
            return brr;
        }
    },{
        DM_STATIC_CS:function(v){
            return _doFormatDomain(v)||this.get('DM_STATIC');
        }
    },{
        DM_STATIC_JS:function(v){
            return _doFormatDomain(v)||this.get('DM_STATIC');
        }
    },{
        DM_STATIC_MF:function(v){
            return _doFormatDomain(v)||this.get('DM_STATIC');
        }
    },{
        DM_STATIC_MR:function(v){
            v = v||'';
            if (!!v&&/\/$/.test(v)){
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
            return _doWebRoot.call(this,v);
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
            if (!!v&&_doFormatBoolean(v)){
                this.set('VERSION_MODE',1);
            }
        }
    },{
        VERSION_MODE:function(v){
            if (v==null||v==''){
                return this.get('VERSION_MODE')||0;
            }
            return _doFormatNumber(v,0,1,v);
        }
    },{
        // @deprecated see VERSION_STATIC
        STATIC_VERSION:function(v){
            this.set('VERSION_STATIC',_doFormatBoolean(v));
        }
    },{
        VERSION_STATIC:function(v){
            if (v==null||v==''){
                return !!this.get('VERSION_STATIC');
            }
            return _doFormatBoolean(v);
        }
    },{
        // @deprecated see X_NOCORE_FLAG
        X_NOCORE_STYLE:function(v){
            v = _doFormatBoolean(v)?1:0;
            var x = this.get('X_NOCORE_FLAG')||0;
            this.set('X_NOCORE_FLAG',v);
        },
        // @deprecated see X_NOCORE_FLAG
        X_NOCORE_SCRIPT:function(v){
            v = _doFormatBoolean(v)?2:0;
            var x = this.get('X_NOCORE_FLAG')||0;
            this.set('X_NOCORE_FLAG',v+x);
        }
    },{
        X_NOCORE_FLAG:function(v){
            if (v==null||v==''){
                return this.get('X_NOCORE_FLAG')||0;
            }
            return _doFormatNumber(v,0,3,0);
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
            return _doWebRoot.call(this,v);
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
            ret = _util.merge(_plugin,ret);
            Object.keys(ret).forEach(function(key){
                ret[key] = ret[key].bind(this);
            },this);
            return ret;
        },
        
        OPT_IMAGE_FLAG:function(v){
            return _doFormatBoolean(v);
        },
        OPT_IMAGE_QUALITY:function(v){
            return _doFormatNumber(v,1,100,100);
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
            return _doFormatNumber(v,0,3,3);
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
            return _doFormatBoolean(v);
        },
        OBF_SOURCE_MAP:function(v){
            v = _doFormatBoolean(v);
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
            return _doFormatBoolean(v);
        },
        
        CORE_LIST_JS:function(v){
            return _doFormatCoreList.call(this,v);
        },
        CORE_LIST_CS:function(v){
            return _doFormatCoreList.call(this,v);
        },
        CORE_MASK_JS:function(v){
            return _doFormatCoreList.call(this,v);
        },
        CORE_MASK_CS:function(v){
            return _doFormatCoreList.call(this,v);
        },
        CORE_FREQUENCY:function(v){
            _doFormatNumber(v,2,100000,2);
        },

        X_NOCOMPRESS:function(v){
            return _doFormatBoolean(v);
        },
        X_NOPARSE_FLAG:function(v){
            v = parseInt(v);
            if (isNaN(v)||v<0||v>3){
                v = 0;
            }
            return v;
        },
        X_AUTO_EXLINK_PATH:function(v){
            return _doFormatBoolean(v);
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
            return _doFormatBoolean(v);
        }
    }];
    // get config value
    this.get = function(key){
        return _cache[_doFormatKey(key)];
    };
    // set config value
    this.set = function(key,value){
        _cache[_doFormatKey(key)] = value;
    };
    // dump all config
    this.dump = function(){
        return _cache;
    };
    // update config file
    this.update = function(file){
        var conf;
        _cache = {};
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
                // parse config from json
                conf = require(file);
            }catch(ex){
                // ignore
            }
            if (!conf){
                // parse config from property file
                conf = {};
                var list = _fs.read(file);
                if (!!list&&list.length){
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
                        conf[key] = (arr.join('=')||'').trim();
                    });
                }
            }
        }else{
            // config object
            conf = file||{};
            if (!conf.DIR_CONFIG){
                this.set('DIR_CONFIG',_path.absolute(
                    './',process.cwd()+'/'
                ));
            }
        }
        // format config
        _filters.forEach(function(map){
            Object.keys(map).forEach(function(k){
                var key = _doFormatKey(k),
                    value = conf[key],
                    filter = map[k];
                if (!!filter){
                    value = filter.call(this,value);
                }
                if (value!=null){
                    this.set(key,value);
                }
                delete conf[key];
            },this);
        },this);
        // cache config left
        Object.keys(conf).forEach(function(k){
            this.set(_doFormatKey(k),conf[k]);
        },this);
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
    // init config
    this.update(config);
};
util.inherits(Parser,_Abstract);
