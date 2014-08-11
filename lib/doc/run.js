/* ----------------------------------------------------------
 * 文档工具执行入口文件，使用方式
 * × 指定配置文件
 *   > node doc/src/run.js -c=d:/test/doc.conf
 *   > node doc/src/run.js --config=d:/test/doc.conf
 * × 文档工具中的配置文件 doc/gen/doc.conf
 *   > node doc/src/run.js
 *   
 * 使用 -c 或者 --config 指定配置文件时遵循以下规则  
 * × 绝对地址：d:/x/x 或者 /a/b/c 使用配置地址
 * × 相对路径：a/b/c 相对于执行node命令时所在的目录
 *         ./a/b/c或者../a/b/c 相对于run.js所在目录
 * × 建议使用绝对路径输入配置文件地址
 * ----------------------------------------------------------
 */
// require module
var __result  = {},
    _path     = require('./util/path.js'),
    _config   = require('./config.js'),
    _parser   = require('./parser.js'),
    _output   = require('./output.js'),
    _template = require('./tpl.js'),
     query    = require('querystring');
/*
 * 取命令行参数
 * @return {Object} 命令行参数
 */
var __getArgs = (function(){
    var _args;
    return function(){
        if (!_args){
            var _arr = process.argv.slice(2);
            _args = query.parse(_arr.join('&'));
        }
        return _args;
    };
})();
/*
 * 取配置文件路径
 * @return {String} 配置文件路径
 */
var __getConfPath = function(){
    var _args = __getArgs();
    return _args['--config']||
           _args['-c']||'../gen/doc.conf';
};
// parse config file
var _conf = __getConfPath();
// a/b/release.conf relative to current directory
if (/^[\w]/.test(_conf)&&_conf.indexOf(':')<0)
    _conf =  process.cwd()+'/'+_conf;
_config.parse(_path.path(_conf,__dirname+'/'));
_template.init();
_parser.parse(_config.get('DIR_INPUT'),__result);
_output.dump(__result);
