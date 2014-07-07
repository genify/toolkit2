var esprima = require('esprima');
/**
 * 混淆文件
 * @param  {Object} 文件列表{'a.js':['js code','file name',...],...}
 * @param  {Object} 配置信息{bags:{},obf_level:0,obf_line_mode:1,code_map:{}}
 * @return {Object} 输出内容{bags:{},files:{'a.js':'js code \n file content ...',...}}
 */
var __doObfuscate = function(_files,_options){
    var _result = {bags:{},files:{}};
    
    return _result;
};
// export api
exports.obfuscate = __doObfuscate;