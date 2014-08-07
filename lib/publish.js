/* ----------------------------------------------------------
 * 打包入口文件，使用方式
 * × 指定打包配置文件
 *   > node release/src/release.js config=d:/test/blog.conf
 * × 配置文件为release/release.conf
 *   > node release/src/release.js
 * ----------------------------------------------------------
 */
// require module
var _fs      = require('./file.js'),
    _log     = require('./logger.js'),
    _path    = require('./path.js'),
    _config  = require('./config.js'),
    _parser  = require('./parser.js');
// publish
var __doPublish = function(_result){
    // parse project
    _parser.html(_config.get('DIR_SOURCE'),_result);
    _parser.template(_config.get('DIR_SOURCE_TP'),_result);
    _result.ondownload = function(){
        _parser.cs(_result);
        _parser.js(_result);
        _parser.output(_result);
        if (!!_result.onreleasedone){
            _result.onreleasedone(_result);
        }
    };
    _parser.download(_result);
};
/*
 * 发布项目
 * @return {Void}
 */
var __doRelease = function(_options){
    var _result = {};
    _result.onreleasedone = (_options||{}).onreleasedone;
    // parse config file
    var _conf = _options.config;
    // a/b/release.conf relative to current directory
    if (/^[\w]/.test(_conf)&&_conf.indexOf(':')<0){
        _conf =  process.cwd()+'/'+_conf;
    }
    _conf = _path.path(_conf,__dirname+'/');
    // check config file
    if (!_path.exist(_conf)){
        _log.error('config file[%s] not exist!',_conf);
        return;
    }
    // parse config file
    _config.parse(_conf);
    // no image optimat
    if (!_config.get('OPT_IMAGE_FLAG')){
        __doPublish(_result);
        return;
    }
    // optimat images in /res/
    require('nej-minimage').dirHandler({
        input:_config.get('DIR_STATIC'),
        output:_config.get('DIR_STATIC'),
        quality:_config.get('OPT_IMAGE_QUALITY'),
        log:_log.info,
        callback:function(){
            __doPublish(_result);
        }
    });
};
/*
 * 清除日志
 * @return {Void}
 */
var __doClearLog = function(){
    _fs.rmdir(_config.get('DIR_TEMPORARY'));
};
// exports api
exports.run = __doRelease;
exports.clear = __doClearLog;