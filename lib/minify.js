var _log = require('./logger.js'),
     fs = require('fs'),
     ut = require('util'),
     parser = require('uglify-js');
// warn logger
parser.AST_Node.warn = function(){
    _log.warn(parser.string_template.apply(parser,arguments));
};
/**
 * 混淆NEJ规则API
 * @return {Void}
 */
var _doObfusecateAPI = (function(){
    var _fmap = {
        Dot:function(n){n.name=n.property;return n;},
        ObjectKeyVal:function(n){n.name=n.key;return n;},
        Var:function(n){var a = [];n.definitions.forEach(function(n){a.push(n.name);});return a;},
        VarDef:function(n){return n.name||{};},
        Function:function(n){return n.name||{};},
        If:function(n){return n.condition;},
        Defun:function(n){return n.name||{};},
        SymbolCatch:function(n){return n.definition();},
        Dft:function(n){return n;}
    };
    var _kmap = {
        Dot:'property',
        ObjectKeyVal:'key'
    };
    var _xmap = {
        1:function(c0,c1){
            return c0=='_'&&c1!='_'&&c1!='$';
        },
        2:function(c0,c1){
            return c0=='_'&&c1!='$';
        },
        3:function(c0,c1){
            return c0=='_';
        }
    };
    var _lname = -1;
    var _vardef = {lt:!0,gt:!0,amp:!0,nbsp:!0,quot:!0,apos:!0,copy:!0,reg:!0};
    var _doMapVar = function(_node){
        if (!_node) return;
        if (!ut.isArray(_node)){
            var _name = _node.mangled_name||_node.name;
            if (!!_name) _vardef[_name] = !0;
            return;
        }
        _node.forEach(_doMapVar);
    };
    var _doClearBags = function(_bags){
        for(var x in _bags){
            if (_vardef[_bags[x]]){
                delete _bags[x];
            }
        }
    };
    var _doGenNextName = function(_org,_bags){
        // return name from map
        var _name = _bags[_org];
        // renew name
        if (!_name){
            do{
                _name = parser.base54(++_lname);
            }while(
                !parser.is_identifier(_name)||
                !!_vardef[_name]
            );
        }
        return _name;
    };
    return function(_ast,_level,_bags,_except){
        var _result = {};
        var _canMangled = function(_name){
            _name = ''+_name;
            return _except.indexOf(_name)<0 && 
                   _xmap[_level](_name.charAt(0),_name.charAt(1));
        };
        var _to_mangle = [];
        var _tw = new parser.TreeWalker(function(_node){
            var _type = _node.TYPE,
                _xnod = (_fmap[_type]||_fmap.Dft)(_node);
            //console.log(_type+':'+_xnod.name);
            _doMapVar(_xnod);
            // check local variable
            if (_node instanceof parser.AST_Scope){
                _node.variables.each(function(n){
                    _doMapVar(n);
                });
            }
            // check api
            if (_node instanceof parser.AST_Dot ||
                _node instanceof parser.AST_ObjectKeyVal){
                if (_canMangled(_node.name)){
                    _to_mangle.push(_node);
                }
            }
        });
        _ast.walk(_tw);
        _doClearBags(_bags);
        _to_mangle.forEach(function(_node){
            var _type = _node.TYPE,
                _key = _kmap[_type],
                _name = _node.name,
                _nnew = _doGenNextName(_name,_bags);
            _node[_key] = _nnew;
            _bags[_name] = _nnew;
            _result[_name] = _nnew;
        });
        return _result;
    };
})();
/**
 * 混淆文件
 * @param  {Object} 文件列表{'a.js':['js code','file name',...],...}
 * @param  {Object} 配置信息{bags:{},obf_level:0,obf_line_mode:1,code_map:{}}
 * @return {Object} 输出内容{bags:{},files:{'a.js':'js code \n file content ...',...}}
 */
var __doObfuscate = (function(){
    var _doParseExcept = function(_bags){
        var _result = [
            '__proto__',
            '__defineGetter__',
            '__defineSetter__',
            '__lookupGetter__',
            '__lookupSetter__'
        ];
        for(var x in _bags){
            if (x==_bags[x]){
                _result.push(x);
                delete _bags[x];
            }
        }
        return _result;
    };
    return function(_files,_options){
        var _ast_map = {}, // ast map for source
            _code_map = _options.code_map||{};
        // parse ast
        var _arr = [];
        for(var x in _files){
            var _list = _files[x];
            for(var i=0,l=_list.length,_it,_ast;i<l;i++){
                _it = _list[i];
                if (!!_ast_map[_it]){
                    continue;
                }
                _ast = parser.parse(
                    _code_map[_it],{
                        filename:_it,
                        fromString:!0
                    }
                );
                _arr.push(_ast);
                _ast_map[_it] = _ast;
            }
        }
        // merge ast
        var _ast = _arr.shift().clone();
        for(var i=0,l=_arr.length,_it;i<l;i++){
            _it = _arr[i];
            _ast.body = _ast.body.concat(_it.body);
            _ast.end = _it.end;
        }
        // compress
        _ast.figure_out_scope();
        _ast = _ast.transform(
            parser.Compressor({
                sequences:!1,
                properties:!1,
                global_defs:{DEBUG:!1}
            })
        );
        // mangle local variables
        var _bags = _options.bags||{},
            _except = _doParseExcept(_bags);
        _ast.figure_out_scope();
        _ast.compute_char_frequency();
        _ast.mangle_names({
            sort:!0,
            screw_ie8:!0,
            except:_except
        });
        // mangle interface for nej
        var _newbags = {},
            _level = parseInt(_options.obf_level);
        if (isNaN(_level)){
            _level = 3;
        }
        if (_level>0){
            _ast.compute_char_frequency();
            _newbags = _doObfusecateAPI(
                _ast,_level,_bags,_except
            );
        }
        // generate code
        var stream;
        var _min_map = {};
        for(var x in _ast_map){
            _min_map[x] = _ast_map[x].print_to_string({
                screw_ie8:!0
            });
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
        return {bags:_newbags,files:_code};
    };
})();
// export api
exports.obfuscate = __doObfuscate;