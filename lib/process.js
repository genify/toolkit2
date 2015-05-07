/**
 * 根据配置文件发布项目
 * @param  {String} file 配置文件路径
 * @return {Void}
 */
exports.deploy = function(file){
    new require('./parser/processor.js')(file);
};
/**
 * 导出单个文件
 * @param  {String} 文件路径
 * @param  {Object} 配置信息
 * @return {Void}
 */
exports.export = function(file,config){
    
};
