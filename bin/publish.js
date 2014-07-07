#!/usr/bin/env node
// node bin/publish.js /path/to/relase.conf

/*
 * 取命令行参数
 * @return {Object} 命令行参数
 */
var __getArgs = (function(){
    var _args;
    return function(){
        if (!_args){
            var _arr = process.argv.slice(2);
            if ((_arr[0]||'').indexOf('=')<0){
                _args = {'-c':_arr[0]};
            }else{
                _args = require('querystring').parse(_arr.join('&'));
            }
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
    return _args['-c']||
           _args['--config']||
           _args.config||'./release.conf';
};
// do publish
require('../lib/publish.js').run({
    config:__getConfPath()
});
