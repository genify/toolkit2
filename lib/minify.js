var _log = require('./logger.js'),
     fs = require('fs'),
     ut = require('util'),
     parser = require('uglify-js');
     
// extend/overwrite for uglify-js base54
parser.base54 = (function() {
    var string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var chars, frequency;
    function reset() {
        frequency = Object.create(null);
        chars = string.split("").map(function(ch){ return ch.charCodeAt(0) });
        chars.forEach(function(ch){ frequency[ch] = 0 });
    }
    base54.consider = function(str){
        for (var i = str.length; --i >= 0;) {
            var code = str.charCodeAt(i);
            if (code in frequency) ++frequency[code];
        }
    };
    base54.sort = function() {
        chars = mergeSort(chars, function(a, b){
            if (is_digit(a) && !is_digit(b)) return 1;
            if (is_digit(b) && !is_digit(a)) return -1;
            return frequency[b] - frequency[a];
        });
    };
    base54.reset = reset;
    reset();
    base54.get = function(){ return chars };
    base54.freq = function(){ return frequency };
    function base54(num) {
        var ret = "", base = 52;
        do {
            ret += String.fromCharCode(chars[num % base]);
            num = Math.floor(num / base);
            base = 62;
        } while (num > 0);
        return ret;
    };
    return base54;
})();
/**
 * 混淆NEJ规则API
 * @return {Void}
 */
var _doObfusecateAPI = (function(){
    var _fmap = {
        Var:function(n){var a = [];n.definitions.forEach(function(n){a.push(n.name);});return a;},
        VarDef:function(n){return n.name||{};},
        Function:function(n){return n.name||{};},
        If:function(n){return n.condition;},
        Defun:function(n){return n.name||{};},
        SymbolCatch:function(n){return n.definition();},
        Dft:function(n){return n;}
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
    var _vardef = {};
    var _doMapVar = function(_node){
        if (!_node) return;
        if (!ut.isArray(_node)){
            var _name = _node.mangled_name||_node.name;
            if (!!_name) _vardef[_name] = !0;
            return;
        }
        _node.forEach(_doMapVar);
    };
    var _doGenNextName = function(_org,_bags){
        // return name from map
        var _name = _bags[_org];
        // renew name
        if (!_name||!!_vardef[_name]){
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
            return _except.indexOf(_name)<0 && 
                   _xmap[_level](_name.charAt(0),_name.charAt(1));
        };
        var _to_mangle = [];
        var _tw = new parser.TreeWalker(function(_node){
            var _type = _node.TYPE;
            _doMapVar((_fmap[_type]||_fmap.Dft)(_node));
            // check local variable
            if (_node instanceof parser.AST_Scope){
                _node.variables.each(function(n){
                    _doMapVar(n);
                });
            }
            // check api
            if (_node instanceof parser.AST_Dot){
                if (_canMangled(_node.property)){
                    _node.name = _node.property;
                    _to_mangle.push(_node);
                    _doMapVar(_node);
                }
            }
        });
        _ast.walk(_tw);
        _to_mangle.forEach(function(_node){
            var _name = _node.property;
            _node.property = _doGenNextName(_name,_bags);
            _result[_name] = _node.property;
        });
        
        fs.writeFileSync('./out.json',JSON.stringify(_vardef,null,'\t'));
        
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
        var _result = [];
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
        return {bags:_newbags,code:_code};
    };
})();
// export api
exports.obfuscate = __doObfuscate;