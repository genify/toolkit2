var __config,
    _fs      = require('../file.js'),
    _log     = require('../logger.js'),
    _util    = require('../util.js'),
    _path    = require('../path.js'),
     path    = require('path'),
     util    = require('util');
/*
 * 生成随即文件名
 * @return {String} 随机文件名
 */
var __getRandName = (function(){
    var _fmtnmb = function(_number){
        _number = parseInt(_number)||0;
        return (_number<10?'0':'')+_number;
    };
    var _fmtxms = function(_time){
        var _len = Math.max(0,3-(''+_time).length)+1;
        return new Array(_len).join('0')+_time;
    };
    var _getFileTime = function(){
        var _time = new Date();
        return util.format('%s%s%s.%s%s%s%s',
                           _time.getFullYear(),
                           _fmtnmb(_time.getMonth()+1),
                           _fmtnmb(_time.getDate()),
                           _fmtnmb(_time.getHours()),
                           _fmtnmb(_time.getMinutes()),
                           _fmtnmb(_time.getSeconds()),
                           _fmtxms(_time.getMilliseconds()));
    };
    return function(){
        return _getFileTime();
    };
})();
/*
 * 设置配置信息
 * @param  {String} _key   配置标识
 * @param  {String} _value 配置内容
 * @return {Void}
 */
var __setConfig = function(_key,_value){
    __config[_key.trim().toUpperCase()] =
            !_value.trim?_value:_value.trim();
};
/**
 * 取配置信息
 * @param  {String} _key   配置标识
 * @return {String} _value 配置内容
 */
var __getConfig = function(_key){
    var _value = __config[_key.trim().toUpperCase()];
    return _value==null?'':_value;
};
/*
 * 检查输入路径
 * @param  {String} _key  配置标识
 * @param  {String} _root 根路径
 * @return {String}       绝对路径
 */
var __doCheckInputPathConfig = function(_key,_root){
    var _value = __getConfig(_key);
    if (!!_value){
        _value = _path.path(_value+'/',_root);
        if (!_path.remote(_value)&&
		    !_path.exist(_value)){
            _log.error('%s[%s] not exist!',_key,_value);
            _value = '';
        }
    }
    __setConfig(_key,_value);
    return _value;
};
/*
 * 检查输出路径
 * @param  {String} _key  配置标识
 * @param  {String} _root 根路径
 * @return {String}       绝对路径
 */
var __doCheckOutputPathConfig = function(_key,_root){
    var _value = __getConfig(_key);
    if (!!_value){
        _value = _path.path(_value+'/',_root);
        _fs.mkdir(_value);
    }
    __setConfig(_key,_value);
    return _value;
};
/*
 * 检查输出文件路径
 * @param  {String} _key  配置标识
 * @param  {String} _root 根路径
 * @return {String}       绝对路径
 */
var __doCheckOutputFileConfig = function(_key,_root){
    var _value = __getConfig(_key)||'';
    if (!!_value)
        _value = _path.path(_value,_root);
    __setConfig(_key,_value);
    return _value;
};
/*
 * 检查输入文件路径
 * @param  {String} _key  配置标识
 * @return {String}       绝对路径
 */
var __doCheckInputCoreConfig = function(_key){
    var _value = __getConfig(_key),
        _root  = __getConfig('DIR_CONFIG');
    if (!!_value&&!util.isArray(_value)){
        var _list = _util.eval(_value);
        if (util.isArray(_list)){
            _value = _list;
        }else{
            _value = _path.path(_value,_root);
            if (!_path.exist(_value)){
                _log.warn('%s[%s] not exist!',_key,_value);
                _value = '';
            }
        }
    }
    __setConfig(_key,_value);
};
/*
 * 检查域名配置
 * @param  {String} _key 配置标识
 * @return {Void}
 */
var __doCheckDomainConfig = function(_key){
    var _domain = __getConfig(_key);
    if (!_domain)
        __setConfig(_key+'_RR',!0);
    if (!!_domain
        &&_domain.indexOf('/')<0)
        _domain = 'http://'+_domain+'/';
    __setConfig(_key,_domain||'/');
};
/*
 * 检查字符型配置
 * @param  {String} _key     配置标识
 * @param  {String} _default 默认值
 * @return {Void}
 */
var __doCheckValueWithDefault = function(_key,_default){
    __setConfig(_key,__getConfig(_key)||_default);
    return __getConfig(_key)||_default;
};
/*
 * 检查数值型配置
 * @param  {String} _key     配置标识
 * @param  {Number} _default 默认值
 * @return {Void}
 */
