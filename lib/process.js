/**
 * 根据配置文件发布项目
 * @param  {String} file 配置文件路径
 * @return {Void}
 */
exports.deploy = (function(){
    var _doDumpFile = function(){
        
    };
    return function(file){
        var fs = require('./util/file.js'),
            logger = require('./util/logger.js'),
            logcnf = {
                debug:logger.debug.bind(logger),
                info:logger.info.bind(logger),
                warn:logger.warn.bind(logger),
                error:function(){
                    logger.error.apply(logger,arguments);
                    process.exist(-1);
                }
            };
        // parse config file
        var ConfigParser = require('./parser/config.js'),
            config = new ConfigParser(file,logcnf);
        logger.config({
            level:config.get('X_LOGGER_LEVEL'),
            onlog:function(event){
                
            }
        });
        // dump template/html file
        var result = {},
            HtmlParser = require('./parser/html.js');
        ['DIR_SOURCE','DIR_SOURCE_TP'].forEach(function(key){
            var root = config.get(key);
            if (!root) return;
            var filter = config.get('FILE_FILTER');
            (config.get(key+'_SUB')||[root]).forEach(function(dir){
                var list = fs.lsfile(dir,function(name,path){
                    return !/^\./.test(name)&&(!filter||filter.test(path));
                });
                list.forEach(function(file){
                    result[file] = new HtmlParser({
                        file:file
                    },logcnf);
                });
            });
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
