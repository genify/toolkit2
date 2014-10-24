var _fs     = require('../file.js'),
    _log    = require('../logger.js'),
    _util   = require('../util.js'),
    _path   = require('../path.js'),
    _config = require('./config.js'),
    _obfuse = require('./minify.js'),
     rg     = require('regularjs'),
     fs     = require('fs'),
     util   = require('util'),
     path   = require('path'),
     query  = require('querystring'),
     NEJ    = {};
/*
 * 根据配置的字典信息合并数据
 * @param  {String} _text 合并前数据
 * @return {String}       合并后数据
 */
var _doMerge = function(_text){
    var _reg = _config.get('ALIAS_REG'),
        _map = _config.get('ALIAS_DICTIONARY');
    // ${abc} -> x/y/z or {xyz}
    return (_text||'').replace(_reg,
           function($1,$2){
               var _value = _map[($2||'').trim()];
               return _value==null?$1:_value;
           });
};
/*
 * 相对地址转绝对地址
 * @param  {String} _src  相对地址
 * @param  {String} _root 相对根路径
 * @return {String}       绝对路径
 */
var _doAbsolutePath = function(_src,_root){
    _src = _doMerge(_src);
    // for {A}a/b/c
    if (_src.indexOf('{')>=0){
        return _src;
    }
    // for /a/b/c
    if (_src.indexOf('/')==0){
        _root = _config.get('DIR_WEBROOT');
    }
    return _path.url(_src,_root);
};
/*
 * 相对地址转绝对地址
 * @param  {Array}  相对地址列表
 * @param  {String} 相对根路径
 * @return {Void}   绝对路径
 */
var _doAbsolutePathList = function(_list,_root){
    if (!_list||!_list.length) return;
    for(var i=0,l=_list.length,_it;i<l;i++){
        _it = _list[i];
        // relative path start with ./ or ../
        if (_it.indexOf('.')==0){
            _list[i] = _doAbsolutePath(_it,_root);
        }
    }
};
/*
 * 计算静态资源相对路径
 * @param  {String} _type 静态资源类型
 * @param  {String} _root 相对根路径
 * @param  {String} _file 文件路径
 * @return {String}       相对路径
 */
var _doRelativePath = function(_type,_root,_file){
    _type = (_type||'').substr(0,2).toUpperCase();
    var _uline = !_type?'':'_';
    // use absolute path
    if (!_config.get('DM_STATIC_'+_type+_uline+'RR'))
        return _file.replace(_config.get('DIR_WEBROOT'),
                             _config.get('DM_STATIC'+_uline+_type));
    // use relative path
    var _name = _path.slash(path.relative(
                 path.dirname(_root),_file))||'';
    if (_name.indexOf('.')!=0)
        _name = './'+_name;
    return _name;
};
/*
 * 计算文件输出路径
 * @param  {String} _file 输入文件路径
 * @return {String}       输出文件路径
 */
var _doOutputPath = (function(){
    var _input = ['DIR_SOURCE','DIR_SOURCE_TP'],
        _otput = ['DIR_OUTPUT','DIR_OUTPUT_TP'];
    return function(_file){
        for(var i=0,l=_input.length,_value;i<l;i++){
            _value = _config.get(_input[i]);
            if (!!_value)
                _file = _file.replace(_value,
                        _config.get(_otput[i]));
        }
        return _file;
    };
})();
/*
 * 文件标识转输出文件名称
 * @param  {String} 文件标识
 * @return {String} 输出文件名称
 */
var _doOutputFileName = (function(){
    var _reg0 = /^(?:tp|pg)_/i,
        _reg1 = /[\/\-]/g,
        _reg2 = /\.[^.]+?$/i,
        _prefix = ['p','t'],
        _dirname = ['DIR_SOURCE','DIR_SOURCE_TP'];
    return function(_key){
        if (_key=='core'){
            return _key;
        }
        _file = _key.replace(_reg0,'');
        for(var i=0,l=_dirname.length,_dir;i<l;i++){
            _dir = _config.get(_dirname[i]);
            if (!!_dir&&_file.indexOf(_dir)>=0){
                _file = _prefix[i]+'_'+_file.replace(_dir,'');
                break;
            }
        }
        _file = _prefix[_key.indexOf('tp_')==0?1:0]+
                _file.replace(_reg1,'_').replace(_reg2,'');
        return _file;
    };
})();
/*
 * 根据内容计算版本信息
 * @param  {String} _content 内容
 * @return {String}          版本
 */
var _doVersionFile = (function(){
    var _seed = +new Date;
    return function(_content){
        _content = _config.get('RAND_VERSION')
                 ? (''+(_seed++)) : _content;
        return _util.md5(_content);
    };
})();
/*
 * 资源文件带上版本信息
 * @param  {String} _file 原始文件地址
 * @return {String}       带版本信息地址
 */
var _doVersionResource = function(_file){
    // ignore if
    // - no STATIC_VERSION config
    // - resource has version in path (with ? or #)
    // - resource is not exist
    // - resource is dir
    if (!_config.get('STATIC_VERSION')||
         _file.indexOf('?')>=0||
         _file.indexOf('#')>=0||
        !_path.exist(_file)||
         _fs.isdir(_file))
        return _file;
    return _file+'?'+_doVersionFile(_fs.content(_file));
};
/*
 * 遍历结果集文件
 * @param  {Object}   _result   结果集
 * @param  {Function} _callback 回调函数
 * @return {Void}
 */
var _doEachResult = (function(){
    var _prefix = ['pg_','tp_'];
    return function(_result,_callback){
        for(var x in _result){
            for(var i=0,l=_prefix.length;i<l;i++){
                _callback(_result[x],_prefix[i],x);
            }
        }
    };
})();
/*
 * 文件名转序号标识
 * @param  {String} 文件路径
 * @return {String} 序号标识
 */
var _doGenFileKey = (function(){
    var _index = 1,
        _cache = {};
    return function(_file){
        var _key = _cache[_file];
        if (!_key){
            _key = ''+(_index++);
            _cache[_file] = _key;
        }
        return _key;
    };
})();
/*
 * 解析HTML文件
 * @param  {String} _file 文件路径
 * @param  {Object} _conf 配置信息
 * @return {Object}       文件信息
 */
