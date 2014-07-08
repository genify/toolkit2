var _log = require('./logger.js'),
     fs = require('fs'),
     parser = require('uglify-js');
// extend for uglify-js
with(parser){
    
    AST_Toplevel.DEFMETHOD("_default_mangler_options", function(options){
        return defaults(options, {
            level       : 0,
            except      : [],
            identifiers : {},
            eval        : false,
            sort        : false,
            toplevel    : false,
            screw_ie8   : false
        });
    });

}


/*
 * 合并语法树
 * @return {Void}
 */
var __doCombineAST = function(_asts){
    var _toplevel = _asts.shift().clone();
    _asts.forEach(function(_ast){
        _toplevel.body = _toplevel.body.concat(_ast.body);
        _toplevel.end = _ast.end;
    });
    return _toplevel;
};
/**
 * 混淆文件
 * @param  {Object} 文件列表{'a.js':['js code','file name',...],...}
 * @param  {Object} 配置信息{bags:{},obf_level:0,obf_line_mode:1,code_map:{}}
 * @return {Object} 输出内容{bags:{},files:{'a.js':'js code \n file content ...',...}}
 */
var __doObfuscate = function(_files,_options){
    var _ast_map = {}, // ast map for source
        _code_map = _options.code_map||{};
    // parse ast
    var _arr = [];
    for(var x in _code_map){
        var _ast = parser.parse(
            _code_map[x],{
                filename:x,
                fromString:!0
            }
        );
        _arr.push(_ast);
        _ast_map[x] = _ast;
    }
    // merge ast
    var _ast = __doCombineAST(_arr);
    // compress
    _ast.figure_out_scope();
    _ast = _ast.transform(
        parser.Compressor({
            global_defs:{
                DEBUG:!1
            }
        })
    );
    // mangle
    _ast.figure_out_scope();
    _ast.compute_char_frequency();
    _ast.mangle_names({
        level:_options.obf_level,
        identifiers:_options.bags
    });
    // output
    var stream;
    var _min_map = {};
    for(var x in _ast_map){
        stream = parser.OutputStream({});
        _ast_map[x].print(stream);
        _min_map[x] = ''+stream;
    }
    // merge result
    var _code = {},
        _sep = _options.obf_line_mode==1?'\n':'';
    for(var x in _files){
        var _arr = [];
        var _list = _files[x];
        for(var i=0,l=_list.length,_it;i<l;i++){
            _it = _min_map[_list[i]]||'';
            // push no-empty code
            if (!!_it&&_it!='void 0;'){
                _arr.push(_it);
            }
        }
        _code[x] = _arr.join(_sep);
    }
    return {bags:{},code:_code};
};
// export api
exports.obfuscate = __doObfuscate;