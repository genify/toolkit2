var util = require('util'),
    crypto = require('crypto');
/**
 * 生成版本信息
 * @param  {String} content 内容
 * @return {String}         版本信息
 */
exports.md5 = function(content){
    return crypto.createHash('md5').update(content).digest('hex');
};
/**
 * 随机生成一个给定范围的整数
 * @param  {Number} min 小区间，包含
 * @param  {Number} max 大区间，不包含
 * @return {Number}     随机整数
 */
exports.rand = function(min,max){
    return Math.floor(Math.random()*(max-min)+min);
};
/**
 * 遍历对象
 * @param  {Object}   map      对象
 * @param  {Function} callback 回调
 * @param  {Object}   scope    回调this参数
 * @return {Void}
 */
exports.loop = function(map,callback,scope){
    Object.keys(map||{}).forEach(function(key){
        callback.call(scope,map[key],key,map);
    });
};
/**
 * 合并所有参数
 * @param  {Object} arg 参数，后面的覆盖前面的
 * @return {Object}     合并后参数
 */
exports.merge = function(){
    var ret = {},
        args = [].slice.call(arguments,0);
    args.forEach(function(item){
        var keys = Object.keys(item||{});
        keys.forEach(function(key){
            ret[key] = item[key];
        });
    });
    return ret;
};
/**
 * 根据模板合并参数
 * @param  {Object} template 模板
 * @param  {Object} config   参数
 * @return {Object}          合并后参数
 */
exports.fetch = function(template,config){
    config = config||{};
    template = template||{};
    var ret = {},
        keys = Object.keys(template);
    keys.forEach(function(key){
        var value = config[key];
        ret[key] = value==null?template[key]:value;
    });
    return ret;
};
/**
 * 取格式化时间
 * @param  {String} format 格式
 * @param  {Date}   time   时间对象
 * @return {String}        时间格式化后值
 */
exports.getFormatTime = (function(){
    var _doFormat = function(number){
        number = parseInt(number)||0;
        return (number<10?'0':'')+number;
    };
    return function(format,time){
        time = time||new Date();
        return util.format(
            format,time.getFullYear(),
            _doFormat(time.getMonth()+1),
            _doFormat(time.getDate()),
            _doFormat(time.getHours()),
            _doFormat(time.getMinutes()),
            _doFormat(time.getSeconds()),
            time.getMilliseconds()
        );
    };
})();
/**
 * 检查参数是否函数
 * @param  {Variable} func 参数
 * @return {Boolean}       是否函数
 */
exports.isFunction = function(func){
    Object.prototype.toString.call(func).toLowerCase()=='[object function]';
};
