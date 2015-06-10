/*
 * Script Content Parser Adapter
 * @module   adapter/script
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
    path = require('path'),
    uglify = require('uglify-js');
// ast node checker
var AST_CHECKER = {
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
// reserved variable key
var KEY_RESERVED = ['lt','gt','amp','nbsp','quot','apos','copy','reg'];
// script parser
// map      file map, eg. {'/path/to/out.js':['/path/to/a.js','/path/to/b.js',...],...}
// code     code map, eg. {'/path/to/a.js':'var a = 111;','/path/to/b.js':'var b = 222;',...}
var Parser = module.exports =
    require('../util/klass.js').create();
var pro = Parser.extend(require('../util/event.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    // overwrite uglify logger
    uglify.AST_Node.
        warn_function =
            this._warn.bind(this);
    // merge code
    config = config||{};
    this._mergeCodeAndToAST(
        config.map||{},
        config.code||{}
    );
};
/**
 * parse code, compress code, mangle variables
 * @param  {Object}  config - config object
 * @param  {Object}  config.bags        - variable name will be mangled map
 * @param  {Number}  config.level       - obfuscate level, value between 0 and 3
 * @param  {Boolean} config.compatible  - use nej compatible mode
 * @param  {Boolean} config.dropconsole - drop console statement
 * @param  {Object}  config.sourcemap   - output source map config
 * @return {Void}
 */
pro.parse = function(config){
    config = config||{};
    this._result = {};
    // mangle local variables
    this._ast.figure_out_scope();
    this._ast.compute_char_frequency();
    var bags = config.bags||{},
        except = this._getMangleExcept(bags);
    this._ast.mangle_names({
        sort:!0,
        except:except
    });
    // mangle api
    var level = parseInt(config.level,10);
    if (isNaN(level)||level<0||level>3){
        level = 3;
    }
    if (level>0){
        this._ast.compute_char_frequency();
        this._mangleAPI(level,bags,except);
    }
    this._generateOutput(config||{});
};
/**
 * dump result after uglify
 * @return {Object} parse result, eg. {bags:{},code:{},sourcemap:{}}
 */
pro.dump = function(){
    return this._result;
};
/**
 * output uglifyjs warn logger
 * @private
 * @return {Void}
 */
pro._warn = function(msg){
    this.emit('debug',{
        message:msg
    });
};
/**
 * dump mangle except variables
 * @private
 * @param  {Object} bags - mangled variables map
 * @return {Array}  variables list
 */
pro._getMangleExcept = function(bags){
    var ret = [
        '__proto__',
        '__defineGetter__',
        '__defineSetter__',
        '__lookupGetter__',
        '__lookupSetter__'
    ];
    bags = bags||{};
    Object.keys(bags).forEach(function(key){
        var value = bags[key];
        if (key===value){
            ret.push(key);
            delete bags[key];
        }
    });
    return ret;
};
/**
 * merge code and generator ast
 * @private
 * @param  {Object} map - file map
 * @param  {Object} codes - code map
 */
pro._mergeCodeAndToAST = function(map,codes){
    // merge code
    this._asts = {};
    this._code = {};
    // top level ast
    this._ast = uglify.parse(
        '',{fromString:!0}
    );
    Object.keys(map).forEach(
        function(file){
            // merge source
            var ret = [];
            if (typeof map[file]==='string'){
                ret.push(map[file]);
            }else{
                map[file].forEach(function(name){
                    var code = codes[name];
                    if (!code){
                        this.emit('warn',{
                            data:[name],
                            message:'empty js code for file %s'
                        });
                    }else{
                        ret.push(code);
                    }
                },this);
            }
            try{
                // parse ast
                var code = ret.join('\n'),
                    ast = uglify.parse(
                        code,{
                            fromString:!0,
                            filename:file
                        }
                    );
                this._code[file] = code;
                this._asts[file] = ast;
                // merge ast
                this._ast.body =
                    this._ast.body.concat(ast.body);
                this._ast.end = ast.end;
            }catch(ex){
                var files = {},
                    name = path.basename(file);
                files[name] = code;
                // dump error source code
                var source = [],
                    index = ex.line-1;
                for(var i=Math.max(0,index-2),
                        l=Math.min(ret.length,index+4);i<l;i++){
                    var sep = index===i?'-->\t':'\t\t';
                    source.push(sep+(i+1)+':\t'+ret[i]);
                }
                // trigger error event
                this.emit(
                    'error',{
                        files:files,
                        data:[file,name,ex.message,ex.line,ex.col,source.join('\n')],
                        message:'js code parse error for %s, source code in %s, exception information :\n%s at line %s col %s\n'
                    }
                )
            }
        },this
    );
};
/**
 * mangle api variables
 * @private
 * @param  {Number} level  - obfuscate level
 * @param  {Object} bags   - name mangled map
 * @param  {Array}  except - variable reserved array
 * @return {Void}
 */
