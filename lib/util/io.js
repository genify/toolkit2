/*
 * io with cache utility api
 * @module   util/io
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
   _fs   = require('../util/file.js'),
   _path = require('../util/path.js');
// private variable
var _gCache = {},
    _gDwnState = {},
    _gListener = [];
/**
 * add onload event for io
 * @param  {Function} callback - onload callback
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
 * remove onload callback
 * @param  {Function} callback - onload callback
 * @return {Void}
 */
exports.offload = function(callback){
    var index = _gListener.indexOf(callback);
    if (index>=0){
        _gListener.splice(index,1);
    }
};
/**
 * get resource content with uri
 * @param  {String}   uri      - resource uri
 * @param  {Function} callback - callback if resource loaded from fs or server
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
            return;
        }
        // cache file content
        if (!_path.isURL(uri)){
            // local file
            var content = (
                _fs.read(uri,charset)||[]
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
 * get resource content from cache
 * @param  {String} uri - resource uri
 * @return {String} resource content
 */
exports.getFromCache = function(uri){
    return _gCache[uri];
};
/**
 * cache resource content
 * @param  {String} uri     - resource uri
 * @param  {String} content - resource content
 * @return {Void}
 */
exports.cache = function(uri,content){
    _gCache[uri] = content;
};
/**
 * download content from server
 * @param  {String}   uri      - resource content
 * @param  {Function} callback - callback after resource loaded
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
