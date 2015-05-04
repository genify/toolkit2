/**
 * 根据配置文件发布项目
 * @param  {String} file 配置文件路径
 * @return {Void}
 */
exports.deploy = (function(){
    var _doDumpFile = function(){
        
    };
    return function(file){
        var logger = require('./util/logger.js'),
            logcnf = {
                warn:logger.warn.bind(logger),
                error:function(){
                    logger.error.apply(logger,arguments);
                    process.exist(-1);
                }
            };
        // parse config file
        var config = new require('./parser/config.js')(file,logcnf);
        // dump template/html file
        var result = {},
            HtmlParser = require('./parser/html.js');
        ['DIR_SOURCE','DIR_SOURCE_TP'].forEach(function(key){
            var root = config.get(key);
            if (!root) return;
            var list = config.get(key+'_SUB');
            if (!!list){
                list.forEach(function(dir){
                    
                });
            }else{
                
            }
        });
    };
})();
/**
 * 导出单个文件
 * @param  {String} 文件路径
 * @param  {Object} 配置信息
 * @return {Void}
 */
exports.export = function(file,config){
    
};
