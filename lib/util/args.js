/*
 * arguments from shell parse api
 * @module   util/args
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util');
/**
 * 解析命令行参数
 * @param  {Array} argv 参数列表
 * @return {Object}     解析后的参数集合,{command:'abc',options:{a:true,b:'bbb'}}
 */
exports.parse = function(argv){
    var result = {options:{}};
    // clear space before/after "=" in aguments
    if (util.isArray(argv)){
        argv = argv.join(' ');
    }
    var argc = argv.replace(/\s*=\s*/g,'=');
    argc.split(' ').forEach(function(arg){
        if (!arg) return;
        var noeq = arg.indexOf('=')<0;
        // check command
        if (arg.indexOf('-')!==0&&noeq){
            if (!result.command){
                result.command = arg;
            }else{
                result.options[command] = true;
            }
            return;
        }
        // check options
        arg = arg.replace(/^-*/,'');
        if (noeq){
            result.options[arg] = true;
        }else{
            arg = arg.split('=');
            result.options[arg.shift()] = arg.join('=');
        }
    });
    return result;
};
/**
 * 缓存帮助信息
 * @param  {Object} config 帮助信息配置
 * @return {Void}
 */
exports.config = (function(){
    var config = null;
    // show help message
    exports.show = function(key){
        var list = config[key]||config['-default']||[];
        list.forEach(function(m){
            console.log(m);
        });
    };
    return function(map){
        config = map||{};
    };
})();

