var util = require('util');
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
