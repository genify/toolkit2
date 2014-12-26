var _log = require('../logger.js'),
    _fs = require('../file.js'),
    _cg = require('./config.js'),
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
var __doObfuscateAPI = (function(){
    var _fmap = {
        Dot:function(n){n.name=n.property;return n;},
        ObjectKeyVal:function(n){n.name=n.key;return n;},
        Var:function(n){var a = [];n.definitions.forEach(function(n){a.push(n.name);});return a;},
        VarDef:function(n){return n.name||{};},
        Function:function(n){return n.name||{};},
        If:function(n){return n.condition;},
        Defun:function(n){return n.name||{};},
        SymbolRef:function(n){return n.definition();},
        SymbolCatch:function(n){return n.definition();},
        Dft:function(n){return n;}
    };
    var _kmap = {
        Dot:'property',
        ObjectKeyVal:'key',
        SymbolRef:'mangled_name'
    };
    var _isCheckNode = function(_node){
        for(var x in _kmap){
            if (_node instanceof parser['AST_'+x]){
                return !0;
            }
        }
        return !1;
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
            if (_name!=null) _vardef[_name] = !0;
            return;
        }
        _node.forEach(_doMapVar);
    };
    var _doClearBags = function(_bags){
        //console.log('%j',_vardef);
        for(var x in _bags){
            var _it = _bags[x];
            if (_vardef[_it]){
                delete _bags[x];
            }else{
                _vardef[_it] = !0;
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
            //console.log(_type+':'+_xnod.name+'-'+_xnod.mangled_name);
            _doMapVar(_xnod);
            // check local variable
            if (_node instanceof parser.AST_Scope){
                _node.variables.each(function(n){
                    _doMapVar(n);
                });
            }
            // check api or property
            if (_isCheckNode(_node)){
                if (!_xnod.mangled_name&&_canMangled(_node.name)){
                    //console.log('to mangle '+_node.TYPE+':'+_node.name);
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
            //console.log('%s -> %s',_name,_nnew);
            // update node
            if (_type==='SymbolRef'){
                _node.definition()[_key] = _nnew;
            }else{
                _node[_key] = _nnew;
            }
            // save new name
            _vardef[_nnew] = !0;
            _bags[_name] = _nnew;
            _result[_name] = _nnew;
        });
        return _result;
    };
})();
/**
 * 混淆文件
 * @param  {Object} 文件列表{'a.js':['js code','file name',...],...}
 * @param  {Object} 配置信息{bags:{},obf_level:0,code_map:{},source_map:{},compatible:true}
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
    var _doMergeAndToAST = function(_files,_map,_k2n){
        var _ast = {},
            _fmap = {},
            _result = {};
        for(var x in _files){
            var _arr = [];
            var _name = x;
            if (!!_k2n){
                _name = _k2n(x);
                _fmap[x] = _name;
                _name += '.js';
            }
            _files[x].forEach(function(_name){
                var _code = _map[_name];
                if (!_code){
                    _log.warn('empty js code for file %s',_name);
                }else{
                    _arr.push(_code);
                }
            });
            var _code = _arr.join('\n');
            _result[_name] = _code;
            try{
                _ast[x] = parser.parse(
                    _code,{
                        fromString:!0,
                        filename:_name
                    }
                );
            }catch(e){
                var _xyz = _cg.get('DIR_CONFIG')+(+new Date)+'.js';
                _log.error('output error code to %s',_xyz);
                _fs.write(_xyz,_code);
                _log.error('%s -> %s',x,e);
            }
        }
        return {
            ast:_ast,
            fmap:_fmap,
            code:_result
        };
    };
    var _doMergeAST = function(_ast){
        var _top;
        for(var x in _ast){
            var _it = _ast[x];
            if (!_top){
                _top = _it.clone();
                continue;
            }
            _top.body = _top.body.concat(_it.body);
            _top.end = _it.end;
        }
        return _top;
    };
    var _doCompressAST = function(_ast,_compatible,_noconsole){
        _ast.figure_out_scope();
        return _ast.transform(
            parser.Compressor({
                sequences:!1,
                properties:!1,
                conditionals:!1,
                global_defs:{
                    DEBUG:!1,
                    CMPT:!!_compatible
                },
                drop_console:!!_noconsole
            })
        );
    };
    var _doMangleLocal = function(_ast,_except){
        _ast.figure_out_scope();
        _ast.compute_char_frequency();
        _ast.mangle_names({
            sort:!0,
            except:_except
        });
    };
    var _doMangleAPI = function(_ast,_options){
        var _newbags = {},
            _level = parseInt(_options.level);
        if (isNaN(_level)){
            _level = 3;
        }
        if (_level>0){
            _ast.compute_char_frequency();
            _newbags = __doObfuscateAPI(
                _ast,_level,
                _options.bags,
                _options.except
            );
        }
        return _newbags;
    };
    var _doOutputCode = function(_result,_root){
        var _map = _result.ast,
            _fmap = _result.fmap,
            _smap = _result.code,
            _conf = {
                max_line_len:10000
            },
            _result = {code:{},smap:{}};
        for(var x in _map){
            var _name = _fmap[x];
            if (!!_root){
                var _file = _name+'.js';
                _conf.source_map = new parser.SourceMap({
                    file:_file,
                    root:'',
                    orig:null
                });
                _conf.source_map.get().setSourceContent(
                     _file,_smap[_file]
                 );
            }
            var _stream = new parser.OutputStream(_conf);
            _map[x].print(_stream);
            var _code = _stream+'';
            if (!!_root){
                // map file relative to url
                _code += "\n//# sourceMappingURL="+_root+_name+'.map ';
                _result.smap[_name+'.map'] = _conf.source_map+'';
            }
            _result.code[x] = _code;
        }
        return _result;
    };
    return function(_files,_options){
        var _code_map = _options.code_map||{};
        // merge source 
        // {ast:xx,code:xxx}
        _log.info('OBF-0 -> merge source code');
        var _result = _doMergeAndToAST(
            _files,_code_map,
           (_options.source_map||{}).key2name
        );
        // merge ast
        _log.info('OBF-1 -> merge AST');
        var _ast = _doMergeAST(_result.ast);
        // compress
        _log.info('OBF-2 -> compress source code');
        var _ast = _doCompressAST(
            _ast,
            _options.compatible,
            _options.noconsole
        );
        // mangle local variables
        _log.info('OBF-3 -> mangle local variables');
        var _bags = _options.bags||{},
            _except = _doParseExcept(_bags);
        _doMangleLocal(_ast,_except);
        // mangle interface for nej
        _log.info('OBF-4 -> try mangle nej api');
        var _newbags = _doMangleAPI(_ast,{
            level:_options.obf_level,
            except:_except,
            bags:_bags
        });
        // generate code
        _log.info('OBF-5 -> output minified code');
        var _output = _doOutputCode(
            _result,(_options.source_map||{}).root
        );
        _log.info('OBF-6 -> obfuscate done');
        return {
            bags:_newbags,     // var maps
            maps:_output.smap, // source map
            files:_output.code // minify code
        };
    };
})();
// export api
exports.obfuscate = __doObfuscate;