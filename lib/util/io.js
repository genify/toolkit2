var util = require('util'),
   _fs   = require('../util/file.js'),
   _path = require('../util/path.js');
// private variable
var _gCache = {},
    _gDwnState = {},
    _gListener = [];
/**
 * 添加下载完成触发事件
 * @param  {Function} callback 回调
 * @return {Void}
 */
exports.onload = function(callback){
    // push to listener cache
    if (_gListener.indexOf(callback)<0){
        _gListener.push(callback);
    }
    // check loading state
    if (Object.keys(_gDwnState).length<=0){
        callback();
    }
};
/**
 * 删除下载完成触发事件
 * @param  {Function} callback 回调
 * @return {Void}
 */
exports.offload = function(callback){
    var index = _gListener.indexOf(callback);
    if (index>=0){
        _gListener.splice(index,1);
    }
};
/**
 * 缓存文件内容
 * @param  {String}   uri      文件地址
 * @param  {Function} callback 回调
 * @return {Void}
 */
exports.get = (function(){
    // format content
    var _doFormatContent = function(uri,content,callback){
        var event = {value:content};
        // pre process file content
        // update file content in callback
        try{
            callback(event);
        }catch(ex){
            // ignore
        }
        this.cache(uri,event.value);
    };
    // check download state
    var _doCheckDownloadState = function(){
        if (Object.keys(_gDwnState).length<=0){
            _gListener.forEach(function(callback){
                try{callback();}catch(ex){}
            });
        }
    };
    return function(uri,callback,charset){
        // check cache
        var content = this.getFromCache(uri);
        if (content!=null){
            callback({
                fromCache:!0,
                value:content
            });
            return;
        }
        // cache file content
        if (!_path.isURL(uri)){
            // local file
            var content = (
                this.read(uri,charset)||[]
            ).join('\n');
            _doFormatContent.call(
                this,uri,content,callback
            );
        }else if (!_gDwnState[uri]){
            // remote file
            _gDwnState[uri] = !0;
            this.download(
                uri+'?v='+(+new Date),function(content){
                    _doFormatContent.call(
                        this,uri,content,callback
                    );
                    delete _gDwnState[uri];
                    _doCheckDownloadState();
                }.bind(this)
            );
        }
    };
})();
/**
 * 从缓存中取内容
 * @param  {String} uri 地址
 * @return {String}     内容 
 */
exports.getFromCache = function(uri){
    return _gCache[uri];
};
/**
 * 缓存内容
 * @param  {String} uri     地址
 * @param  {String} content 内容
 * @return {Void}
 */
exports.cache = function(uri,content){
    _gCache[uri] = content;
};
/**
 * 下载文件
 * @param  {String}   uri      文件地址
 * @param  {Function} callback 回调
 * @return {Void}
 */
exports.download = function(uri,callback){
    var https = /^https:\/\//i.test(uri);
    require(https?'https':'http').get(
        uri,function(res){
            var ret = [];
            res.on('data',function(chunk){
                ret.push(chunk.toString());
            });
            res.on('end',function(){
                callback(ret.join(''));
            });
        }
    ).on(
        'error',function(error){
            callback(util.format(
                'download file %s error, cause: %s',
                uri,error.message
            ));
        }
    );
};
