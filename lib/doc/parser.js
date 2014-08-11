var _config = require('./config.js'),
    _log    = require('./util/logger.js'),
    _util   = require('./util/util.js'),
    _fs     = require('./util/file.js'),
    _pkg1   = require('./meta/process.js'),
    _tpl    = require('./tpl.js'),
    _shjs   = require('./3rd/syntaxhighlighter/scripts/shBrushJScript.js').Brush,
     fs     = require('fs'),
     util   = require('util');
var _meta = {
    // block
    'class'     : require('./meta/klass.js').Klass,
    'method'    : require('./meta/method.js').Method,
    'api'       : require('./meta/api.js').Api,
    'event'     : require('./meta/event.js').Event,
    'const'     : require('./meta/const.js').Const,
    // tag
    'config'    : require('./meta/config.js').Config,
    'param'     : require('./meta/param.js').Param,
    'return'    : require('./meta/return.js').Return,
    'type'      : require('./meta/type.js').Type,
    'see'       : require('./meta/see.js').See
};
/**
 * 解析注释标记
 * @param  {Block} 注释块对象
 * @param  {Array} 注释行列表
 * @return {Void}
 */
var __doParseCMTTag = (function(){
        // tag name
    var _reg0 = /@([a-z]+?)\b/,
        // tag type
        _reg1 = /\{(.*?)\}/,
        // method flag
        _reg2 = /^(?:static|public|private|protected)$/,
        // class flag
        _reg3 = /^(?:extends|uses)$/,
        // trim all line in param/return description
        _reg4 = /\n\s*/g,
        // config name
        _reg5 = /^([\w-]+?)\s/,
        // api flag
        _reg6 = /^(?:chainable)$/;
    return function(_block,_list){
        var _name,_content = _list.join('\n');
        if (_reg0.test(_content)){
            _name = RegExp.$1;
            _content = _content.replace(_reg0,'').trim();
        }
        // description
        if (!_name){
            _block._$setDescription(_content);
            return;
        }
        var _tag = _block._$getTag();
        // singleton flag in class
        if (_name=='singleton'){
            _tag=='class' ? _block._$setSingleton()
                          : _log.warn('@singleton not allow in %s',_tag);
            return;
        }
        // check method flag
        if (_reg2.test(_name)){
            _tag=='method' ? _block._$setFlag(_name)
                           : _log.warn('@%s not allow in %s',_name,_tag);
            return;
        }
        // check api flag
        if (_reg6.test(_name)){
            _tag=='api' ? _block._$setFlag(_name)
                        : _log.warn('@%s not allow in %s',_name,_tag);
            return;
        }
        // parse tag
        var _type;
        if (_reg1.test(_content)){
            _type = RegExp.$1;
            _content = _content.replace(_reg1,'').trim();
        }
        // check type
        if (!_type){
            _log.warn('@%s must assign {type}',_name);
            return;
        }
        // check extends/uses in class
        if (_reg3.test(_name)){
            if (_tag!='class'){
                _log.warn('@%s not allow in %s',_name,_tag);
            }else{
                _name!='uses' ? _block._$setSuper(_type)
                              : _block._$addUsedClass(_type);
            }
            return;
        }
        if (!_meta[_name]){
            _log.warn('@%s is not defined',_name);
            return;
        }
        switch(_name){
            case 'see':
                _block._$addSee(_item);
            return;
            case 'type':
                if (_tag!='const'){
                    _log.warn('@type not allow in %s',_tag);
                    return;
                }
                var _item = new _meta[_name]();
                _item._$setType(_type);
                _block._$setType(_item);
            return;
            case 'param':
            case 'return':
                if (!(_block instanceof _pkg1.Process)){
                    _log.warn('@%s not allow in %s',_name,_tag);
                    return;
                }
                var _item = new _meta[_name]();
                _item._$setType(_type);
                _item._$setDescription(_content/*.replace(_reg4,'\n')*/);
                _name=='param' ? _block._$addParam(_item)
                               : _block._$setReturn(_item);
            return;
            case 'config':
                if (!(_block instanceof _pkg1.Process)){
                    _log.warn('@%s not allow in %s',_name,_tag);
                    return;
                }
                var _list = _block._$getParam(),
                    _parent = (_block._$getReturn()||_list[_list.length-1]);
                if (!_parent){
                    _log.warn('@config must after @param or @return');
                    return;
                }
                var _prnm = '';
                if (_reg5.test(_content)){
                    _prnm = RegExp.$1.trim();
                    _content = _content.replace(_reg5,'').trim();
                }
                var _item = new _meta[_name]();
                _item._$setType(_type);
                _item._$setName(_prnm);
                _item._$setDescription(_content/*.replace(_reg4,'\n')*/);
                _parent._$addConfig(_item);
            return;
        }
    };
})();
/**
 * 解析注释块
 * @param  {Array}  注释行列表
 * @param  {Object} 文件定义信息
 * @return {Block}  注释块
 */