var __doCheckNumberWithDefault = function(_key,_default){
    _value = parseInt(__getConfig(_key));
    __setConfig(_key,isNaN(_value)?_default:_value);
};
/*
 * 检查布尔型配置
 * @param  {String} _key 配置标识
 * @return {Void}
 */
var __doCheckBoolean = function(_key){
    var _value = __getConfig(_key);
    __setConfig(_key,_value===!0||_value.toLowerCase()==='true');
};
/*
 * 检查manifest配置模板
 * @return {Void}
 */
var __doCheckManifestTpl = function(){
    var _content = '',
        _value = __getConfig('MANIFEST_TEMPLATE');
    if (!!_value){
        _value = _path.path(_value,__getConfig('DIR_CONFIG'));
        if (!_path.exist(_value)){
            _log.warn('MANIFEST_TEMPLATE[%s] not exist!',_value);
        }else{
            var _list = _fs.read(_value);
            if (!!_list&&_list.length>0){
                _content = _list.join('\n');
            }else{
                _log.warn('MANIFEST_TEMPLATE[%s] is empty!',_value);
            }
        }
    }
    if (!_content){
        _content = [
            'CACHE MANIFEST',
            '#VERSION = #<VERSION>','',
            'CACHE:','#<CACHE_LIST>','',
            'NETWORK:','*','',
            'FALLBACK:',''
        ].join('\n');
    }
    __setConfig('MANIFEST_TEMPLATE',_content);
};
/*
 * 检查路径相关配置
 * @return {Void}
 */
var __doCheckConfig_DIR = function(){
    var _split = /[,;\s]+/;
    // DIR_WEBROOT
    var _root = __doCheckInputPathConfig('DIR_WEBROOT',
                          __getConfig('DIR_CONFIG'));
    // DIR_SOURCE
    // DIR_SOURCE_SUB
    // DIR_OUTPUT
    __doCheckInputPathConfig('DIR_SOURCE',_root);
    __doCheckValueWithDefault('DIR_OUTPUT','./');
    var _output = __doCheckOutputPathConfig('DIR_OUTPUT',_root);
    var _sub = 'DIR_SOURCE_SUB';
    __setConfig(_sub,__getConfig(_sub).split(_split));
    // DIR_SOURCE_TP
    // DIR_SOURCE_TP_SUB
    // DIR_OUTPUT_TP
    var _tmpl = __doCheckInputPathConfig('DIR_SOURCE_TP',_root);
    var _outtpl = '';
    if (!!_tmpl){
        _outtpl = __doCheckOutputPathConfig('DIR_OUTPUT_TP',_root);
        if (!_outtpl) _outtpl = _output;
    }
    __setConfig('DIR_OUTPUT_TP',_outtpl);
    var _sub = 'DIR_SOURCE_TP_SUB';
    __setConfig(_sub,__getConfig(_sub).split(_split));
    // DIR_OUTPUT_STATIC
    var _static = __doCheckOutputPathConfig('DIR_OUTPUT_STATIC',_root);
    if (!_static){
		_static = _output;
		__setConfig('DIR_OUTPUT_STATIC',_static);
	} 
    // insure static output in webroot
    if (_static.indexOf(_root)<0){
        __setConfig('DIR_OUTPUT_STATIC','./'+path.basename(_output));
        __doCheckOutputPathConfig('DIR_OUTPUT_STATIC',_root);
    }
    // DIR_STATIC
    // DIR_TEMPORARY
    __doCheckValueWithDefault('DIR_STATIC','./res');
    __doCheckInputPathConfig('DIR_STATIC',_root);
    // NEJ_DIR
    // NEJ_PLATFORM
    __doCheckInputPathConfig('NEJ_DIR',_root);
    __doCheckValueWithDefault('NEJ_PLATFORM','');
    // ALIAS_START_TAG
    // ALIAS_END_TAG
    // ALIAS_DICTIONARY
    // ALIAS_REG
    var _reg = /([\$\(\)\[\]\*\+\|])/g,
        _dic = __doCheckValueWithDefault('ALIAS_DICTIONARY','{}'),
        _beg = __doCheckValueWithDefault('ALIAS_START_TAG','${').replace(_reg,'\\$1'),
        _end = __doCheckValueWithDefault('ALIAS_END_TAG','}').replace(_reg,'\\$1');
    __setConfig('ALIAS_REG',new RegExp(util.format('%s(.*?)%s',_beg,_end),'ig'));
    __setConfig('ALIAS_DICTIONARY',(typeof _dic=='string')?JSON.parse(_dic):_dic);
    // MANIFEST_OUTPUT
    // MANIFEST_TEMPLATE
    // MANIFEST_FILTER
    __doCheckValueWithDefault('MANIFEST_OUTPUT','');
    var _value = __doCheckOutputFileConfig('MANIFEST_OUTPUT',_root);
    if (!!_value&&_value.indexOf(_root)<0){
        _log.error('MANIFEST_OUTPUT[%s] is not in webroot and ignore this config!',_value);
        __setConfig('MANIFEST_OUTPUT','');
    }
    var _value = __getConfig('MANIFEST_FILTER');
    if (!!_value){
        _value = new RegExp(_value,'i');
    }
    __setConfig('MANIFEST_FILTER',_value);
    __doCheckManifestTpl();
    // temporary dir
    _fs.mkdir(__getConfig('DIR_TEMPORARY'));
};
/*
 * 检查输出文件配置
 * @return {Void}
 */
