var _config = require('./config.js'),
    _log    = require('./util/logger.js'),
    _fs     = require('./util/file.js'),
    _tpl    = require('./tpl.js');
/**
 * 解析名称
 * @return {Void}
 */
var __doParseName = function(_name,_map){
    var _space,_arr = _name.split('.');
    if (_arr[0]=='NEJ'){
        _map[_name] = !0;
        return;
    }
    if (_arr[1]=='prototype'){
        _space = _arr.shift();
        _name = {
            label:_arr[1],
            href:_arr.join('.'),
        };
    }else{
        _name = _arr.pop();
        _space = _arr.join('.');
    }
    if (!_map[_space]){
        _map[_space] = [];
    }
    _map[_space].push(_name);
};
/**
 * 解析排序
 * @return {Array} 序列
 */
var __doParseSort = function(_map){
    var _arr = [], // namespace
        _brr = []; // api/class
    for(var x in _map)
        (_map[x]!=!0?_arr:_brr).push(x);
    _arr.sort();
    _brr.sort();
    _brr.push.apply(_brr,_arr);
    return _brr;
};
/**
 * 排序结果集
 * @return {Void}
 */
var __doSortResultMap = function(_map){
    var _list;
    for(var x in _map){
        _list = _map[x];
        if (_list==!0) continue;
        _list.sort(function(_arg0,_arg1){
            if (typeof _arg0!='string')
                _arg0 = _arg0.label;
            if (typeof _arg1!='string')
                _arg1 = _arg1.label;
            return _arg0>_arg1?1:-1;
        });
    }
};
/**
 * 
 */
var __doCategory = function(_name,_list){
	for(var i=0,l=_list.length,_item;i<l;i++){
		_item = _list[i];
		if (_item.test(_name)){
			_item.list.push({
				tag:_item.tag(_name),
				key:_name
			});
			break;
		}
	}
};
/**
 * 
 */
var __doSortResult = function(_list){
	var _doSort = function(_obj1,_obj2){
		return _obj1.tag>_obj2.tag?1:-1;
	};
	for(var i=0,l=_list.length;i<l;i++){
		_list[i].list.sort(_doSort);
	}
};
/**
 * 
 */
var __doOutputAPI = function(_result){
    // output api
    var _output = _config.get('DIR_OUTPUT_API'),
        _sort = [{lab:'全局接口',list:[],tag:function(v){return v;},test:function(v){return v.indexOf('NEJ')>=0;}},
	    	     {lab:'扩展接口',list:[],tag:function(v){return v;},test:function(v){return v.indexOf('NEJ')<0&&v.indexOf('nej')<0;}},
	    	     {lab:'节点接口(nej.e)',list:[],tag:function(v){return v.replace('nej.e.','');},test:function(v){return v.indexOf('nej.e.')>=0;}},
	    	     {lab:'事件接口(nej.v)',list:[],tag:function(v){return v.replace('nej.v.','');},test:function(v){return v.indexOf('nej.v.')>=0;}},
	    	     {lab:'通用接口(nej.u)',list:[],tag:function(v){return v.replace('nej.u.','');},test:function(v){return v.indexOf('nej.u.')>=0;}},
	    	     {lab:'数据接口(nej.j)',list:[],tag:function(v){return v.replace('nej.j.','');},test:function(v){return v.indexOf('nej.j.')>=0;}},
                 {lab:'链式接口(nej.$)',list:[],tag:function(v){return v.replace('nej.$().','');},test:function(v){return v.indexOf('nej.$().')>=0;}}];
    _fs.write(_output+'index.html',
              _tpl.get('index.html',{
                  type:'API'
              }));
    _fs.write(_output+'const.html',
              _tpl.get('const.html',_result));
    for(var x in _result.apis){
        __doCategory(x,_sort);
        _file = _output+x;
        _data = _result.apis[x];
        _file += '.html';
        _log.info('output %s',_file);
        _fs.write(_file,_tpl.get('api.html',_data));
    }
    __doSortResult(_sort);
    _fs.write(_output+'data.js',
              _tpl.get('data.js',{
                  html:_tpl.get('list.html',{
                      type:'api',
                      sort:_sort
                  })
              }));
};
/**
 * 
 */
var __doOutputClass = function(_result){
	var _sort = [{lab:'UI控件(nej.ui)',list:[],tag:function(v){return v.split('.').pop();},test:function(v){return v.indexOf('nej.ui.')>=0}},
	             {lab:'UTIL控件(nej.ut)',list:[],tag:function(v){return v.split('.').pop();},test:function(v){return v.indexOf('nej.ut.')>=0}}],
        _output = _config.get('DIR_OUTPUT_CLS');
    _fs.write(_output+'index.html',
              _tpl.get('index.html',{
                  type:'CLASS'
              }));
    for(var x in _result.classes){
        __doCategory(x,_sort);
        _file = _output+x;
        _data = _result.classes[x];
        _file += '.html';
        _log.info('output %s',_file);
        _fs.write(_file,_tpl.get('class.html',_data));
    }
    __doSortResult(_sort);
    _fs.write(_output+'data.js',
              _tpl.get('data.js',{
                  html:_tpl.get('list.html',{
                      type:'class',
                      sort:_sort
                  })
              }));
};
/**
 * 输出文档
 * @param  {Object} _result 结果集
 * @return {Void}
 */
var __doOutputResult = function(_result){
    var _data,_file,
        _res = _config.get('DIR_OUTPUT_RES');
    // output resource
    _fs.write(_res+'nej.css',
              _tpl.get('nej.css',{
                  theme:_config.get('CODE_THEME')
              }));
    _fs.write(_res+'nej.js',
              _tpl.get('nej.js'));
    _fs.copy(_config.get('DIR_TEMPLATE')
             +'_sprite.png',_res+'sprite.png');
    // output api
    __doOutputAPI(_result);
    // output class
    __doOutputClass(_result);
    // output log
    _log.dump(_config.get('DIR_CONFIG')+'doc.log');
};
exports.dump = __doOutputResult;