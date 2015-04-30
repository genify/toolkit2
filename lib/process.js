var _logger = require('./util/logger.js');
/**
 * 根据配置文件发布项目
 * @param  {String} file 配置文件路径
 * @return {Void}
 */
exports.release = function(file){
    var config = new require('./parser/config.js')(file,{
        warn:_logger.warn.bind(_logger),
        error:function(){
            _logger.error.apply(_logger,arguments);
            process.exist(1);
        }
    });
    
};
/**
 * 导出单个文件
 * @param  {String} 文件路径
 * @return {Void}
 */
exports.export = function(file){
    
};
