var  fs    = require('fs'),
     url    = require('url'),
     path   = require('path'),
     util   = require('util'),
     iconv  = require('iconv-lite'),
    _path   = require('./path.js');
/**
 * 读取文件内容
 * @param  {String} file    文件路径
 * @param  {String} charset 文件编码，默认utf-8，支持gbk
 * @return {Array}          文件内容，按行分隔
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
                content = iconv.decode(buffer,charset);
            }
            return content.split(reg);
        }catch(ex){
            return null;
        }
    };
})();
/**
 * 读取文件原始内容
 * @param  {String} file 文件地址
 * @return {Array}       返回文件内容Buffer
 */
exports.raw = function(file){
    try{
        return fs.readFileSync(file.split(/[?#]/)[0]);
    }catch(ex){
        return null;
    }
};
/**
 * 写文件
 * @param  {String} file    文件路径
 * @param  {String} content 文件内容
 * @param  {String} charset 文件编码，默认utf-8，支持gbk
 * @return {Void}
 */
exports.write = function(file,content,charset){
    try{
        if (!file) return;
        charset = (charset||'utf-8').toLowerCase();
        content = charset=='utf-8' ? content
                : iconv.encode(content+'\r\n',charset);
        fs.writeFileSync(file,content);
    }catch(ex){
        throw util.format('can\'t write file [%s]%s for %s',charset,file,ex);
    }
};
/**
 * 拷贝文件
 * @param  {String}   src    原始文件
 * @param  {String}   dst    目标文件
 * @param  {Function} logger 日志记录函数
 */
exports.copy = function(src,dst,logger){
    this.mkdir(path.dirname(dst));
    fs.writeFileSync(dst,fs.readFileSync(src));
    if (!!logger){
        logger(src,dst);
    }
};
/**
 * 删除文件
 * @param  {String} file 文件路径
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
 * 判断指定路径是否为目录
 * @param  {String} dir 路径
 * @return {Boolean}    是否为目录
 */
exports.isdir = function(dir){
    try{
        return fs.lstatSync(dir).isDirectory();
    }catch(ex){
        return false;
    }
};
/**
 * 创建目录
 * @param  {String} dir 路径
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
 * 删除目录
 * @param  {String} dir 目录路径
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
 * 拷贝目录
 * @param  {String}   src    原始目录
 * @param  {String}   dst    目标目录
 * @param  {Function} logger 日志记录函数
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
 * 列出目录下的所有文件
 * @param  {String}   dir    目录路径
 * @param  {Function} filter 过滤函数
 * @return {Array}           目录下符合条件的文件列表
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
 * 判断路径是否存在
 * @param  {String} file 路径
 * @return {Boolean}     是否存在
 */
exports.exist = function(file){
    file = (file||'').split(/[?#]/)[0];
    return (fs.existsSync||path.existsSync)(file);
};
/**
 * 取文件标识
 * @param  {String} file 文件名
 * @return {Number}      文件标识
 */
exports.getFileKey = (function(){
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