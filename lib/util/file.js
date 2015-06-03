/*
 * file operate utility api
 * @module   util/file
 * @author   genify(caijf@corp.netease.com)
 */
var  fs    = require('fs'),
     url    = require('url'),
     path   = require('path'),
     util   = require('util'),
    _path   = require('./path.js');
/**
 * read file content
 * @param  {String} file    - absolute file path
 * @param  {String} charset - content charset,default is utf-8
 * @return {Array}  file content with line separate
 */
exports.read = (function(){
    var reg = /\r\n|\r|\n/;
    return function(file,charset){
        try{
            charset = (charset||'utf-8').toLowerCase();
            var content = '';
            if (charset==='utf-8'){
                content = fs.readFileSync(file,charset);
            }else{
                var buffer = fs.readFileSync(file);
                content = require('iconv-lite').decode(buffer,charset);
            }
            return content.split(reg);
        }catch(ex){
            return null;
        }
    };
})();
/**
 * raw of file content
 * @param  {String} file - absolute file path
 * @return {Array}  raw content of file
 */
exports.raw = function(file){
    try{
        return fs.readFileSync(file.split(/[?#]/)[0]);
    }catch(ex){
        return null;
    }
};
/**
 * write content to file
 * @param  {String} file    - absolute file path
 * @param  {String} content - file content
 * @param  {String} charset - content charset, default is utf-8
 * @return {Void}
 */
exports.write = function(file,content,charset){
    try{
        if (!file){
            return;
        }
        charset = (charset||'utf-8').toLowerCase();
        if (charset!=='utf-8'){
            content = require('iconv-lite').encode(content+'\r\n',charset);
        }
        fs.writeFileSync(file,content);
    }catch(ex){
        throw util.format('can\'t write file [%s]%s for %s',charset,file,ex);
    }
};
/**
 * copy file, will make dir first if src is not exist
 * @param  {String}   src    - original file
 * @param  {String}   dst    - target file
 * @param  {Function} logger - logger function
 */
exports.copy = function(src,dst,logger){
    this.mkdir(path.dirname(dst));
    fs.writeFileSync(dst,fs.readFileSync(src));
    if (!!logger){
        logger(src,dst);
    }
};
/**
 * remove file
 * @param  {String} file - file path
 * @return {Void}
 */
exports.rm = function(file){
    try{
        fs.unlinkSync(file);
    }catch(ex){
        // ignore
    }
};
/**
 * check directory for path
 * @param  {String}  dir - directory path
 * @return {Boolean} is directory
 */
exports.isdir = function(dir){
    try{
        return fs.lstatSync(dir).isDirectory();
    }catch(ex){
        return false;
    }
};
/**
 * create directory recursion
 * @param  {String} dir - directory path
 * @return {Void}
 */
exports.mkdir = function(dir){
    if (this.exist(dir)){
        return;
    }
    this.mkdir(path.dirname(dir));
    fs.mkdirSync(dir);
};
/**
 * remove directory, clear files first if not empty directory
 * @param  {String} dir - directory path
 * @return {Void}
 */
exports.rmdir = function(dir){
    if (!this.exist(dir)){
        return;
    }
    // remove file first
    var files = fs.readdirSync(dir);
    if (!!files&&files.length>0){
        files.forEach(function(v){
            var file = dir+v;
            if (!this.isdir(file)){
                this.rm(file);
            }else{
                this.rmdir(file+'/');
            }
        },this);
    }
    // remove dir
    fs.rmdirSync(dir);
};
/**
 * copy directory
 * @param  {String}   src    - original directory path
 * @param  {String}   dst    - target directory path
 * @param  {Function} logger - logger function
 * @return {Void}
 */
exports.cpdir = function(src,dst,logger){
    // copy file
    if (!this.isdir(src)){
        if (/\/$/.test(dst)){
            dst = dst+path.basename(src);
        }
        this.copy(src,dst,logger);
        return;
    }
    // copy dir
    var list = fs.readdirSync(src);
    if (!!list&&list.length>0){
        list.forEach(function(v){
            var it = src+v;
            if (this.isdir(it+'/')){
                this.cpdir(it+'/',dst+v+'/',logger);
            }else{
                this.copy(it,dst+v,logger);
            }
        },this);
    }
};
/**
 * list all files in directory
 * @param  {String}   dir    - direcotry path
 * @param  {Function} filter - file filter function, file will be dump if filter return true
 * @return {Array}    all files after filter
 */
exports.lsfile = (function(){
    var _isFileOK = function(file){
        return !0;
    };
    return function(dir,filter){
        var ret = [];
        // format dir
        if (!/\/$/.test(dir)){
            dir += '/';
        }
        // check dir
        if (!this.exist(dir)){
            return ret;
        }
        var list = fs.readdirSync(dir);
        // empty dir
        if (!list||!list.length){
            return ret;
        }
        // read dir recursive
        filter = filter||_isFileOK;
        list.forEach(function(name){
            // check filename or filepath
            var next = _path.normalize(dir+name);
            // dump next
            if (!this.isdir(next+'/')){
                if (filter(name,next)){
                    ret.push(next);
                }
            }else{
                ret.push.apply(
                    ret,this.lsfile(next+'/',filter)
                );
            }
        },this);
        return ret;
    };
})();
/**
 * check file exist
 * @param  {String}  file - absolute file path
 * @return {Boolean} file is exist
 */
exports.exist = function(file){
    file = (file||'').split(/[?#]/)[0];
    return (fs.existsSync||path.existsSync)(file);
};
/**
 * auto generator unique key for file
 * @param  {String} file - absolute file path
 * @return {Number} key for file
 */
exports.key = (function(){
    var seed = 1,
        cache = {};
    return function(file){
        // for auto id
        if (!file){
            return seed++;
        }
        var key = cache[file];
        if (!key){
            key = seed++;
            cache[file] = key;
        }
        return key;
    };
})();

