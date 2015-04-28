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
