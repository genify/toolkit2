var __logs = [],
    __file = '',
    _fs    = require('./file.js'),
     fs    = require('fs'),
     util  = require('util');
/*
 * 取时间信息
 * @return {String} 按格式输出时间
 */
var __getTimeString = (function(){
    var _fmtnmb = function(_number){
        _number = parseInt(_number)||0;
        return (_number<10?'0':'')+_number;
    };
    return function(){
        var _time = new Date();
        return util.format('%s-%s-%s %s:%s:%s.%s',
                           _time.getFullYear(),
                           _fmtnmb(_time.getMonth()+1),
                           _fmtnmb(_time.getDate()),
                           _fmtnmb(_time.getHours()),
                           _fmtnmb(_time.getMinutes()),
                           _fmtnmb(_time.getSeconds()),
                           _time.getMilliseconds());
    };
})();
/**
 * 设置日志文件
 * @param  {String} 文件路径
 * @return {Void}
 */
var __doSetFile = function(_file){
    __logs = [];
    __file = _file;
};
/**
 * 记录日志
 * @return {Void}
 */
var __doLog = function(){
    var _args = [].slice.call(arguments,0),
        _type = _args.shift();
    _args[0]  = util.format('[%s] %s\t-\t%s',
                _type,__getTimeString(),_args[0]);
    console.log.apply(console,_args);
    __logs.push(util.format.apply(util,_args));
    try{
        fs.appendFileSync(__file,__logs.join('\n')+'\n');
        __logs = [];
    }catch(e){
        // ignore error
    }
};
/**
 * 信息日志
 * @return {Void}
 */
var __doLogInfo = function(){
    var _args = [].slice.call(arguments,0);
    _args.unshift('INFO');
    __doLog.apply(null,_args);
};
/**
 * 警告日志
 * @return {Void}
 */
var __doLogWarn = function(){
    var _args = [].slice.call(arguments,0);
    _args.unshift('WARN');
    __doLog.apply(null,_args);
};
/**
 * 错误日志
 * @return {Void}
 */
var __doLogError = function(){
    var _args = [].slice.call(arguments,0);
    _args.unshift('EROR');
    __doLog.apply(null,_args);
};
/**
 * 打印调试信息
 * @return {Void}
 */
var __doLogDebug = function(){
    var _args = [].slice.call(arguments,0);
    _args.unshift('DBUG');
    __doLog.apply(null,_args);
};
/**
 * 日志写入文件
 * @param  {String} _file 输出日志文件地址
 * @return {Void}
 */
var __doLog2File = function(_file){
    try{
        if (!_file) return;
        _fs.write(_file,__logs.join('\n'));
    }catch(e){
        // ignore
    }
};
// export api
exports.init  = __doSetFile;
exports.log   = __doLogInfo;
exports.info  = __doLogInfo;
exports.warn  = __doLogWarn;
exports.debug = __doLogDebug;
exports.error = __doLogError;
exports.dump  = __doLog2File;
