/*
 * io with cache utility api
 * @module   util/io
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
    path = require('path'),
   _fs   = require('../util/file.js'),
   _path = require('../util/path.js'),
   _util = require('../util/util.js');
// private variable
var _gCache = {
        resources:{}, // cache resource version
        sprites:{}    // sprite file map, e.g. {sprite:[file1,file2]}
    },
    _gDwnState = {},
    _gListener = [],
    _gOutState = {},
    _gOutListener = [];
// add event
var _addEvent = function(cache,listeners,callback){
    // push to listener cache
    if (listeners.indexOf(callback)<0){
        listeners.push(callback);
    }
    // check loading state
    if (Object.keys(cache).length<=0){
        callback();
    }
};
// remove event
var _removeEvent = function(listeners,callback){
    var index = listeners.indexOf(callback);
    if (index>=0){
        listeners.splice(index,1);
    }
};
// check event trigger
var _checkEvent = function(cache,listener){
    if (Object.keys(cache).length<=0){
        listener.forEach(function(callback){
            try{
                callback();
            }catch(ex){
                console.error(ex.stack);
            }
        });
    }
};
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
    _addEvent(_gDwnState,_gListener,callback);
};
/**
 * remove onload callback
 * @param  {Function} callback - onload callback
 * @return {Void}
 */
exports.offload = function(callback){
    _removeEvent(_gListener,callback);
};
/**
 * get resource content with uri
 * @param  {String}   uri      - resource uri
 * @param  {Function} callback - callback if resource loaded from fs or server
 * @return {Boolean}  whether uri loading queue
 */
exports.get = (function(){
    // format content
    var _doFormatContent = function(uri,content,callback){
        var event = {value:content};
        // pre process file content
        // update file content in callback
        try{
            if (_util.isFunction(callback)){
                callback(event);
            }
        }catch(ex){
            // ignore
            console.error(ex.stack);
        }
        this.cache(uri,event.value);
    };
    // check download state
    var _doCheckDownloadState = function(){
        _checkEvent(_gDwnState,_gListener);
    };
    return function(uri,callback,charset){
        // check cache
        var content = this.getFromCache(uri);
        if (content!=null||!!_gDwnState[uri]){
            return !0;
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
            handler("cant load file "+uri+' for '+ex.message+'\n'+ex.stack);
            console.error(ex.stack);
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
                'download file %s error, cause:\n%s',
                uri,error.message
            ));
        }
    );
};
/**
 * add output done event
 * @param  {Function} callback - done callback
 * @return {Void}
 */
exports.ondone = function(callback){
    _addEvent(_gOutState,_gOutListener,callback);
};
/**
 * remove output done event
 * @param  {Function} callback - done callback
 * @return {Void}
 */
exports.offdone = function(callback){
    _removeEvent(_gOutListener,callback);
};
/**
 * output file content
 * @param  {String} file    - file path
 * @param  {String} content - file content
 * @param  {String=} charset - charset
 * @return {Void}
 */
exports.output = function(file,content,charset){
    var id = file+'v'+_util.increment();
    this.lock(id);
    _fs.mkdir(path.dirname(file));
    _fs.writeAsync(
        file,content,charset,
        this.unlock.bind(this,id)
    );
};
/**
 * lock output state
 * @param  {String} key - state key
 * @return {Void}
 */
exports.lock = function(key){
    _gOutState[key] = !0;
};
/**
 * unlock output state
 * @param  {String} key - state key
 * @return {Void}
 */
exports.unlock = function(key){
    delete _gOutState[key];
    _checkEvent(_gOutState,_gOutListener);
};
/**
 * save resource version
 * @param  {String} uri - uri
 * @param  {String} version - version
 * @return {Void}
 */
exports.resource = function(uri,version){
    _gCache.resources[uri] = version;
};
/**
 * dump resource version cache
 * @return {Object} version cache
 */
exports.dumpResource = function(){
    return _gCache.resources||{};
};
/**
 * cache sprite image file
 * @param  {String} file - sprite image file
 * @param  {String} root - sprite root path
 * @return {Void}
 */
exports.cacheSpriteWithRoot = function(file,root){
    // generate sprite image name for file
    // file c://a/b/c/a.png for root c://a/b/ will to sprite c
    // file c://a/b/d.png for c://a/b/ will to sprite b
    var arr = file.replace(root,'').split('/');
    if (arr.length>1){
        name = arr.shift();
    }else if(/\/(.+?)\/$/.test(root)){
        name = RegExp.$1;
    }else{
        name = 'sprite';
    }
    // cache file sprite map
    this.cacheSpriteFile(name,file);
};
/**
 * cache sprite file with name
 * @param  {String} name - sprite name
 * @param  {String} file - file name
 * @return {Void}
 */
exports.cacheSpriteFile = function(name,file){
    var ret = _gCache.sprites;
    if (!ret[name]){
        ret[name] = [];
    }
    if (ret[name].indexOf(file)<0){
        ret[name].push(file);
    }
};
/**
 * dump sprite image files
 * @return {Object} image will be sprited, e.g. {sprite:[file1,file2,...]}
 */
exports.dumpSpriteFiles = function(){
    return _gCache.sprites;
};