var __doParseCMTBlock = (function(){
        // find block tag
    var _reg0 = /\s*@(class|api|method|const|event)\s*\{(.+?)\}\s*/,
        _reg1 = /^\s*@/i;
    return function(_content,_define){
        // check block tag
        var _txt = _content,_tag,_name;
        if (_reg0.test(_content)){
            _tag = RegExp.$1,
            _name = RegExp.$2;
            _txt = _content.replace(_reg0,'\n');
        }
        if (!_tag||!_name){
            _log.warn('no block tag or tag name found');
            return;
        }
        if (!_meta[_tag]){
            _log.warn('ignore error block tag[%s]',_tag);
            return;
        }
        // build block
        var _block = new _meta[_tag]();
        _block._$setName(_name);
        _block._$setFileName(_define.alias||_define.file);
        _block._$setDependList(_define.deps);
        // parse comment block
        var _list = _txt.split('\n'),_arr;
        for(var i=0,l=_list.length,_line;i<l;i++){
            _line = _list[i];
            // tag line
            if (_reg1.test(_line)){
                if (!!_arr)
                    __doParseCMTTag(_block,_arr);
                _arr = null;
            }
            if (!_arr)
                _arr = [];
            _arr.push(_line);
        }
        if (!!_arr)
            __doParseCMTTag(_block,_arr);
        return _block;
    };
})();
/**
 * 解析文件中的注释块
 * @return {Object} 注释块信息
 * @config {String} alias  别名
 * @config {String} deps   依赖文件列表
 * @config {Array}  blocks 注释块列表
 */