pro._mangleAPI = (function(){
    var _varMap;
    var _doMapVariables = function(node){
        if (!node){
            return;
        }
        // cache mangled variables
        if (!util.isArray(node)){
            var name = node.mangled_name||node.name;
            if (name!=null){
                _varMap[name] = !0;
            }
            return;
        }
        node.forEach(_doMapVariables);
    };
    var _doClearVariables = function(bags){
        Object.keys(bags).forEach(function(key){
            var name = bags[key];
            if (_varMap[name]){
                delete bags[key];
            }else{
                _varMap[name] = !0;
            }
        });
    };
    var _next;
    var _doGenNextName = function(orig,bags){
        var name = bags[orig];
        if (!name){
            do{
                name = uglify.base54(++_next);
            }while(
                !uglify.is_identifier(name)||!!_varMap[name]
            )
        }
        return name;
    };
    var _keyMap = {
        Dot:'property',
        ObjectKeyVal:'key',
        SymbolRef:'mangled_name'
    };
    var _isNodeNeedMangle = function(node){
        var ret = !1;
        Object.keys(_keyMap).some(function(key){
            if (node instanceof uglify['AST_'+key]){
                ret = !0;
                return ret;
            }
        });
        return ret;
    };
    var _levelMap = {
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
    var _isNameNeedMangle = function(name,level,except){
        name = ''+name;
        return except.indexOf(name)<0&&
            _levelMap[level](
                name.charAt(0),name.charAt(1)
            );
    };
    return function(level,bags,except){
        // init reserved key list
        _next = -1;
        _varMap = {};
        uglify.base54.reset();
        KEY_RESERVED.forEach(function(key){
            _varMap[key] = !0;
        });
        // dump mangled node list
        var list = [];
        var walker = new uglify.TreeWalker(function(node){
            var type = node.TYPE,
                target = AST_CHECKER[type]||AST_CHECKER['Dft'](node);
            _doMapVariables(target);
            // check local variables
            if (node instanceof uglify.AST_Scope){
                node.variables.each(_doMapVariables);
            }
            // check api or property
            if (_isNodeNeedMangle(node)&&
                !target.mangled_name&&
                _isNameNeedMangle(node.name,level,except)){
                list.push(node);
            }
        });
        this._ast.walk(walker);
        _doClearVariables(bags);
        // mangle api variables
        var ret = {};
        list.forEach(function(node){
            var type = node.TYPE,
                key = _keyMap[type],
                name = node.name,
                mangled = _doGenNextName(name,bags);
            // update node value
            if (type==='SymbolRef'){
                node.definition()[key] = mangled;
            }else{
                node[key] = mangled;
            }
            // save and lock new name
            _varMap[mangled] = !0;
            bags[name] = mangled;
            ret[name] = mangled;
        });
        this._result.bags = ret;
    };
})();
/**
 * generate output content
 * @private
 * @param  {Object} opt - source map output config
 * @param  {String} opt.sourcemap   - source map config, eg. {root:''}
 * @param  {Boolean} opt.compatible - compatiable for nej
 * @return {Void}
 */
pro._generateOutput = function(opt){
    // init config
    var config = {
        max_line_len:10000
    };
    var compressor = uglify.Compressor({
        sequences:!1,
        properties:!1,
        conditionals:!1,
        drop_console:!!opt.dropconsole,
        global_defs:{
            DEBUG:!1,
            CMPT:!!opt.compatible
        }
    });
    // init output code
    var root = (opt.sourcemap||{}).root;
    this._result.code = {};
    if (!!root){
        this._result.sourcemap = {};
    }
    // do output
    Object.keys(this._asts).forEach(
        function(file){
            var ast = this._asts[file];
            // compress first
            ast.figure_out_scope();
            ast = ast.transform(compressor);
            // need output source map
            if (!!root){
                var name = path.basename(file);
                config.source_map = uglify.SourceMap({
                    file:name,root:'',orig:null
                });
                config.source_map.get().setSourceContent(
                    name,this._code[file]
                );
            }
            // output code
            var code = ast.print_to_string(config);
            // check source map
            if (!!root){
                code += '\n//# sourceMappingURL='+root+name+'.map ';
                this._result.sourcemap[name+'.map'] = ''+config.source_map;
            }
            // save code
            this._result.code[file] = code;
        },this
    );
};