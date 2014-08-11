var _jst    = require('./3rd/jst.js'),
    _config = require('./config.js'),
    _util   = require('./util/util.js'),
    _path   = require('./util/path.js'),
    _log    = require('./util/logger.js'),
    _fs     = require('./util/file.js'),
     fs     = require('fs');
// inline templates
var _tpls = {
    'ntb'   : '<table class="ntb-2">\
                 {if defined("hd")&&hd.length>0}\
                   <tr class="hd">{list hd as x}<th>${x.trim()}</th>{/list}</tr>\
                 {/if}\
                 {if defined("rows")&&rows.length>0}\
                   {list rows as x}\
                   <tr class="${x_index%2==1?\"od\":\"ev\"}">{list x as y}<td>${y.trim()}</td>{/list}</tr>\
                   {/list}\
                 {/if}\
               </table>',
    'list'  : '<${tag}>\
                 {list li as x}<li>${x}</li>{/list}\
               </${tag}>',
    'link'  : '<a href="#${href}">${label}</a>'
};
/**
 * 初始化文件模板
 * @return {Void}
 */
var __doInitFileTemplate = (function(){
    var _reg = /\.[^\.]+$/i;
    return function(){
        var _dir = _config.get('DIR_TEMPLATE'),
            _charset = _config.get('FILE_CHARSET');
        var _list = fs.readdirSync(_dir);
        if (!_list&&!_list.length){
            _log.warn('no template file to parse! %s',_dir);
        }else{
            for(var i=0,l=_list.length,_file;i<l;i++){
                _file = _list[i];
                if (_util.svn(_file)||
                    _file.indexOf('_')==0)
                    continue;
                _file = _dir+_file;
                if (_fs.isdir(_file)){
                    _log.warn('ignore dir[%s] under template',_file);
                    continue;
                }
                _jst.add(_fs.read(_file,_charset).join('\n'),_list[i]);
            }
        }
    };
})();
/**
 * 初始化HTML结构模板
 * @return {Void}
 */
var __doInitStringTemplate = function(){
    for(var x in _tpls)
        _jst.add(_tpls[x],x);
};
/**
 * 整合模板数据 
 * @param  {String} 模板标识
 * @param  {Object} 数据信息
 * @param  {Object} 扩展功能
 * @return {String} 模板整合数据后的内容
 */
exports.get = function(_sn,_options,_extends){
    _extends = _extends||{};
    _extends.link = function(_value){
        if (_value.indexOf('{patch}')>=0) 
            return '<span>'+_value+'</span>';
        return '<a href="'+_value.replace(/\//g,'_')
               .replace(/\{.*?\}/,_config.get('DIR_SRC_ROOT'))
               .replace('.js','.html')+'" target="_nej_target">'+_value+'</a>';
    };
    return _jst.get(_sn,_options,_extends);
};
/**
 * 模板初始化
 * @return {Void}
 */
var _inited = !1;
exports.init = function(){
    if (_inited) return;
    // init template
    __doInitFileTemplate();
    __doInitStringTemplate();
};