var __doParseCMTBlocks = (function(){
    var f,
        // comment start with /**
        _reg00 = /^\s*\/\*\*\s*$/,
        // comment end with */
        _reg01 = /^\s*\*\/\s*$/,
        // comment prefix 
        _reg02 = /^\s*\*\s?/,
        // start define code
        _reg10 = /^\s*(NEJ\.)?define\(/;
    var define = function(_uri,_deps,_callback){
        // define('',[],f);
        // define('',f);
        // define([],f);
        // define(f);
        if (_util.func(_deps)){
            _callback = _deps;
            _deps = null;
        }
        if (util.isArray(_uri)){
            _deps = _uri;
            _uri = '';
        }
        if (_util.func(_uri)){
            _callback = _uri;
            _deps = null;
            _uri = '';
        }
        return {alias:_uri,deps:_deps};
    };
    var NEJ = {define:define};
    return function(_list){
        // parse comment
        var _blocks = [],_arr,_brr;
        for(var i=0,l=_list.length,_line;i<l;i++){
            _line = _list[i];
            // define code
            if (_reg10.test(_line))
                _brr = [];
            if (!!_brr)
                _brr.push(_line);
            // start comment
            if (_reg00.test(_line)){
                _arr = [];
                continue;
            }
            // end comment
            if (_reg01.test(_line)){
                !!_arr ? _blocks.push(_arr.join('\n'))
                       : _log.warn('ignore comment end for no comment start');
                _arr = null;
                continue;
            }
            // comment content
            if (!!_arr){
                _arr.push(_line.replace(_reg02,''));
                continue;
            }
        }
        // parse define
        var _info = {};
        if (!!_brr){
            var _info = eval(_brr.join('\n'))||{};
            _brr = null;
        }
        // return result
        return {
            blocks:_blocks,
            define:{
                alias:_info.alias,
                deps:_info.deps
            }
        };
    };
})();
/**
 * 注释块列表解析成Meta对象列表
 * @param  {Object} 注释块信息
 * @return {Array}  Meta对象列表
 */
var __doParseCMTBlockList = function(_bmap){
    // parse block
    var _blocks = [];
    for(var i=0,l=_bmap.blocks.length,_arr,_tag,_parent;i<l;i++){
        _arr = _bmap.blocks[i].split('[hr]');
        for(var j=0,k=_arr.length;j<k;j++){
            _block = __doParseCMTBlock(
                     _arr[j].trim(),_bmap.define);
            if (!_block) continue;
            _parent = _blocks[_blocks.length-1];
            _tag = _block._$getTag();
            // check event block
            if (_tag=='event'){
                _parent instanceof _pkg1.Process
                ? _parent._$addEvent(_block)
                : _log.warn('@event must after @class or @api');
                continue;
            }
            // check method block
            if (_tag=='method'){
                _parent instanceof _meta['class']
                ? _parent._$addMethod(_block)
                : _log.warn('@method must after @class');
                continue;
            }
            // api/const/class
            _blocks.push(_block);
        }
    }
    return _blocks;
};
/**
 * 解析文件
 * @param  {String} 文件路径
 * @param  {Object} 解析结果集
 * @return {Void}
 */
var __doParseFile = (function(){
    var _reg0 = /\/+/g,
        _mmap = {
            'api':'apis',
            'const':'consts',
            'class':'classes'
        };
    var _doMergeResult = function(_list,_result){
        for(var i=0,l=_list.length,_block,_name;i<l;i++){
            _block = _list[i];
            _block._$parseDescription();
            _result[_mmap[_block._$getTag()]][_block._$getName()] = _block;
        }
    };
    var _doOutputSource = function(_content,_options){
        var _brush = new _shjs(); 
        _brush.init();
        _content = _brush.getHtml(_content);
        var _name = _options.file
                .replace(_config.get('DIR_INPUT'),'')
                .replace(_reg0,'_')
                .replace(_config.get('FILE_EXTENSION_REG'),'.html');
            _file = _config.get('DIR_OUTPUT_SRC')+_name;
        _log.info('output %s',_file);
        _fs.write(_file,_tpl.get('code.html',{
            content:_content,
            theme:_config.get('CODE_THEME'),
            file:_options.alias||_options.file
        }));
    };
    return function(_file,_result){
        _log.info('parse %s',_file);
        var _list = _fs.read(_file,
            _config.get('FILE_CHARSET'));
        if (!_list||!_list.length){
            _log.warn('empty file %s',_file);
            return null;
        }
        // split comment block
        var _bmap = __doParseCMTBlocks(_list);
        _bmap.define.file = _file;
        _bmap.define.alias = _bmap.define.alias||
            _file.replace(_config.get('DIR_INPUT'),'{lib}');
        // parse comment block to meta
        var _blocks = __doParseCMTBlockList(_bmap);
        // merge blocks to result
        _doMergeResult(_blocks,_result);
        // output source code
        _doOutputSource(_list.join('\n'),_bmap.define);
    };
})();
/**
 * 列出目录下文件
 * @param  {String} 输入目录
 * @param  {Object} 解析结果集
 * @return {Object} 解析结果集
 */
var __doListFile = function(_dir,_result){
    _result = _result||{};
    if (!_dir) return _result;
    try{
        var _list = fs.readdirSync(_dir);
        if (!_list&&!_list.length){
            _log.warn('no file to parse! %s',_dir);
        }else{
            if (!_result.apis) _result.apis = {};
            if (!_result.consts) _result.consts = {};
            if (!_result.classes) _result.classes = {};
            for(var i=0,l=_list.length,_file,_data,
                _reg = _config.get('FILE_EXTENSION_REG');i<l;i++){
                _file = _list[i];
                if (_util.svn(_file))
                    continue;
                _file = _dir+_file;
                if (_fs.isdir(_file)){
                    __doListFile(_file+'/',_result);
                    continue;
                }
                if (!!_reg&&!_reg.test(_file))
                    continue;
                __doParseFile(_file,_result);
            }
        }
    }catch(e){
        _log.error('can\'t list files %s',e);
        console.log(e.stack);
    }
};
// exports
exports.parse  = __doListFile;