var __doParseHtml = (function(){
        // tag line
        // ignore ie conditional comment
    var _reg0  = /^\s*<!--\s*(.+?)\s*-->\s*$/,
        _reg00 = /<!\s*\[/,    // for <![endif]--> or <!-- <![endif]-->
        _reg01 = /<!--\s*\[/,  // for <!--[if lte IE 7]> or <!--[if !IE]> -->
        // stylesheet
        _reg10 = /<link[\w\W]*?rel\s*=\s*["']stylesheet["']/i,
        _reg11 = /<link[\w\W]*?href\s*=\s*["'](.*?)["']/i,
        _reg12 = /<style\b/i,
        _reg13 = /<\/style>/i,
        // script
        _reg20 = /<script[^>]*?src\s*=\s*["'](.*?)["']/i,
        _reg21 = /^\s*<script\b/i,
        _reg22 = /<\/script>\s*$/i,
        // template
        _reg30 = /<textarea.*?name\s*=\s*["'](js|css|html)["']/i,
        _reg31 = /<\/textarea>/i,
        // html manifest
        _reg40 = /^\s*<html(.*?)>\s*$/i;
    // check core param in define tag
    var _hasCore = function(_txg,_name){
        if (!_txg.end&&_txg.name==_name){
            var _param = _txg.param||{},
                _core = _param.core;
            return _core===!0||_core===!1;
        }
    	return !1;
    };
    // check core file inline flag
    var _isInline = function(_txg,_name){
    	return !_txg.end&&_txg.name==_name&&
    	      !!_txg.param&&!!_txg.param.inline;
    };
    return function(_file,_conf){
        _root = path.dirname(_file)+'/';
        _log.info('parse %s',_file);
        var _list = _fs.read(_file,
            _config.get('FILE_CHARSET')),
            _wrot = _config.get('DIR_SOURCE'),
            _rmode = _config.get('X_RELEASE_MODE');
        if (!_list||!_list.length){
            _log.warn('empty file %s',_file);
            return null;
        }
        // pg_js   [Array]  - js in html
        // pg_css  [Array]  - css in html
        // tp_js   [Array]  - js in template
        // tp_css  [Array]  - css in template
        // tp_mdl  [Array]  - embed module in template
        // tp_html [Array]  - embed html in template
        // source  [String] - html code after parse
        var _result = {},  // parse result
            _tag    = {},  // tag info  {name:'',param:{},brr:[],type:'',arr:[]}
            _source = [];  // html code list
        if (_config.get('X_NOCOMPRESS')) _tag.brr = [];
        for(var i=0,l=_list.length,_line,_tmp,_txg,_rot;i<l;i++){
            _line = _list[i];
            // manifest
            if (_tag.name=='MANIFEST'&&_reg40.test(_line)){
                delete _tag.name;
                delete _tag.param;
                _line = util.format('<html%s %s>',RegExp.$1,'#<MANIFEST>');
            }
            // tag line
            if (_reg0.test(_line)&&
               !_reg00.test(_line)&&
               !_reg01.test(_line)){
                _txg = __doParseHtmlTAG(
                         RegExp.$1,_tag,_source);
                // save tag param
                // <!-- @STYLE {core:true,inline:true} -->
                // <!-- @DEFINE {core:true,inline:true} -->
                // <!-- @SCRIPT {core:true,inline:true} -->
                if (_hasCore(_txg,'STYLE'))
                    _result.css = _txg.param.core;
                if (_isInline(_txg,'STYLE'))
                    _result.icss = !0;
                if (_hasCore(_txg,'DEFINE')||
                    _hasCore(_txg,'SCRIPT'))
                    _result.js = _txg.param.core;
                if (_isInline(_txg,'DEFINE')||
                    _isInline(_txg,'SCRIPT'))
                    _result.ijs = !0;
                continue;
            }
            // ignore test content
            var _param = _tag.param||{},
                _mode = _param.mode||'online';
            if (_tag.name=='IGNORE'&&
                _mode.indexOf(_rmode)>=0){
                continue;
            }
            // do nothing
            if (_tag.name=='NOPARSE'){
                (_tag.brr||_source).push(_line);
                continue;
            }
            // external style
            if (_reg10.test(_line)&&
                _reg11.test(_line)){
                __doParseHtmlERS(_result,'pg_css',
                _doAbsolutePath(RegExp.$1.split('?')[0],_root));
                continue;
            }
            // inline style start tag <style type="text/css">
            if (_reg12.test(_line)){
                _tag.type = 'pg_css';
                __doParseHtmlIRSStart(_tag,_result);
            }
            // inline style end tag </style>
            if (_reg13.test(_line)){
                if (_tag.type!='pg_css'){
                    _log.warn('error inline style end tag!');
                }else{
                    __doParseHtmlIRSEnd(
                        _tag,_result,_line,
                        _tag.brr||_source,_file
                    );
                }
                continue;
            }
            // external script
            if (_reg20.test(_line)){
                _line = RegExp.$1.split('?');
                _line[0] = _doAbsolutePath(_line[0],_root);
                if (_tag.name=='DEFINE'||
                    _tag.name=='SCRIPT'){
                    delete _tag.name;
                    var _param = _tag.param||{};
                    delete _tag.param;
                    if (!_param.nodep){
                        __doParseHtmlDefine(
    					 _line.join('?'),_conf,_root);
                        continue;
                    }else{
                        __doParseHtmlDefine('',_conf,_root);
                    }
                }
                __doParseHtmlERS(_result,'pg_js',_line[0]);
                continue;
            }
            // inline script start tag <script type="text/javascript">
            if (_reg21.test(_line)){
                _tag.type = 'pg_js';
                __doParseHtmlIRSStart(_tag,_result);
            }
            // inline script end tag </script>
            if (_reg22.test(_line)){
                if (_tag.type!='pg_js'){
                    _log.warn('error inline script end tag!');
                }else{
                    __doParseHtmlIRSEnd(
                        _tag,_result,_line,
                        _tag.brr||_source,_file
                    );
                }
                continue;
            }
            // template
            if (_tag.name=='MODULE'||
                _tag.name=='TEMPLATE'){
                // resource template start tag <textarea name="js|css|html" ...
                if (_reg30.test(_line)){
                    _tag.type = RegExp.$1;
                    if (!_tag.arr)
                        _tag.arr  = [];
                }
                // resource template end tag </textarea>
                if (!!_tag.type
                    &&_reg31.test(_line)){
                    _tag.arr.push(_line.trim());
                    if (_tag.name=='MODULE'&&_tag.type=='html')
                        _tag.type = 'mdl';
                    // external template path must in DIR_SOURCE
                    _rot = _root;
                    if (_rot.indexOf(_wrot)<0){
                        _rot = _wrot;
                    }
                    __doParseHtmlTemplate(_tag,_result,_rot);
                    continue;
                }
            }
            // style/script/template content
            if (!!_tag.type){
                _tag.arr.push(_line.trim());
                continue;
            }
            // save line
            if (!!_tag.brr){
                _tag.brr.push(_line);
            }else if(!_util.blank(_line)){
                _source.push(_line.trim());
            }
        }
        if (!!_tag.brr)
            _source.push(_tag.brr.join('\n'));
        _result.source = _source.join(' ');
        __doParseHtmlModule(_result);
        return _result;
    };
})();
/*
 * 解析标记行
 * @param  {String} _line   标记内容
 * @param  {Object} _last   上一个标记信息
 * @param  {Array}  _result 解析结果
 * @return {Object}         标记信息
 */
var __doParseHtmlTAG = (function(){
    var _tag2obj = function(_tag){
        var _result = {};
        if (_tag.indexOf('/')==0)
            _result.end = !0;
        var _beg = _tag.indexOf('@')+1,
            _end = _tag.search(/\s|{|$/);
        _result.name = _tag.substring(_beg,_end).toUpperCase();
        var _code = _tag.substring(_end,_tag.length).trim();
        _result.param = !_code?null:_util.eval(util.format('(%s)',_code));
        return _result;
    };
    return function(_line,_last,_result){
        // comment line
        if (_line.indexOf('@')<0){
        	_log.info('ignore comment line: %s',_line);
        	return {};
        }
        // tag line
        var _tag  = _tag2obj(_line);
        !_tag.end ? __doParseHtmlTAGStart(_tag,_last,_result)
                  : __doParseHtmlTAGEnd(_tag,_last,_result);
        return _tag;
    };
})();
/*
 * 解析起始标记
 * @param  {Object} _tag    当前标记信息
 * @param  {Object} _last   上一个标记信息
 * @param  {Array}  _result 结果收集队列
 * @return {Void}
 */
var __doParseHtmlTAGStart = function(_tag,_last,_result){
    var _list = _last.brr||_result;
    switch(_tag.name){
        case 'NOCOMPRESS':
            if (_config.get('X_NOCOMPRESS')) return;
            if (!!_last.brr){
                _log.warn('duplicated start tag[NOCOMPRESS],ignore start tag!');
            }else if(!!_last.name&&_last.name!='TEMPLATE'){
                _log.warn('error nested start tag[NOCOMPRESS],ignore start tag!');
            }else{
                _last.brr = [];
            }
        break;
        case 'STYLE':
            _list.push('#<PG_CSS>');
        break;
        case 'TEMPLATE':
        case 'VERSION':
        case 'NOPARSE':
        case 'MODULE':
        case 'DEFINE':
        case 'SCRIPT':
        case 'IGNORE':
        case 'MANIFEST':
            if (!!_last.name){
                _log.warn('start tag[%s] before end tag[%s],ignore start tag!',_tag.name,_last.name);
            }else{
                _last.name = _tag.name;
                _last.param = _tag.param;
                if (_tag.name=='DEFINE'||
                    _tag.name=='SCRIPT'){
                	_list.push('#<PG_JS>');
                }
                if (_tag.name=='VERSION'){
                    _list.push('#<VERSION>');
                }
            }
        break;
        default:
            _log.warn('unknown start tag[%s],igonre start tag!',_tag.name);
        break;
    }
};
/*
 * 解析结束标记
 * @param  {Object} _tag    当前标记信息
 * @param  {Object} _last   上一个标记信息
 * @param  {Array}  _result 结果收集队列
 * @return {Void}
 */
var __doParseHtmlTAGEnd = function(_tag,_last,_result){
    var _list = _last.brr||_result;
    switch(_tag.name){
        case 'NOCOMPRESS':
            if (_config.get('X_NOCOMPRESS')) return;
            if (!_last.brr){
                _log.warn('no start tag[NOCOMPRESS],ignore end tag!');
            }else{
                _result.push(_last.brr.join('\n'));
                delete _last.brr;
            }
        break;
        case 'TEMPLATE':
            if (_last.name!='TEMPLATE'){
                _log.warn('error nested end tag[TEMPLATE],ignore end tag!');
            }else{
                _list.push('#<TP_HTML>#<TP_CSS>#<TP_JS>');
                delete _last.name;
                delete _last.param;
            }
        break;
        case 'MODULE':
            if (_last.name!='MODULE'){
                _log.warn('error nested end tag[MODULE],ignore end tag!');
            }else{
                _list.push('<!--TP_HTML-->');
                delete _last.name;
                delete _last.param;
            }
        break;
        case 'NOPARSE':
        case 'IGNORE':
            if (_last.name!=_tag.name){
                _log.warn('error nested end tag['+_tag.name+'],ignore end tag!');
            }
            delete _last.name;
            delete _last.param;
        break;
        default:
            _log.warn('unknown end tag[%s],igonre end tag!',_tag.name);
        break;
    }
};
/*
 * 解析外链资源
 * @param  {Object} _result 结果集
 * @param  {String} _type   类型
 * @param  {String} _src    外链地址
 * @return {Void}
 */
var __doParseHtmlERS = function(_result,_type,_src){
    var _arr = _result[_type];
    if (!_arr){
        _arr = [];
        _result[_type] = _arr;
    }
    _arr.push(_src);
};
/*
 * 解析内联资源起始标签
 * @param  {Object} _tag    标签信息
 * @param  {Object} _result 解析结果
 * @return {Void}
 */
var __doParseHtmlIRSStart = function(_tag,_result){
    if (!_tag.arr)
        _tag.arr = [];
    if (!_result[_tag.type])
        _result[_tag.type] = [];
};
/*
 * 解析内联资源结束标签
 * @param  {Object} _tag    标签信息
 * @param  {Object} _result 解析结果
 * @param  {String} _line   最后一行信息
 * @param  {Array}  _cache  源码缓存
 * @return {Void}
 */
var __doParseHtmlIRSEnd = (function(){
    var _reg = /<\/?(style|script)[\w\W]*?>/gi;
    var _isIgnore = function(_type){
        var _nopsfg = _config.get('X_NOPARSE_FLAG');
        return ((_nopsfg==1||_nopsfg==3)&&_type.indexOf('cs')>0)||
               ((_nopsfg==2||_nopsfg==3)&&_type.indexOf('js')>0);
    };
    var _doComplete = function(_dir,_root){
        if (_dir.indexOf('/')==0){
            // for /a/b/c/
            _root = _config.get('DIR_WEBROOT');
        }else{
            // for ./a/ or ../b/
            _root = path.dirname(_root)+'/';
        }
        return _path.url(_dir,_root);
    };
    return function(_tag,_result,_line,_cache,_file){
        _tag.arr.push(_line.trim());
        var _source = _tag.arr.join('\n'),
            _code = _source.replace(_reg,'').trim();
        if (_tag.name=='VERSION'){
            // dump VERSION
            delete _tag.name;
            delete _tag.param;
            // dump location.config.root
            var location = {};
            try{eval(_code);}catch(e){}
            if (!_result.config){
                _result.config = {};
            }
            var _root = (location.config||{}).root||'./',
                _xrot = _doComplete(_root,_file);
            _result.config.root = _root;
            _result.config.dir = _xrot;
            // try to complete template root
            ['mdl','html'].forEach(function(_name){
                var _list = _result['tp_'+_name];
                if (!_list||!_list.length) return;
                _list.forEach(function(_name,_index,_xlist){
                    _xlist[_index] = _name.replace('#<root>',_xrot);
                });
            });
        }else if(_isIgnore(_tag.type)){
            // check ignore inline script
            _cache.push(_source);
        }else if(!!_code){
            // cache code
            _result[_tag.type].push(_code);
        }
        delete _tag.arr;
        delete _tag.type;
    };
})();
/*
 * 解析模块版本信息标记脚本
 * @param  {Object} _tag 标记信息
 * @return {Void}
 */
// var __doParseHtmlVersion = function(_tag){
    // delete _tag.arr;
    // delete _tag.type;
    // delete _tag.name;
    // delete _tag.param;
// };
/*
 * 解析依赖库文件地址
 * @param  {String} _url  库文件地址
 * @param  {Object} _conf 配置信息
 * @param  {String} _root 当前文件所在目录
 * @return {Void}
 */
var __doParseHtmlDefine = (function(){
    var _reg9 = /(cef|ios|win|android)/,
        _pmap = {win:'trident-1'},
        _bmap = {
            gk:'gecko',wk:'webkit',pt:'presto',
            td:['trident-1','trident','trident-0'], // for ie6+
           'td-0':['trident-1','trident'],          // for ie7+
           'td-1':'trident-1'                       // for ie10+
        };
    var _platform = function(_config){
        var _root = {};
        if (!_config)
            _config = 'td|gk|wk|pt';
        _root.platform = _config;
        // hybrid development
        if (_reg9.test(_config)){
            var _name = RegExp.$1;
            _root.platform = _name=='win'?'td-1':'wk';
            _root['native'] = '{lib}native/'+_name+'/';
            _root['patch']  = '{lib}patched/'+(_pmap[_name]||'webkit')+'/';
            return _root;
        }
        // browser development
        _root.patch = [];
        var _arr = _config.split('|');
        for(var i=0,l=_arr.length,_name;i<l;i++){
            _name = _bmap[_arr[i]];
            if (!_name) continue;
            if (util.isArray(_name))
                for(var j=0,k=_name.length;j<k;j++)
                    _root.patch.push('{lib}patched/'+_name[j]+'/');
            else
                _root.patch.push('{lib}patched/'+_name+'/');
        }
        return _root;
    };
    return function(_url,_conf,_root){
        var _arr   = _url.split('?'),
            _query = query.parse(_doMerge(_arr[1])||''),
            _roots = _platform(_config.get('NEJ_PLATFORM')||_query.p);
        delete _query.p;
        delete _query.c;
        var _deps = _query.d;
        delete _query.d;
        var _cfrot = _conf.root||{};
        // pro/com/...
        for(var x in _query)
            _cfrot[x] = _doAbsolutePath(_query[x],_root);
        if (!_cfrot.pro)
            _cfrot.pro = _doAbsolutePath('../javascript/',_root);
        // patch/native
        _conf.platform = _roots.platform;
        delete _roots.platform;
        for(var x in _roots)
            _cfrot[x] = _roots[x];
        // lib
        _cfrot.lib = _config.get('NEJ_DIR')||
                     (path.dirname(_arr[0])+'/');
        _cfrot.platform = './platform/';
        _conf.root = _cfrot;
        // dependency config
        if (!!_deps){
            __doParseHtmlDepConf(
                _doAbsolutePath(_deps,_root),_conf
            );
        }
    };
})();
/*
 * 解析资源模板信息
 * @param  {Object} _tag    标记信息
 * @param  {Object} _result 结果收集对象
 * @param  {String} _root   文件所在目录
 * @return {Void}
 */
var __doParseHtmlTemplate = (function(){
    var _reg0 = /<textarea[\w\W]*?data-src\s*=\s*["'](.*?)["']/i,
        _reg1 = /^\s*<textarea[\w\W]*?>/i,
        _reg2 = /<\/textarea>\s*$/i;
    return function(_tag,_result,_root){
        var _src,_code,
            _content = _tag.arr.join('\n');
        if (_reg0.test(_content))
            _src = RegExp.$1;
        _code = _content.replace(_reg1,'')
                        .replace(_reg2,'').trim();
        var _list = _result['tp_'+_tag.type];
        if (!_list){
            _list = [];
            _result['tp_'+_tag.type] = _list;
        }
        if (!!_src){
            _src = _src.split(',');
            for(var i=0,l=_src.length,_url;i<l;i++){
                _url = _doAbsolutePath(_src[i],_root);
                if (_path.exist(_url)){
                    _list.push(_url);
                }else{
                    _list.push('#<root>'+_src[i]);
                    _log.warn('external template[%s] not exist and try to use location config later',_url);
                }
            }
        }
        if (!!_code) _list.push(_code);
        delete _tag.arr;
        delete _tag.type;
    };
})();
/*
 * 解析页面中使用的模块资源
 * @param  {Object} _result 解析结果
 * @return {Void}
 */
var __doParseHtmlModule = function(_result){
    // check tp_mdl and revert to template 
    var _xlist = _result.tp_mdl,
        _xcode = _result.source;
    if (!_xlist||!_xlist.length) return;
    // check define flag
    var _wrap = _config.get('X_MODULE_WRAPPER');
	if (_xcode.indexOf('#<PG_JS>')>=0){
	    var _module = util.format(_wrap,'#<TP_MDL>');
		_result.source = _xcode.replace('<!--TP_HTML-->','')
		                       .replace('#<PG_JS>',_module+'#<PG_JS>');
	}else{
		// revert to template 
    	var _list = _result.tp_html||[];
    	_list.push.apply(_list,_xlist);
    	_result.tp_html = _list;
    	delete _result.tp_mdl;
    	_result.source = _xcode.replace(
    	    '<!--TP_HTML-->',util.format(_wrap,'#<TP_HTML>')
    	);
	}
};
/*
 * 解析页面中使用的静态资源的路径
 * @param  {Object} _result 解析结果
 * @return {Void}
 */
var __doParseHtmlResource = (function(){
    var _reg0 = /(\n\/\/#\ssourceMappingURL=)([^#<>]*?)\s/ig;
    var _isRelative = function(_url){
        return _url.indexOf('.')==0||
              (_url.indexOf(':')<0&&
               _url.indexOf('/')!=0);
    };
    var _doTryFix = function(_url,_split){
        if (!_isRelative(_url)) return;
        var _uri,_cout = 1,_test = '',
            _otpt = _config.get('DIR_SOURCE');
        while(_cout<10){
            _uri = _doAbsolutePath(_url,_otpt+_test);
            if (_path.exist(_uri)){
                return util.format('%s#<%s:%s>%s',
                      _split,_cout,_uri,_split);
            }
            _cout++;
            _test += 'xx/';
        }
    };
    var _doComplete = function(_content,_file){
        var _tmpl = '%s#<:%s>%s',
            _base = path.dirname(_file)+'/',
            _root = _config.get('DIR_OUTPUT_STATIC');
        // source map relative to static output
        _content = (_content||'').replace(
            _reg0,function($1,$2,$3){
                return util.format(
                    '%s#<js:%s> ',
                    $2,_path.path($3,_root)
                );
            });
        return _content.replace(
                _config.get('DIR_STATIC_REG'),
                function($1,$2,$3){
                    var _url = _doAbsolutePath($3,_base);
                    if (_path.exist(_url))
                        return util.format(_tmpl,$2,_url,$2);
                    // try to fix path
                    return _doTryFix($3,$2)||$1;
                });
    };
    return function(_result){
        var _fobj,
            _files = _result.files;
        for(var x in _files){
            _fobj = _files[x];
            _fobj.source = _doComplete(_fobj.source,x);
        }
    };
})();
/**
 * 解析依赖配置文件
 * @param  {String} _file 路径
 * @return {Void}
 */
var __doParseHtmlDepConf = (function(){
    var _xconf;
    NEJ.deps = function(_maps){
        //console.log('deps config map -> %j',_maps);
        if (!_maps) return;
        var _deps = _xconf.deps,
            _root = _xconf.root;
        for(var x in _maps){
            //console.log('add dep config -> %s:%j',x,_maps[x]);
            var _file = [x];
            // complete file uri
            __doParseJSPath(_file,_root);
            _file = _file[0];
            // complete all dep files uri
            __doParseJSPath(_maps[x],_root);
            _deps[_file] = _maps[x];
            //console.log('add dep config +> %s:%j',_file,_maps[x]);
        }
    };
    NEJ.config = NEJ.deps;
    return function(_file,_conf){
        //console.log('deps config file -> %s',_file);
        var _list = _fs.read(
            _file,_config.get('FILE_CHARSET')
        );
        //console.log('deps file content -> %j',_list);
        if (!_list||!_list.length) return;
        if (!_conf.deps){
            _conf.deps = {};
        }
        _xconf = _conf;
        eval(_list.join('\n'));
    };
})();
/**
 * 分析需要解析的文件列表
 * @param  {String} _dir    目录
 * @param  {Object} _result 结果集
 * @return {Void}
 */
var __doListHtmlFile = function(_dir,_result){
    try{
        if (!_dir) return;
        var _list = fs.readdirSync(_dir);
        if (!_list&&!_list.length){
            _log.warn('no file to parse! %s',_dir);
        }else{
            if (!_result.conf) _result.conf = {root:{}};
            if (!_result.files) _result.files = {};
            if (!_result.manifest) _result.manifest = {};
            for(var i=0,l=_list.length,_file,_data,
                _reg = _config.get('FILE_SUFFIXE'),
                _reg1 = _config.get('FILE_FILTER');i<l;i++){
                _file = _list[i];
                if (_util.svn(_file)){
                    continue;
                }
                _file = _dir+_file;
                if (_fs.isdir(_file)){
                    __doListHtmlFile(_file+'/',_result);
                    continue;
                }
                if ((!!_reg&&!_reg.test(_file))||
                    (!!_reg1&&!_reg1.test(_file))||
                     !!_result.files[_file]){
                     continue;
                 }
                _data = __doParseHtml(_file,_result.conf);
                if (!!_data){
                    _result.files[_file] = _data;
                    _log.debug('%s -> %j',_file,_data.pg_js||_data.tp_js);
                }
            }
        }
    }catch(e){
        _log.error('can\'t list files \n %s',e.stack);
    }
};
/*
 * 解析脚本列表
 * @param  {Array}  _list   脚本列表
 * @param  {Object} _result 结果集
 * @param  {String} _owner  列表所在文件
 * @return {Void}
 */
var __doParseJSList = (function(){
    var _reg0 = /\.js$/i,
        _reg1 = /[\n\r]/g;
    return function(_list,_result,_owner){
        if (!_result.deps) _result.deps = {};
        // merge deps config
        var _xmap = _result.conf.deps;
        if (!!_xmap){
            var _deps = _result.deps;
            for(var x in _xmap){
                _deps[x] = _xmap[x];
            }
            delete _result.conf.deps;
        }
        //_log.info('---------------------> %j',_result.deps);
        if (!_result.data) _result.data = {};
        if (!_result.owner) _result.owner = {};
        if (!_list||!_list.length) return;
        __doParseJSPath(_list,_result.conf.root);
        for(var i=0,l=_list.length,_file;i<l;i++){
            _file = _list[i];
            // has content
            if (!!_result.data[_file])
                continue;
            // need download
            if (_path.remote(_file)){
                __doDownloadExternalJS(_file,_result);
                continue;
            }
            // as source code
            if (!_path.exist(_file)){
                if (_reg0.test(_file)){
                    _log.error('js file not exist -> %s',_file);
                }else{
                    var _text = _file.substr(0,100).replace(_reg1,' ');
                    _log.warn('see uri as js source code -> %s ...',_text);
                }
                _list[i] = 'js-code-'+(_result.rmap.seed++);
                _result.owner[_list[i]] = _owner;
                __doParseJSContent(_list[i],_file.split('\n'),_result);
                continue;
            }
            __doParseJSFile(_file,_file,_result);
        }
    };
})();
/*
 * 解析脚本文件
 * @param  {String} _alias  文件别名
 * @param  {String} _file   文件路径
 * @param  {Object} _result 解析结果集
 * @return {Void}
 */
var __doParseJSFile = function(_alias,_file,_result){
    // for remote file -> alias!=file
    if (!!_result.data[_alias]) 
        return;
    _log.info('parse %s',_alias);
    var _charset = _config.get('FILE_CHARSET');
    if (_alias.indexOf(
        _result.conf.root.lib)>=0) 
        _charset = 'utf-8';
    var _list = _fs.read(_file,_charset);
    if (!_list||!_list.length){
        _log.warn('empty file!');
        return;
    }
    var _handler = (_result.plugins||{})[_alias];
    if (!!_handler){
        _list = [_handler(_alias,_list.join(' '))];
    }
    __doParseJSContent(_alias,_list,_result);
};
/*
 * 解析脚本内容
 * @param  {String} _alias  文件别名
 * @param  {Array}  _list   文件内容
 * @param  {Object} _result 解析结果集
 * @return {Void}
 */
var __doParseJSContent = (function(){
    var f,
        _reg1 = /^\s*(NEJ\.)?define\(/,
        _reg2 = /;$/i,
        _reg3 = /\s/g,
        _reg4 = /(TR|WR|GR|TV|WV|GV)/i,
        _reg5 = /([<>=]=?)/,
        _reg6 = /td\-([01])/,
        _reg7 = /([\w-\.]+)[\>=](=?)[TWG]/i,
        _reg8 = /[TWG][RV][\<=](=?)([\w-\.]+)/i,
        _reg9 = /^\s*function\s*\((.*?)\)/,
        _rega = /\s*,\s*/,
        _regb = /(return\s*[\w;\s$]+)\s*}\s*$/,
        _regc = /[\r\n]/g,
        _regd = /^[\.\{\/]/,
        _rege = /\.js$/i,
        _vark = '_k_',
        _pmap = {T:'trident',W:'webkit',G:'gecko'},
        _vmap = {R:'release',V:'version'},
        _emap = {T:'td',W:'wk',G:'gk'},
        _rmap = {0:'3.0',1:'6.0'},
        _imap = {
            text:function(u,c){
                return util.format(
                    'I$(%s,%s);',
                    _doGenFileKey(u),
                    JSON.stringify(c.replace(_regc,' '))
                );
            },
            json:function(u,c){
                return util.format(
                    'I$(%s,%s);',
                    _doGenFileKey(u),
                    JSON.stringify(JSON.parse(c))
                );
            },
            regular:function(u,c){
                return util.format(
                    'I$(%s,%s);',
                    _doGenFileKey(u),
                    rg.parse(c.replace(_regc,' '))
                );
            }
        };
    // complete path
    var _doCompletePath = function(_file,_root,_conf){
        var _arr = [_file];
        _doAbsolutePathList(_arr,_root);
        __doParseJSPath(_arr,_conf);
        return _arr[0];
    };
    // format arguments
    var _doFormatArgs = function(_uri,_deps,_callback){
        var _args = [null,null,null],
            _kfun = [
                function(_arg){return typeof(_arg)=='string';},
                util.isArray,
                _util.func
            ];
        for(var i=0,l=arguments.length,_it;i<l;i++){
            _it = arguments[i];
            for(var j=0,k=_kfun.length;j<k;j++){
                if (_kfun[j](_it)){
                    _args[j] = _it;
                    break;
                }
            }
        }
        return _args;
    };
    // parse max value for expression
    var _doParseExpMax = function(_exp){
        var _arr = [];
        // left
        if (_reg7.test(_exp)){
            _arr.push({
                v:RegExp.$1,
                e:RegExp.$2=='='
            });
        }
        // right
        if (_reg8.test(_exp)){
            _arr.push({
                v:RegExp.$2,
                e:RegExp.$1=='='
            });
        }
        // cal max value
        return _arr.sort(
            function(_left,_right){
                return _left.v>=_right.v?1:-1;
            }
        ).pop()||{v:'a'};
    };
    // parse platform expression
    var _isExpForPlatform = function(_exp,_platform){
        _log.info('compare platform %s with expression %s',_platform,_exp);
        // check expression
        if (!_reg4.test(_exp)){
            return !1;
        }
        // check platform
        var _key = _emap[RegExp.$1.split('')[0]];
        if (!_key||_platform.indexOf(_key)<0){
            return !1;
        }
        // not check version for no-trident or all trident
        if (_key!='td'||!_reg6.test(_platform)){
            return !0;
        }
        // check version  for trident
        // td-0 -> TR>=3.0 (ie>=7)
        // td-1 -> TR>=6.0 (ie>=10)
        var _min = _rmap[RegExp.$1],
            _res = _doParseExpMax(_exp);
        _log.info('compare %s with %j',_min,_res);
        return _res.v>_min||(_res.e&&_res.v==_min);
    };
    // parse expression to if condition
    var _doParseExp2Cond = function(_exp){
        _exp = (_exp||'').replace(_reg3,'');
        if (!_reg4.test(_exp)){
            return 'false';
        }
        // parse platform
        var _result = [], 
            _name = RegExp.$1,
            _arr = _name.split('');
        // check platform code
        _result.push(util.format(
            "%s.engine=='%s'",
            _vark,_pmap[_arr[0]]
        ));
        // check version code
        var _ver = _vark+'.'+_vmap[_arr[1]],
            _brr = _exp.split(_name),_tmp;
        // left
        _tmp = _brr[0];
        if (!!_tmp){
            // 6<=  ->  '6'<=xxx.xxx
            _result.push("'"+_tmp.replace(_reg5,"'$1")+_ver);
        }
        // right
        _tmp = _brr[1];
        if (!!_tmp){
            // <=6  ->  xxx.xxx<='6'
            _result.push(_ver+_tmp.replace(_reg5,"$1'")+"'");
        }
        return _result.join('&&');
    };
    // parse platform index
    var _doParsePlatformIndex = function(_list,_result){
        if (!_list||!_list.length) return -1;
        var _r1 = '{lib}base/platform.js',
            _r2 = _result.conf.root.lib+'base/platform.js';
        for(var i=0,l=_list.length,_it;i<l;i++){
            _it = _list[i];
            if (_it==_r1||_it==_r2){
                return i;
            }
        }
        return -1;
    };
    // parse platform patch param
    var _doParsePlatformParam = function(_code){
        if (!_reg9.test(_code)){
            return null;
        }
        var _args = RegExp.$1;
        if (!_args){
            return null;
        }
        return _args.split(_rega);
    };
    // parse platform patch return
    var _doParsePlatformReturn = function(_code){
        if (_regb.test(_code)){
            return RegExp.$1;
        }
        return '';
    };
    // generate param
    var _doGenFuncParam = function(_list,_deps,_result){
        if (!_deps||!_deps.length) return;
        __doParseJSPath(_deps,_result.conf.root);
        for(var i=0,l=_deps.length;i<l;i++){
            _list.push(_doGenFileKey(_deps[i]));
        }
    };
    // complete amd path
    var _doCompleteAMDPath = function(_uri,_conf,_type){
        if (util.isArray(_uri)){
            for(var i=0,l=_uri.length;i<l;i++){
                _uri[i] = _doCompleteAMDPath(_uri[i],_conf,_type);
            }
            return _uri;
        }
        // start with . or {xx} or /xx/xx
        // end with .js
        if (_regd.test(_uri)||_rege.test(_uri)){
            return _uri;
        }
        // lib/base/klass -> {lib}base/klass.js
        // pro/util/a     -> {pro}util/a.js
        var _arr = _uri.split('/'),
            _xpth = _conf[_arr[0]],
            _sufx = !_type?'.js':'';
        if (!!_xpth){
            _arr.shift();
            return _xpth+_arr.join('/')+_sufx;
        }
        // for base/klass -> {lib}base/klass.js
        return '{lib}'+_arr.join('/')+_sufx;
    };
    // parse nej patch
    var _doParseNEJPatchCode = function(_map,_owner,_result,_alias){
        var _code = _map.code||'';
        if (_code.indexOf('NEJ.patch')<0) return;
        // parse patch
        _log.info('parse NEJ.patch for %s',_alias);
        var _arr = [], // code
            _brr = [], // deps
            _xap = {}; // lock dup
        var _platform = _result.conf.platform;
        NEJ.patch = function(_exp,_deps,_callback){
            var _args = _doFormatArgs.apply(null,arguments);
            if (!_args[0]) return;
            // parse platform and version expression
            if (!_isExpForPlatform(_args[0],_platform)){
                _log.info('%s not match %s',_args[0],_platform);
                return;
            }
            // merge deps
            var _deps = _args[1],
                _argc = [],
                _rots = _result.conf.root;
            if (!!_deps){
                _doCompleteAMDPath(_deps,_rots);
                _doAbsolutePathList(_deps,_owner);
                __doParseJSPath(_deps,_rots);
                for(var i=0,l=_deps.length;i<l;i++){
                    _argc.push('I$('+_doGenFileKey(_deps[i])+')');
                }
                for(var i=0,l=_deps.length,_it;i<l;i++){
                    _it = _deps[i];
                    if (!_xap[_it]){
                        _xap[_it] = !0;
                        _brr.push(_it);
                    }
                }
                _log.info('fetch dependences from NEJ.patch -> %j',_deps);
            }
            // merge patch function code
            if (!!_args[2]){
                var _cond = _doParseExp2Cond(_args[0]);
                _log.info('%s -> %s',_args[0],_cond);
                _arr.push(
                    util.format(
                        'if (%s){(%s)(%s);}',
                        _cond,_args[2].toString(),_argc.join(',')
                    )
                );
            }
        };
        try{
            eval(util.format('(%s)()',_code));
        }catch(e){
            _log.info('parse NEJ.patch error -> %s',e);
        }
        // update patch file content
        if (_arr.length>0){
            var _index = _doParsePlatformIndex(
                _map.deps,_result
            );
            var _args = _doParsePlatformParam(_code)||[];
            var _pfix = _doParsePlatformReturn(_code);
            // fix non-platform dependency
            if (_index<0){
                _map.deps = _map.deps||[];
                _map.deps.push('{lib}base/platform.js');
                _index = _map.deps.length-1;
                _args.splice(_index,0,'_p_');
            }
            // generate code
            _code = util.format(
                'function(%s){var %s = (CMPT?NEJ.P("nej.p"):arguments[%s])._$KERNEL;%s;%s}',
                _args.join(','),_vark,_index,_arr.join('\n'),_pfix
            );
        }
        _map.code = _code;
        if (_brr.length>0){
            _map.deps = _map.deps||[];
            _map.deps.push.apply(_map.deps,_brr);
        }
    };
    var _rst_ = null;
    NEJ.define = function(_uri,_deps,_callback){
        // define('',[],f);
        // define('',f);
        // define([],f);
        // define(f);
        var _args = _doFormatArgs.apply(null,arguments),
            _deps = _args[1]||null,
            _plugins = null;
        if (!!_deps){
            // split plugins
            for(var i=0,l=_deps.length,_it,_arr,_func,_type;i<l;i++){
                _type = '';
                _it = _deps[i];
                _arr = _it.split('!');
                _func = _imap[_arr[0].toLowerCase()];
                if (!!_func){
                    _type = _arr.shift();
                    _it = _arr.join('!');
                    if (!_plugins){
                        _plugins = {};
                    }
                }
                _it = _doCompleteAMDPath(
                    _it,_rst_.conf.root,_type
                );
                _deps[i] = _it;
                if (!!_func){
                    _plugins[_it] = _func;
                }
            }
        }
        return {
            plugins:_plugins,
            deps:_deps,ijct:_deps,
            code:(_args[2]||'').toString()
        };
    };
    return function(_alias,_list,_result){
        _rst_ = _result;
        //_log.info('========> %s',_alias);
        _list = _list||[];
        // parse js file content
        var _find = !1,
            _source = [];
        for(var i=0,l=_list.length,_line;i<l;i++){
            _line = (_list[i]||'').trim();
            if (_util.blank(_line)) continue;
            // define statement
            // define('',[],f) or NEJ.define('',[],f)
            if (_reg1.test(_line)){
                if (_find)
                    _log.warn('duplicated define in %s',_alias);
                _find = !0;
            }
            _source.push(_line);
        }
        var _map = {code:_source.join('\n')};
        if (_find){
            try{
                var define = NEJ.define,
                    _umap = eval(_map.code);
                _map = _umap||_map;
            }catch(e){
                // ignore if define is 3rd lib api
                _log.debug(e);
                _log.warn('3rd lib with define -> %s',_alias);
            }
        }
        var _owner = path.dirname(_result.owner[_alias]||_alias)+'/';
        // merge plugins 
        if (!!_map.plugins){
            var _pobj = _result.plugins;
            if (!_pobj){
                _pobj = {};
                _result.plugins = _pobj;
            }
            var _rots = _result.conf.root;
            for(var x in _map.plugins){
                _pobj[_doCompletePath(x,_owner,_rots)] = _map.plugins[x];
            }
        }
        // check NEJ.patch
        _doParseNEJPatchCode(_map,_owner,_result,_alias);
        // deps can from deps config file
        if (!!_map.deps||!_result.deps[_alias]){
            _result.deps[_alias] = _map.deps||[];
        }
        // complete {platform} and relative path
        var _deps = _result.deps[_alias];
        __doParseJSPlatform(_deps,_owner);
        // for inject code
        if (_map.ijct!==undefined){
            var _dxps = _map.ijct||[];
            __doParseJSPlatform(_dxps,_owner);
            var _argc = [_map.code];
            _doGenFuncParam(_argc,_dxps,_result);
            _map.code = util.format(
                'I$(%s,%s);',
                _doGenFileKey(_alias),
                _argc.join(',')
            );
            delete _map.ijct;
        }
        // for {lib}base/global.js
        var _r1 = '{lib}base/global.js',
            _r2 = _result.conf.root.lib+'base/global.js';
        if (_alias==_r1||_alias==_r2){
            _map.code = 'var I$=function(){var a={},b=[],c=function(){return!1},d={},e=function(b,c){return a.toString.call(b)==="[object "+c+"]"};return function(f,g){var h=d[f],i=e(g,"Function");if(null==g||i||(h=g),i){for(var j=[],k=2,l=arguments.length;l>k;k++)j.push(I$(arguments[k]));var m={};j.push.call(j,m,a,c,b);var n=g.apply(null,j)||m;if(h&&e(n,"Object"))if(Object.keys)for(var p,o=Object.keys(n),k=0,l=o.length;l>k;k++)p=o[k],h[p]=n[p];else for(var p in n)h[p]=n[p];else h=n}return h||(h={}),d[f]=h,h}}();\n'+_map.code;
        }
        // update result
        _result.data[_alias] = _map.code;
        _log.debug('dependency result: %s -> %j',_alias,_map.deps);
        __doParseJSList(_deps,_result,_alias);
        _rst_ = null;
    };
})();
/*
 * 解析平台适配
 * @param  {Array}  依赖列表
 * @param  {String} 列表所在文件
 * @return {Void}
 */
var __doParseJSPlatform = (function(){
    var _reg0 = /\\|\//;
    // {platform}xxx -> ['./platform/xxx','./platform/xxx.patch']
    // {platform}xxx.yy -> ['./platform/xxx.yy','./platform/xxx.patch.yy']
    var _doParsePlatformURI = function(_url,_root){
        var _uri = (_url||'').replace(
            '{platform}','./platform/'
        );
        var _arr = _uri.split(_reg0),
            _name = _arr.pop(),
            _rdir = _doAbsolutePath(_arr.join('/')+'/',_root),
            _patch = _name.split('.'),
            _sufix = '';
        // parse patch file
        if (_patch.length>1){
            _sufix = '.'+_patch.pop();
        }
        var _file = _rdir+_patch.join('.')+'.patch'+_sufix;
        // check platform/xxx.patch.yy
        if (!_path.exist(_file)){
            // check platform/xxx.yy
            _file = _rdir+_name;
            if (!_path.remote(_file)&&
                !_path.exist(_file)){
                _file = '';
            }
        }
        // check result
        if (!_file){
            _log.warn('no platform patch for %s in %s',_url,_root);
        }
        return _file;
    };
    return function(_deps,_root){
        if (!_deps||!_deps.length) return;
        // complete platform
        for(var i=0,_it;_it=_deps[i];i++){
            if (_it.indexOf('{platform}')>=0){
                _deps[i] = _doParsePlatformURI(_it,_root)||_it;
            }
        }
        // complete relative uri
        _doAbsolutePathList(_deps,_root);
    };
})();
/*
 * 解析脚本补丁信息
 * @param  {Array}  _list  脚本列表
 * @param  {Object} _conf  路径配置信息
 * @return {Void}
 */
var __doParseJSPath = (function(){
    var _reg = /{(.*?)}/gi,
        _reg1 = /([^:])\/+/g;
    var _complete = function(_file,_conf){
        return _file.replace(_reg,function($1,$2){
            return _conf[$2]||$1;
        }).replace(_reg1,'$1/');
    };
    return function(_list,_conf){
        if (!_list||!_list.length) return;
        var _native  = _conf['native'],
            _patched = _conf['patch'],
            _istring = !util.isArray(_patched);
        for(var i=_list.length-1,_name;i>=0;i--){
            _name = _list[i];
            // for source code
            if (_name.indexOf('{')!=0){
                continue;
            }
            // for path
            if (!!_native&&_name.indexOf('{native}')>=0){
                _list[i] = _name.replace('{native}',_native);
            }
            if (_name.indexOf('{patch}')>=0){
                if (_istring){
                    _list[i] = _name.replace('{patch}',_patched);
                }else{
                    _name = _name.replace('{patch}','');
                    _name = (_patched.join(_name+',')+_name).split(',');
                    _name.unshift(i,1);
                    _list.splice.apply(_list,_name);
                }
            }
        }
        for(var i=0,l=_list.length,_name;i<l;i++){
            _name = _list[i];
            //_log.info('++++++++> %s',_name);
            // for source code
            if (_name.indexOf('{')!=0){
                continue;
            }
            // for path
            _list[i] = _complete(_name,_conf);
        }
    };
})();
/*
 * 解析脚本依赖关系
 * @param  {Array}  _list   脚本列表
 * @param  {Object} _result 结果集
 * @return {Array}          整合了依赖关系的脚本列表
 */
var __doParseJSDependency = (function(){
    var _dependency = function(_list,_dmap,_test){
        if (!_list||!_list.length) 
            return null;
        var _result = [];
        for(var i=0,l=_list.length,_file,_files;i<l;i++){
            _file = _list[i];
            if (!!_test[_file])
                continue;
            _test[_file] = !0;
            _files = _dependency(_dmap[_file],_dmap,_test);
            if (!!_files&&_files.length>0)
                _result.push.apply(_result,_files);
            _result.push(_file);
        }
        return _result;
    };
    return function(_list,_result){
        return _dependency(_list,_result.deps,{});
    };
})();
/*
 * 解析样式文件
 * @param  {String} _file   文件路径
 * @param  {Object} _result 结果集
 * @return {Void}
 */
var __doParseCSFile = (function(){
    var _reg0 = /\.css$/i,
        _reg1 = /[\n\r]/g;
    return function(_file,_result,_owner){
        //_log.info('+++++> %s',_owner);
        if (!!_result.data[_file]) 
            return _file;
        var _list,
            _return = _file,
            _rmap = _result.rmap;
        if (!_rmap[_file]&&
            !_path.exist(_file)){
            if (_reg0.test(_file)){
                _log.error('css file not exist -> %s',_file);
            }else{
                var _text = _file.substr(0,50).replace(_reg1,' ');
                _log.warn('see uri as css source code -> %s ...',_text);
            }
            _return = 'cs-code-'+(_rmap.seed++);
            if (!_result.owner) _result.owner = {};
            _result.owner[_return] = _owner;
            _list = _file.split('\n');
        }else{
            _file = _rmap[_file]||_file;
            _list = _fs.read(_file,_config.get('FILE_CHARSET'));
        }
        __doParseCSContent(_return,_list,_result);
        return _return;
    };
})();
/*
 * 解析样式文件内容
 * @param  {String} _file   文件名
 * @param  {Array}  _list   内容列表
 * @param  {Object} _result 结果集
 * @return {Void}
 */
var __doParseCSContent = (function(){
    var _reg0 = /\/\*[\w\W]*?\*\//gi,
        _reg1 = /url\((.*?)\)/gi,
        _reg2 = /(?:^['"]+)|(?:['"]+$)/gi;
    return function(_file,_list,_result){
        var _content;
        _list = _list||[];
        for(var i=0,l=_list.length;i<l;i++)
            _list[i] = _list[i].trim();
        // parse resources in css
        _content = _list.join('').replace(_reg0,'');
        var _base = _file.indexOf('cs-code-')==0
                  ? _result.owner[_file] : _file;
        _base = path.dirname(_base)+'/';
        _content = _content.replace(_reg1,function($1,$2){
            if ($2.indexOf(':')>0){
                return $1;
            }
            return util.format(
                'url(%s)',_doAbsolutePath(
                    $2.replace(_reg2,''),_base
                 )
            );
        });
        _result.data[_file] = _content;
    };
})();
/*
 * 解析样式文件中引入的资源
 * @param  {String}  _file    样式输出文件
 * @param  {String}  _content 样式文件内容
 * @param  {Boolean} _inline  是否内联样式
 * @return {String}           解析后文件内容
 */
var __doParseCSResource = (function(){
    var _reg = /url\((.*?)\)/gi,
        _reg1 = /^(pg|tp)_/;
    var _exroot = function(_output,_file){
        //_log.info('relative image %s',_file);
        return _path.slash(path.relative(path.dirname(_output)+'/',_file));
    };
    var _inroot = function(_output,_file){
        //_log.info('absolute image %s',_file);
        return _file.replace(_config.get('DIR_WEBROOT'),_output);
    };
    return function(_file,_content,_inline){
        var _process = _exroot,
            _base = _file.replace(_reg1,''),
            _root = _config.get('DIR_WEBROOT');
        if (!!_inline){
            if (_config.get('DM_STATIC_RR')){
                _base = _base.replace(
                    _config.get('DIR_SOURCE'),
                    _config.get('DIR_OUTPUT')
                );
            }else{
                _base = _config.get('DM_STATIC');
                _process = _inroot;
            }
        }
        _content = (_content||'').replace(_reg,function($1,$2){
            if (!_path.exist($2)){
                _log.warn('%s in %s not exist!',$2,_file);
                return $1;
            }
            if ($2.indexOf(_root)<0){
                _log.warn('%s in %s not in webroot!',$2,_file);
            }
            //_log.info('%s in %s for %s ++++> %s',$2,_file,_base,xx);
            return util.format(
                'url(%s)',
                _process(_base,_doVersionResource($2))
            );
        });
        return _content;
    };
})();
/*
 * 检测文件下载情况
 * @param  {Object} _result 解析结果集
 * @return {Void}
 */
var __doDownloadCheck = function(_result){
    var _map = _result.rmap,
        _finished = !0;
    for(var x in _map){
        if (_map[x]===!0){
            _finished = !1;
            break;
        }
    }
    if (_finished)
        _result.ondownload();
};
/*
 * 下载样式文件
 * @param  {Array}  _list   样式文件列表
 * @param  {Object} _result 结果集
 * @return {Void}
 */
var __doDownloadExternalCS = function(_list,_result){
    if (!_list||!_list.length) return;
    var _map = _result.rmap,
        _tmp = _config.get('DIR_TEMPORARY');
    for(var i=0,l=_list.length,_file;i<l;i++){
        _file = _list[i];
        if (_path.remote(_file)&&!_map[_file]){
            _map[_file] = !0;
            _fs.download(_file,util
               .format('%s%s.css',_tmp,++_map.seed)
               ,function(_file,_local,_content){
                       _map[_file] = _local;
                       __doDownloadCheck(_result);
               });
        }
    }
};
/*
 * 下载脚本文件
 * @param  {String} _file   脚本文件
 * @param  {Object} _result 结果集
 * @return {Void}
 */
var __doDownloadExternalJS = function(_file,_result){
    var _map = _result.rmap,
        _tmp = _config.get('DIR_TEMPORARY');
    if (!!_map[_file]) return;
    _map[_file] = !0;
    var _xloc = util.format('%s%s.js',_tmp,++_map.seed);
    _log.debug('map %s -> %s.js',_file,_map.seed);
    _fs.download(_file,_xloc,
       function(_file,_local,_content){
             // error if file has been downloaded
             if (!!_map[_file]&&_map[_file]!=!0){
                 _log.error('download conflict %s : %s,%s',_file,_map[_file],_local);
             }
             _map[_file] = _local;
            //__doParseJSFile(_file,_local,_result);
            var _list;
            var _handler = (_result.plugins||{})[_file];
            if (!!_handler){
                _list = [_handler(_file,_content)];
            }else{
                _list = _content.split('\n');
            }
            __doParseJSContent(_file,_list,_result);
            __doDownloadCheck(_result);
       });
};
/**
 * 下载外联资源
 * @param  {Object} _result 解析结果集
 * @return {Void}
 */
var __doDownloadResource = function(_result){
    if (!_result.rmap)
         _result.rmap = {seed:+new Date};
    __doPrepareCore(_result);
    _doEachResult(_result.files,function(_fobj,_prefix,_file){
        // download css
        __doDownloadExternalCS(_fobj[_prefix+'css'],_result);
        // parse and download javascript
        __doParseJSList(_fobj[_prefix+'js'],_result,_file);
    });
    __doDownloadExternalCS(_result.core.cs,_result);
    __doParseJSList(_result.core.js,_result);
    __doParseJSPath(
        _result.mask.js,
        _result.conf.root
    );
	__doDownloadCheck(_result);
};
/*
 * 准备缓存结构
 * @param  {Object} _result 解析结果集
 * @return {Void}
 */
var __doPrepareCache = (function(){
    var _list = ['js','cs'];
    return function(_result){
        if (!!_result.output) return;
        var _core = _result.core;
        _core.js = __doParseJSDependency(_core.js,_result);
        _result.output = {
            core:{},
            js:{core:_core.js||[]},
            css:{core:_core.cs||[]}
        };
        // build core js/css maps
        /*
        var _cmap = _result.output.core;
        for(var i=0,l=_list.length,_files;i<l;i++){
            _files = _core[_list[i]];
            if (!_files||!_files.length) continue;
            for(var j=0,k=_files.length;j<k;j++){
                _cmap[_files[j]] = !0;
            }
        }
        */
        delete _result.core;
    };
})();
/*
 * 准备配置的core文件列表
 * @param  {Object} _result 解析结果集
 * @return {Void}
 */
var __doPrepareCore = (function(){
    var _list = ['js','cs'],
        _xmxp = {cs:'STYLE',js:'SCRIPT'},
        _xcfg = {core:'CORE_LIST_',mask:'CORE_MASK_'};
    var _complete = function(_list,_root){
        if (!_list||!_list.length) return;
        for(var i=0,l=_list.length;i<l;i++){
            // start with {lib} or prefix variable
            if (_list[i].indexOf('{')==0) continue;
            _list[i] = _doAbsolutePath(_list[i],_root);
        }
    };
    var _prepare = function(_name,_prefix,_result){
        var _core = _result[_name];
        if (!_core){
            _core = {};
            _result[_name] = _core;
        }
        for(var i=0,l=_list.length,_file,_cont,_ign;i<l;i++){
            // check ignore core config
            _ign = _config.get('X_NOCORE_'+_xmxp[_list[i]]); 
            if (_ign) continue;
            // core config in release.conf
            _file = _config.get(_prefix
                  + _list[i].toUpperCase());
            if (!_file) continue;
            if (util.isArray(_file)){
                _core[_list[i]] = _file;
                continue;
            }
            // core config from file
            _cont = _fs.read(_file);
            if (!_cont||!_cont.length) continue;
            _cont = _cont.join('').trim();
            if (!_cont) continue;
            _core[_list[i]] = _util.eval(util.format('(%s)',_cont));
        }
        var _root = _config.get('DIR_WEBROOT');
        _complete(_core.cs,_root);
        _complete(_core.js,_root);
    };
    return function(_result){
        for(var x in _xcfg){
            _prepare(x,_xcfg[x],_result);
        }
    };
})();
/*
 * 准备列表
 * @param  {Object} _result 解析结果集
 * @param  {Object} _conf   配置信息
 *                          type - 类型 js/css
 *                          lfuc - 预处理列表
 *                          ffuc - 预处理文件
 * @return {Void}
 */
var __doPrepareList = (function(){
    var _xmxp = {css:'STYLE',js:'SCRIPT'},
        _xmsk = {css:'cs',js:'js'};
    var f = function(){
        return !1;
    };
    var _split = function(_core,_mask){
        var _map = {};
        if (!!_mask&&_mask.length>0){
            for(var i=0,l=_mask.length;i<l;i++){
                _map[_mask[i]] = !0;
            }
        }
        _log.info('mask map -> %j',_map);
        for(var i=_core.length-1;i>=0;i--){
            if (!!_map[_core[i]]){
                _core.splice(i,1);
            }
        }
    };
    return function(_result,_conf){
        __doPrepareCache(_result);
        var _type = _conf.type,
            _xmap = {},
            _ocfg = _result.output[_type],
            _xlst = _ocfg.core,
            _fmap = _result.output.core,
            _iscf = _xlst.length>0||
                    _config.get('X_NOCORE_'+_xmxp[_type]);
        _doEachResult(_result.files,function(_fobj,_prefix,_owner){
            // pre-parse list
            var _list = _fobj[_prefix+_type];
            if (!_list||!_list.length) return;
            _list = (_conf.lfuc||f)(_list,_result)||_list;
            _fobj[_prefix+_type] = _list;
            for(var i=0,l=_list.length,_file;i<l;i++){
                // pre-parse file
                _file = _list[i];
                _file = (_conf.ffuc||f)(_file,_result,_owner)||_file;
                _list[i] = _file;
                if (_iscf||_fobj[_type]===!1) continue;
                // calculate file count
                if (!_xmap[_file])
                    _xmap[_file] = 0;
                _xmap[_file]++;
                if (_xmap[_file]==2){
                    _xlst.push(_file);
                }
            }
        });
        // mask core file 
        _split(_xlst,_result.mask[_xmsk[_type]]);
        for(var i=_xlst.length-1;i>=0;i--){
            _fmap[_xlst[i]] = !0;
        }
        _log.info('core %s file list -> %j',_type,_xlst);
        // split core from page
        var _output = _result.output[_type];
        _doEachResult(_result.files,function(_fobj,_prefix,_name){
            var _list = _fobj[_prefix+_type];
            if (!_list||!_list.length) return;
            if (_fobj[_type]!==!1){
                for(var i=_list.length-1;i>=0;i--){
                    if (!!_fmap[_list[i]]){
                        _fobj[_type] = !0;
                        _list.splice(i,1);
                    }
                }
            }
            _output[_prefix+_name] = _list;
            _log.info('%s for %s %s file list -> %j',
                      _prefix,_name,_type,_list);
        });
    };
})();
/**
 * 预处理样式文件
 * @param  {Object} _result 解析结果集
 * @return {Void}
 */
var __doPrepareCS = function(_result){
    __doPrepareList(_result,{
        type:'css'
       ,ffuc:__doParseCSFile
    });
    var _list = [],_arr,
        _data = _result.data,
        _output = _result.output.css,
        _split = '\n';
    for(var x in _output){
        _arr = [];
        _list = _output[x];
        for(var i=0,l=_list.length,_source;i<l;i++){
            _source = (_data[_list[i]]||'').trim();
            if (!!_source) _arr.push(_source);
        }
        _output[x] = _arr.join(_split).trim();
    }
};
/**
 * 预处理脚本文件
 * @param  {Object} _result 解析结果集
 * @return {Void}
 */
var __doPrepareJS = (function(){
    var _doCheckBags = function(_xmap){
        var _ret = null;
            _map = {};
        // count
        for(var x in _xmap){
            var _it = _xmap[x];
            if (!_map[_it]){
                _map[_it] = 0;
            }
            _map[_it]++;
        }
        // filter
        for(var x in _xmap){
            var _it = _xmap[x];
            if (_map[_it]>1){
                if (!_ret){
                    _ret = {};
                }
                _ret[x] = _it;
            }
        }
        return _ret;
    };
    return function(_result){
        __doPrepareList(_result,{
            type:'js'
           ,lfuc:__doParseJSDependency
        });
        var _options = {
            code_map:_result.data,
            obf_level:_config.get('OBF_LEVEL'),
            compatible:_config.get('OBF_COMPATIBLE'),
        };
        // check source map
        var _smped = _config.get('OBF_SOURCE_MAP'),
            _smrot = _config.get('DIR_SOURCE_MAP');
        if (_smped){
            _options.source_map = {
                root:_smrot,
                key2name:_doOutputFileName
            };
        }
        var _file = _config.get('OBF_NAME_BAGS'),
            _list = _fs.read(_file);
        if (!!_list&&!!_list.length){
            var _bags = _list.join('').trim();
            if (!!_bags){
                _options.bags = _util.eval(util.format('(%s)',_bags));
            }
        }
    	var _data = {bags:{},files:{}};
        try{
            _data = _obfuse.obfuscate(_result.output.js,_options);
        }catch(e){
            _log.error('obfuscate js error %s',e);
        }
        // output bags
        var _ebag = _doCheckBags(_data.bags);
        if (!!_ebag){
            _log.error('duplicate obfuscated name -> %j',_ebag);
        }
        _log.info('output %s',_file);
        _fs.write(_file,JSON.stringify(_data.bags,null,'\t'));
        // output source map
        if (_smped){
            var _root = _config.get('DIR_OUTPUT_STATIC');
            ['maps'].forEach(function(_key){
                var _map = _data[_key];
                if (!_map) return;
                for(var x in _map){
                    var _file = _path.path(_smrot+x,_root);
                    _log.info('output %s',_file);
                    _fs.write(_file,_map[x]);
                }
            });
        }
        _result.output.js = _data.files;
    };
})();
/*
 * 输出文件
 * @param  {String} _file    文件地址
 * @param  {String} _content 文件内容
 * @param  {String} _conf    配置信息
 *                           type - 类型 cs/js
 *                           mode - 模式 0/1[模板样式]
 *                           html - 文件所在页面文件路径，没有表示core文件
 * @return {String}          样式连接
 */
var __doExlineFile = (function(){
    var _tmap = {cs:['<link href="%s%s" type="text/css" rel="stylesheet"/>'
                    ,'<textarea name="css" data-src="#<cs:%s>" data-version="%s"></textarea>']
                ,js:['<script src="%s%s" type="text/javascript"></script>'
                    ,'<textarea name="js" data-src="#<js:%s>" data-version="%s"></textarea>']};
    return function(_file,_content,_conf){
        var _type = _conf.type;
        _log.info('output %s',_file);
        if (_type=='cs')
            _content = __doParseCSResource(_file,_content);
        _fs.write(_file,_content,_config.get('FILE_CHARSET'));
        var _root = '#<CORE>',_md5 = _doVersionFile(_content),
            _version = _config.get('NAME_SUFFIX')?'':((!_conf.mode?'?':'')+_md5);
        // not core file
        if (!!_conf.html)
            _root = _conf.mode==1?_file:_doRelativePath(
                    _type,_doOutputPath(_conf.html),_file);
        return {link:util.format(_tmap[_type][_conf.mode],_root,_version),version:_md5};
    };
})();
/*
 * 内联文件
 * @param  {String} _content 文件内容
 * @param  {String} _conf    配置信息
 *                           type - 类型 cs/js
 *                           mode - 模式 0/1[模板样式]
 * @return {String}          样式连接
 */
var __doInlineFile = (function(){
    var _regc = [/<\/(script)>/gi,/<\/(textarea)>/gi],
        _tmap = {
            cs:['<style type="text/css">%s</style>',
                '<textarea name="css">%s</textarea>'],
            js:['<script type="text/javascript">%s</script>',
                '<textarea name="js">%s</textarea>']
        };
    return function(_content,_conf){
        if (_conf.type=='js'){
            _content = _content.replace(_regc[_conf.mode],'<&#47;$1>');
        }
        return util.format(_tmap[_conf.type][_conf.mode],_content);
    };
})();
/*
 * 合并样式和脚本
 * @param  {Object} _result 解析结果集
 * @return {Void}
 */
var __doMergeCSandJS = (function(){
    var _reg = /#<((?:tp|pg)_(?:css|js))>/gi;
    return function(_result){
        var _data  = _result.output,
            _files = _result.files,
            _core  = _config.get('DIR_OUTPUT_STATIC')+'core'+
                     _config.get('NAME_SUFFIX')+'.',
            _fobj,_content,_value,_flag,_clink,_core;
        for(var x in _files){
            _fobj = _files[x];
            _content = _fobj.source;
            _files[x].source = _content
                     .replace(_reg,function($1,$2){
                     	  // 0 - tp/pg
                     	  // 1 - css/js
                          _flag = $2.toLowerCase().split('_');
                          switch(_flag[0]){
                              case 'pg':
                                  _value = '';
                                  _clink = _data[_flag[1]].core;
                                  // if has core file
                                  if (_fobj[_flag[1]]&&!!_clink){
                                  	  // check inline core
                                  	  if (_fobj['i'+_flag[1]]){
                                  	      _value = __doInlineFile(
	                                  	      	   __doParseCSResource(x,_data[_flag[1]+'_code'],!0),{
		                                  	           mode:0,
		                                  	           type:_flag[1].substr(0,2)
		                                  	       });
                                  	  }else{
	                                      _value = _clink.replace('#<CORE>',
	                                               _doRelativePath(_flag[1],
	                                               _doOutputPath(x),_core+_flag[1]));
                                  	  }
                                  }
                                  _value += _data[_flag[1]]['pg_'+x]||'';
                              break;
                              case 'tp':
                                  _value = _data[_flag[1]]['tp_'+x]||'';
                              break;
                          }
                          return _value;
                      });
        }
    };
})();
/*
 * 合并嵌套模板
 * @param  {Object} _result 解析结果集
 * @return {Void}
 */
var __doMergeTemplate = (function(){
    var _reg1 = /#<(js|cs|[\d]*?):(.*?)>/gi,
        _reg2 = /<meta.*?>/i,
        _tmpl = '<div style="display:none;" id="umi://%s">%s</div>';
    var _doMergeHTML = function(_file,_data,_test){
        var _fobj = _data[_file];
        if (!_fobj) return '';
        var _list = _fobj.tp_html;
        if (!_list||!_list.length)
            _list = '';
        if (!util.isArray(_list)){
            // template has been embeded
            _fobj.tp_html = _list;
        }else{
            // embed template
            var _arr = [];
            for(var i=0,l=_list.length,_name,_result;i<l;i++){
                _name = _list[i];
                if (!!_test[_name]) 
                    continue;
                _test[_name] = !0;
                _result = _doMergeHTML(_name,_data,_test);
                _arr.push(_result.replace(_reg2,''));
            }
            _fobj.tp_html = _arr.join('');
        }
        // merge template
        // don't use replace
        var _source = _fobj.source
                .split('#<TP_HTML>')
                .join(_fobj.tp_html);
        _fobj.source = _source;
        return _source;
    };
    var _doMergeModule = function(_file,_data){
    	var _fobj = _data[_file];
    	if (!_fobj) return;
    	var _list = _fobj.tp_mdl;
    	if (!_list||!_list.length) return;
    	var _input = (_fobj.config||{}).dir||'';
    	for(var i=0,l=_list.length,_src;i<l;i++){
    		_src = _list[i];
    		_list[i] = util.format(
    		    _tmpl,_src.replace(_input,''),
    		    _data[_src].source
    		);
    	}
    	_fobj.source = _fobj.source.split('#<TP_MDL>').join(_list.join(''));
    };
    var _doFixSource = function(_result){
        var _files = _result.files,
            _outpt = _config.get('DIR_OUTPUT');
        for(var x in _files){
            _files[x].source = 
            _files[x].source.replace(_reg1,
                function($1,$2,$3){
                    var _count = parseInt($2),
                        _file = _doVersionResource($3);
                    if (isNaN(_count))
                        return _doRelativePath($2,_doOutputPath(x),_file);
                    var _from = _outpt+new Array(_count).join('xx/')+'xx';
                    return _doRelativePath('',_from,_file);
                });
        }
    };
    return function(_result){
        // fix resource before embed template
        __doParseHtmlResource(_result);
        // merge template
        var _files = _result.files;
        for(var x in _files){
            _doMergeHTML(x,_files,{});
        }
        for(var x in _files){
            _doMergeModule(x,_files);
        }
        // fix resource after embed template
        __doParseHtmlResource(_result);
        // parse resource/js/css src
        _doFixSource(_result);
    };
})();
/*
 * 合并模块模板版本信息
 * @param  {Object} _result 解析结果集
 * @return {Void}
 */
var __doMergeVersion = (function(){
    var _template = '<script type="text/javascript">location.config = %j;</script>';
    var _doDumpManifest = function(_result){
        var _ver = {}, _arr = [],
            _root = _config.get('DIR_WEBROOT'),
            _input = _config.get('DIR_SOURCE'),
            _manifest = _result.manifest;
        for(var x in _result.files){
            var _file = _result.files[x];
            if (!!_file.config) _arr.push(x);
            if (x.indexOf(_input)<0) continue;
            _ver[x] = _doVersionFile(_file.source);
            _manifest[_doOutputPath(x).replace(_root,'/')] = _ver[x];
        }
        return {ver:_ver,list:_arr};
    };
    var _doFormatRoot = function(_root,_xdir){
        var _prefix = _config.get('DM_STATIC_MR');
        if (!_prefix) return _root;
        var _webr = _config.get('DIR_WEBROOT');
        return _prefix+_doOutputPath(_xdir).replace(_webr,'');
    };
    var _doDumpVersion = function(_root,_vers,_file){
        var _ret = {};
        for(var x in _vers){
            if (x.indexOf(_root)>=0&&x!=_file){
                _ret[x.replace(_root,'')] = _vers[x];
            }
        }
        return _ret;
    };
    return function(_result){
        var _conf = _doDumpManifest(_result);
        for(var i=0,l=_conf.list.length,_it,_file,_config;i<l;i++){
            _it = _conf.list[i];
            _file = _result.files[_it];
            _config = _file.config;
            _file.source = _file.source.replace(
                '#<VERSION>',util.format(_template,{
                    root:_doFormatRoot(_config.root,_config.dir),
                    ver:_doDumpVersion(_config.dir,_conf.ver,_it)
                })
            );
        }
    };
})();
/*
 * 调整链接地址
 * @param  {Object} 结果集
 * @return {Void}
 */
var __doMergeExlink = (function(){
    var _reg0 = /(\s+(?:src|href)\s*=\s*['"])(.*?)(['"])/gi;
    var _doParsePath = function(_path,_file){
        if (!_path||_path.indexOf('#')==0) return;
        var _source = _config.get('DIR_SOURCE'),
            _output = _config.get('DIR_OUTPUT'),
            _webrot = _config.get('DIR_WEBROOT'),
            _abpath = _doAbsolutePath(_path,path.dirname(_file)+'/');
        if (_abpath.indexOf(_source)<0) return;
        var _result = _abpath.replace(_source,_output).replace(_webrot,'/');
        _log.debug('adjust outlink %s -> %s',_path,_result);
        return _result;
    };
    return function(_result){
        if (!_config.get('X_AUTO_EXLINK_PATH')) return;
        var _files = _result.files,_file,
            _regud = _config.get('X_AUTO_EXLINK_REG');
        for(var x in _files){
            _file = _files[x];
            _file.source = (_file.source||'').replace(
                _reg0,function($1,$2,$3,$4){
                    var _new = _doParsePath($3,x);
                    if (!_new) return $1;
                    return util.format('%s%s%s',$2,_new,$4);
                }
            );
            if (!_regud) continue;
            _file.source = (_file.source||'').replace(
                _regud,function($1,$2,$3,$4){
                    var _new = _doParsePath($3,x);
                    if (!_new) return $1;
                    return util.format('%s%s%s',$2,_new,$4);
                }
            );
        }
    };
})();
/*
 * 输出样式
 * @param  {String} _name   类型,css/js
 * @param  {Object} _result 解析结果集
 * @return {Void}
 */
var __doOutputFile = (function(){
    var _file2url = function(_file){
        return _file.replace(_config.get('DIR_WEBROOT'),'/');
    };
    return function(_name,_result){
        var _out = _result.output,
            _data = _out[_name],
            _sufix = _config.get('NAME_SUFFIX'),
            _outpt = _config.get('DIR_OUTPUT_STATIC'),
            _option = {type:_name=='css'?'cs':'js',mode:0};
        // output core
        if (!!_data.core){
        	_out[_name+'_code'] = _data.core;
            var _file = util.format('%score%s.%s',_outpt,_sufix,_name),
                _info = __doExlineFile(_file,_data.core,_option);
            _data.core = _info.link;
            _result.manifest[_file2url(_file)] = _info.version;
        }
        // output page
        var _content,_file,_info,
            _maxsize = _config.get('OBF_MAX_'+
                       _option.type+'_INLINE_SIZE')*1000;
        for(var x in _data){
            if (x=='core') continue;
            _content = _data[x];
            if (!_content) continue;
            _option.mode = x.indexOf('tp_')==0?1:0;
            _option.html = x.substring(3);
            if (_content.length>_maxsize){
                _file = util.format(
                    '%s%s%s.%s',_outpt,
                     _doOutputFileName(x),
                     _sufix,_name
                );
                _info = __doExlineFile(_file,_content,_option);
                _data[x] = _info.link;
                _result.manifest[_file2url(_file)] = _info.version;
            }else{
                _content = __doParseCSResource(x,_content,!0);
                _data[x] = __doInlineFile(_content,_option);
            }
        }
    };
})();
/*
 * 输出html代码
 * @param  {Object} _result 解析结果集
 * @return {Void}
 */
var __doOutputHtml = function(_result){
    var _output,_source,_mfile,
        _files = _result.files,
        _charset = _config.get('FILE_CHARSET'),
        _manifest = _config.get('MANIFEST_OUTPUT'),
        _root = _config.get('DM_STATIC_MF');
    for(var x in _files){
        _output = _doOutputPath(x);
        _fs.mkdir(path.dirname(_output)+'/');
        _log.info('output %s',_output);
        _source = _files[x].source;
        if (_source.indexOf('#<MANIFEST>')>=0){
            if (!!_manifest){
                _mfile = _doRelativePath('MF',_output,_manifest);
                _source = _source.replace('#<MANIFEST>',' manifest="'+_mfile+'"');
                // cal manifest entry version
                if (!_result.manifest_ent){
                    _result.manifest_ent = [];
                }
                var _key = _doOutputPath(x).replace(_config.get('DIR_WEBROOT'),'/');
                _result.manifest_ent.push(_result.manifest[_key]);
            }else{
                _source = _source.replace('#<MANIFEST>','');
            }
        }
        _fs.write(_output,_source,_charset);
    }
};
/*
 * 输出HTML5离线配置文件
 * @param  {Object} _result 解析结果集
 * @return {Void}
 */
var __doOutputManifest = (function(){
    var _reg0 = /\.js$/i,
        _reg1 = /\.css/i,
        _reg2 = /^\//;
    var _doCompletePath = function(_file){
        var _root = '/';
        // for js
        if (_reg0.test(_file)){
            _root = _config.get('DM_STATIC_JS')||_root;
            return _root+_file.replace(_reg2,'');
        }
        // for css
        if (_reg1.test(_file)){
            _root = _config.get('DM_STATIC_CS')||_root;
            return _root+_file.replace(_reg2,'');
        }
        // for html
        return _file;
    };
    return function(_result){
        var _file = _config.get('MANIFEST_OUTPUT');
        if (!_file) return;
        var _arr = [],_brr = [],
            _data = _result.manifest,
            _reg = _config.get('MANIFEST_FILTER');
        //_log.info('++++++++> %j',_data);
        for(var x in _data){
            // check filter
            if (!!_reg&&_reg.test(x))
                continue;
            _arr.push(_doCompletePath(x)); // url
            _brr.push(_data[x]);           // version
        }
        if (!!_result.manifest_ent){
            _brr.push.apply(_brr,_result.manifest_ent);
        }
        //console.log('++++++> %j',_brr);
        var _template = _config.get('MANIFEST_TEMPLATE'),
            _content = _template.replace('#<CACHE_LIST>',_arr.join('\n'))
                                .replace('#<VERSION>',_doVersionFile(_brr.sort().join('.')));
        _log.info('output %s',_file);
        _fs.write(_file,_content,_config.get('FILE_CHARSET'));
    };
})();
/**
 * 输出结果
 * @param  {Object} _result 解析结果集
 * @return {Void}
 */
var __doOutput = function(_result){
    __doOutputFile('css',_result);
    __doOutputFile('js',_result);
    __doMergeCSandJS(_result);
    __doMergeTemplate(_result);
    __doMergeVersion(_result);
    __doMergeExlink(_result);
    __doOutputHtml(_result);
    __doOutputManifest(_result);
    if (!_config.get('X_NOT_CLEAR_TEMP'))
        _fs.rmdir(_config.get('DIR_TEMPORARY'));
    _log.info('release done! view release log %s',_config.get('DIR_LOGGER'));
};
// export api
exports.html     = __doListHtmlFile;
exports.template = __doListHtmlFile;
exports.download = __doDownloadResource;
exports.cs       = __doPrepareCS;
exports.js       = __doPrepareJS;
exports.output   = __doOutput;
