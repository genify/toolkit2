var  fs    = require('fs'),
     url   = require('url'),
     path  = require('path'),
     util  = require('util'),
     http  = require('http'),
     https = require('https'),
     iconv = require('iconv-lite'),
    _log   = require('./logger.js');
/**
 * 判断指定路径是否为目录
 * @param  {String} _path 路径
 * @return {Boolean}      是否为目录
 */
var __isDirectory = function(_path){
    return fs.lstatSync(_path).isDirectory();
};
/**
 * 读取文件内容
 * @param  {String} _file    文件路径
 * @param  {String} _charset 文件编码，默认utf-8，支持gbk
 * @return {Array}           文件内容，按行分隔
 */
var __doReadFile = (function(){
    var _reg = /\r\n|\r|\n/;
    return function(_file,_charset){
        try{
            _charset = _charset||'utf-8';
            var _content = '';
            if (_charset=='utf-8'){
                _content = fs.readFileSync(_file,_charset);
            }else{
                var _buffer = fs.readFileSync(_file);
                _content = iconv.decode(_buffer,_charset);
            }
            return _content.split(_reg);
        }catch(e){
            return null;
        }
    };
})();
/**
 * 读取文件原始内容
 * @param  {String} _file 文件地址
 * @return {Array}        返回文件内容Buffer
 */
var __doReadContent = function(_file){
    try{
        return fs.readFileSync(_file.split('?')[0]);
    }catch(e){
        return null;
    }
};
/**
 * 写文件
 * @param  {String} _file    文件路径
 * @param  {String} _content 文件内容
 * @param  {String} _charset 文件编码，默认utf-8，支持gbk
 * @return {Void}
 */
var __doWriteFile = function(_file,_content,_charset){
    try{
        if (!_file) return;
        _charset = (_charset||'utf-8').toLowerCase();
		_content = _charset=='utf-8' ? _content
                 : iconv.encode(_content+'\r\n',_charset);
		fs.writeFileSync(_file,_content);
    }catch(e){
        throw util.format('can\'t write file [%s]%s for %j',_charset,_file,e);
    }
};
/**
 * 下载文件
 * @param  {String}   _remote   远程文件路径
 * @param  {String}   _local    本地保存文件路径
 * @param  {Function} _callback 下载回调
 * @return {Void}
 */
var __doDownloadFile = (function(){
    var _reg = /^https:\/\//i;
    return function(_remote,_local,_callback){
        _log.info('downloading %s',_remote);
        var _arr = [];
        var _result = url.parse(_remote);
        // add rand version
        var _path = _result.path||'';
        _result.path = _path+(_path.indexOf('?')
                       <0?'?':'&')+'v='+(+new Date);
        (_reg.test(_remote)?https:http).get(
         _result,function(_response){
            var _stream = fs.createWriteStream(_local,{'flags':'a'});
            if (_response.statusCode!=200){
                _log.error('js file not exist -> %s',_remote);
                _stream.end();
                setTimeout(function(){_callback(_remote,_local,'');},150);
                return;
            }
            _response.addListener('data',function(_chunk){
                _arr.push(_chunk);
                _stream.write(_chunk);
            });
            _response.addListener('end',function(){
                _stream.end();
                setTimeout(function(){_callback(_remote,_local,_arr.join(''));},150);
            });
        });
    };
})();
/**
 * 创建目录
 * @param  {String} _path 路径
 * @return {Void}
 */
var __doMakeDirectory = function(_path){
    if ((fs.existsSync||path.existsSync)(_path))
        return;
    __doMakeDirectory(
        path.dirname(_path));
    fs.mkdirSync(_path);
};
/**
 * 拷贝文件
 */
var __doCopyFile = function(_src,_dst,_logger){
    __doMakeDirectory(path.dirname(_dst));
    fs.writeFileSync(
        _dst,fs.readFileSync(_src)
    );
    if (!!_logger){
        _logger(_src,_dst);
    }
};
/**
 * 拷贝目录
 * @param  {String} 原始目录
 * @param  {String} 目标目录
 * @return {Void}
 */
var __doCopyDirectory = function(_src,_dst,_logger){
    if (!__isDirectory(_src)){
        if (/\/$/.test(_dst)){
            _dst = _dst+path.basename(_src);
        }
        __doCopyFile(_src,_dst,_logger);
        return;
    }
    var _list = fs.readdirSync(_src);
    for(var i=0,l=_list.length,_it;i<l;i++){
        _it = _list[i];
        if (__isDirectory(_src+_it)){
            __doCopyDirectory(
                _src+_it+'/',
                _dst+_it+'/',
                _logger
            );
            continue;
        }
        __doCopyFile(_src+_it,_dst+_it,_logger);
    }
};
/**
 * 删除目录
 * @param  {String} _path 目录路径
 * @return {Void}
 */
var __doRemoveDirectory = function(_path){
    if (!(fs.existsSync||path.existsSync)(_path))
        return;
    var _files = fs.readdirSync(_path);
    if (!!_files&&_files.length>0)
        for(var i=0,l=_files.length,_file;i<l;i++){
            _file = _path+'/'+_files[i];
            !__isDirectory(_file) ? fs.unlinkSync(_file)
                                  : __doRemoveDirectory(_file);
        }
    fs.rmdirSync(_path);
};
// export api
exports.read     = __doReadFile;
exports.write    = __doWriteFile;
exports.content  = __doReadContent;
exports.download = __doDownloadFile;
exports.mkdir    = __doMakeDirectory;
exports.copy     = __doCopyDirectory;
exports.rmdir    = __doRemoveDirectory;
exports.isdir    = __isDirectory;