var __doCheckConfig_EXT = function(){
    // NAME_SUFFIX
    // FILE_SUFFIXE
    // FILE_FILTER
    // FILE_CHARSET
    // RAND_VERSION
    // STATIC_VERSION
    // OPT_IMAGE_FLAG
    // OPT_IMAGE_QUALITY
    // X_NOCOMPRESS
    // X_NOPARSE_FLAG
    // X_NOCORE_STYLE
    // X_NOCORE_SCRIPT
    // X_KEEP_COMMENT
    // X_RELEASE_MODE
    // X_NOT_CLEAR_TEMP
    // X_AUTO_EXLINK_PATH
    // X_AUTO_EXLINK_PREFIX
    // X_MODULE_WRAPPER
    // X_SCRIPT_WRAPPER
    // X_SOURCE_MAP
    // X_LOGGER_LEVEL
    var _suffix = __getConfig('NAME_SUFFIX');
    if (!!_suffix&&!/^[._]/i.test(_suffix))
        __setConfig('NAME_SUFFIX','_'+_suffix);
    var _suffix = __getConfig('FILE_SUFFIXE');
    if (!!_suffix)
        _suffix = new RegExp('\\.(?:'+_suffix+')$','i');
    __setConfig('FILE_SUFFIXE',_suffix);
    var _filter = __getConfig('FILE_FILTER');
    if (!!_filter)
        _filter = new RegExp(_filter,'i');
    __setConfig('FILE_FILTER',_suffix);
    var _charset = __getConfig('FILE_CHARSET')||'utf-8';
    __setConfig('FILE_CHARSET',_charset.toLowerCase());
    __doCheckBoolean('RAND_VERSION');
    __doCheckBoolean('STATIC_VERSION');
    __doCheckBoolean('OPT_IMAGE_FLAG');
    __doCheckNumberWithDefault('OPT_IMAGE_QUALITY',100);
    __doCheckBoolean('X_NOCOMPRESS');
    __doCheckNumberWithDefault('X_NOPARSE_FLAG',0);
    __doCheckBoolean('X_NOCORE_STYLE');
    __doCheckBoolean('X_NOCORE_SCRIPT');
    __doCheckBoolean('X_NOT_CLEAR_TEMP');
    __doCheckBoolean('X_AUTO_EXLINK_PATH');
    __doCheckBoolean('X_KEEP_COMMENT');
    __doCheckValueWithDefault('X_MODULE_WRAPPER','%s');
    __doCheckValueWithDefault('X_SCRIPT_WRAPPER','%s');
    __doCheckValueWithDefault('X_RELEASE_MODE','online');
    var _prefix = __getConfig('X_AUTO_EXLINK_PREFIX');
    if (!!_prefix){
        var _reg = '(\\s+(?:'+_prefix+')\\s*=\\s*[\'"])(.*?)([\'"])';
        __setConfig('X_AUTO_EXLINK_REG',new RegExp(_reg,'gi'));
    }
};
/*
 * 检查域名配置
 * @return {Void}
 */
