/**
 * 新建工程结构、页面、组件、模块
 * @param  {Object} args 命令行参数
 * @return {Void}
 */
exports.new = function(args){
    console.log('do create');
};
/**
 * 运行当前项目下所有测试用例
 * @param  {Object} args 命令行参数
 * @return {Void}
 */
exports.test = function(args){
    console.log('do test');
};
/**
 * 初始化配置文件
 * @param  {Object} args 命令行参数
 * @return {Void}
 */
exports.init = function(args){
    console.log('do init');
};
/**
 * 构建项目
 * @param  {Object} args 命令行参数
 * @return {Void}
 */
exports.build = function(args){
    console.log('do build');
};
/**
 * 输出工具版本信息
 * @param  {Object} args 命令行参数
 * @return {Void}
 */
exports.version = function(args){
    console.log(
        'Toolkit Version is %s \n',
        require('../package.json').version
    );
};
