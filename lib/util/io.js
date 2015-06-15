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
 * dump file content cache
 * @return {Object} file content cache
 */
exports.dump = function(){
    return _gCache;
};
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
            console.log(ex.stack);
        }
        this.cache(uri,event.value);
    };
    // check download state
    var _doCheckDownloadState = function(){
        if (Object.keys(_gDwnState).length<=0){
            _gListener.forEach(function(callback){
                try{
                    callback();
                }catch(ex){
                    console.log(ex.stack);
                }
            });
        }
    };
    return function(uri,callback,charset){
        // check cache
        var content = this.getFromCache(uri);
        if (content!=null||!!_gDwnState[uri]){
            return;
        }
        // download file content
        _gDwnState[uri] = !0;
        var handler = function(content){
            content = content||'';
            if (util.isArray(content)){
                content = content.join('\n');
            }
            _doFormatContent.call(
                this,uri,content,callback
            );
            delete _gDwnState[uri];
            _doCheckDownloadState();
        }.bind(this);
        // load file from file system or remote server
        try{
            if (!_path.isURL(uri)){
                _fs.readAsync(uri,handler,charset);
            }else{
                this.download(uri+'?v='+(+new Date),handler);
            }
        }catch(ex){
            handler("can't load file "+uri+' for '+ex.message);
            console.log(ex.stack);
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
 * fill uri list with content
 * @param  {Array}  list - uri list
 * @param  {String} sep  - list separate char
 * @return {String} content of list
 */
exports.fill = function(list,sep){
    var ret = [];
    (list||[]).forEach(function(uri){
        var content = this.getFromCache(uri)||'';
        if (!!content){
            ret.push(content);
        }
    },this);
    return ret.join(sep||'\n');
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