var __doCheckConfig_DM = function(){
    // DM_STATIC
    // DM_STATIC_CS
    // DM_STATIC_JS
    // DM_STATIC_MF
    // DM_STATIC_MR
    var _domain = __getConfig('DM_STATIC');
    __doCheckValueWithDefault('DM_STATIC_CS',_domain);
    __doCheckValueWithDefault('DM_STATIC_JS',_domain);
    __doCheckValueWithDefault('DM_STATIC_MF',_domain);
    __doCheckValueWithDefault('DM_STATIC_MR','');
    var _mr = __getConfig('DM_STATIC_MR');
    if (!!_mr&&!/\/$/.test(_mr)){
        __setConfig('DM_STATIC_MR',_mr+'/');
    }
    __doCheckDomainConfig('DM_STATIC');
    __doCheckDomainConfig('DM_STATIC_CS');
    __doCheckDomainConfig('DM_STATIC_JS');
    __doCheckDomainConfig('DM_STATIC_MF');
    var _static = __getConfig('DIR_STATIC')
                   .replace(__getConfig('DIR_WEBROOT'),'/')||'/res/';
    __setConfig('DIR_STATIC_REG',new RegExp(
               util.format('([\'"])([.\\w/@-]*?%s[.\\w/@-]*?)\\1',_static),'g'));
};
/*
 * 检查混淆配置
 * @return {Void}
 */
var __doCheckConfig_OBF = function(){
    // OBF_LEVEL
    // OBF_NAME_BAGS
    // OBF_MAX_CS_INLINE_SIZE
    // OBF_MAX_JS_INLINE_SIZE
    __doCheckNumberWithDefault('OBF_LEVEL',3);
    __doCheckNumberWithDefault('OBF_MAX_CS_INLINE_SIZE',50);
    __doCheckNumberWithDefault('OBF_MAX_JS_INLINE_SIZE', 0);
    __doCheckValueWithDefault('OBF_NAME_BAGS','./names.json');
    __setConfig('OBF_NAME_BAGS',_path.path(
               __getConfig('OBF_NAME_BAGS'),
               __getConfig('DIR_CONFIG')));
    // OBF_COMPATIBLE
    // OBF_DROP_CONSOLE
    __doCheckValueWithDefault('OBF_COMPATIBLE','true');
    __doCheckBoolean('OBF_COMPATIBLE');
    __doCheckBoolean('OBF_DROP_CONSOLE');
    // OBF_SOURCE_MAP
    __doCheckBoolean('OBF_SOURCE_MAP');
    if (__getConfig('OBF_SOURCE_MAP')){
        var _value = './s/';
        __setConfig('DIR_SOURCE_MAP',_value);
        _fs.mkdir(_path.path(
            _value,__getConfig('DIR_OUTPUT_STATIC')
        ));
    }
};
/*
 * 检查合并策略配置文件
 * @return {Void}
 */
var __doCheckConfig_CORE = function(){
    // CORE_LIST_JS
    // CORE_LIST_CS
    // CORE_MASK_JS
    // CORE_MASK_CS
    __doCheckInputCoreConfig('CORE_LIST_JS');
    __doCheckInputCoreConfig('CORE_LIST_CS');
    __doCheckInputCoreConfig('CORE_MASK_JS');
    __doCheckInputCoreConfig('CORE_MASK_CS');
};
/**
 * 解析配置文件
 * @param  {String} _file 配置文件地址
 * @return {Void}
 */
var __doParseConfig = function(_file){
    try{
        __config = {};
        _file = _path.path(_file);
        var _dir = path.dirname(_file)+'/';
        __setConfig('DIR_CONFIG',_dir);
        var _name = __getRandName();
        __setConfig('DIR_LOGGER',_dir+_name+'.txt');
        __setConfig('DIR_TEMPORARY',_dir+_name+'/');
        var _list = _fs.read(_file);
        if (!!_list&&_list.length>0){
            try{
                // check to json file
                var _map = JSON.parse(_list.join('\n'));
                for(var x in _map){
                    __setConfig(x,_map[x]);
                }
            }catch(ex){
                for(var i=0,l=_list.length,_line;i<l;i++){
                    _line = _list[i];
                    if (_util.blank(_line)||
                        _util.comment(_line))
                        continue;
                    _line = _line.split('=');
                    __setConfig(
                        _line.shift().trim(),
                        _line.join('=').trim()
                    );
                }
            }
        }
        _log.init(
            __getConfig('DIR_LOGGER'),
            __getConfig('X_LOGGER_LEVEL')
        );
        _log.info('parse %s',_file);
        __doCheckConfig_DIR();
        __doCheckConfig_EXT();
        __doCheckConfig_DM();
        __doCheckConfig_OBF();
        __doCheckConfig_CORE();
        _log.info('config -> %j',__config);
    }catch(e){
        _log.error('can\'t parse config for %s',e);
    }
};
// export api
exports.get   = __getConfig;
exports.parse = __doParseConfig;
