/*
 * JST模板引擎实现文件
 * http://code.google.com/p/trimpath/
 */
var _tcache = {}, // jst string cache
    _stack  = [], // loop statement stack
    _rspc   = /\s+/g,
    _seed   = +new Date,
    _trim,
    _config;
/*
 * 解析{for x in b}字符串的前缀
 * @param  {Array} _part 按空格拆分的值,['for','x','in','b']
 * @return {String}      解析后的前缀值
 */
var __doParsePrefixFor = function(_part){
    if (_part[2]!='in')
        throw 'bad for loop statement: '+_part.join(' ');
    _stack.push(_part[1]);
    return 'var __HASH__'+_part[1]+' = '+_part[3]+','+
                _part[1]+','+_part[1]+'_count=0;'+
           'if (!!__HASH__'+_part[1]+')'+
               'for(var '+_part[1]+'_key in __HASH__'+_part[1]+'){'+
                    _part[1]+' = __HASH__'+_part[1]+'['+_part[1]+'_key];'+
                    'if (!'+_part[1]+'||typeof('+_part[1]+')=="function") continue;'+
                    _part[1]+'_count++;';
};
/*
 * 解析{forelse}字符串的前缀
 * @return {String} 解析后的前缀值
 */
var __doParsePrefixForElse = function(){
    var _part = _stack[_stack.length-1];
    return '}; if(!__HASH__'+_part+'||!'+_part+'_count){';
};
/*
 * 解析{/for}字符串的前缀
 * @return {String} 解析后的前缀值
 */
var __doParsePrefixForEnd = function(){
    _stack.pop();
    return '};';
};
/*
 * 解析{list seq as x}或者{list 1..100 as x}字符串的前缀
 * @param  {Array} _part 按空格拆分的值,['list','seq','as','x']
 * @return {String}       解析后的前缀值
 */
var __doParsePrefixList = function(_part){
    if (_part[2]!='as')
        throw 'bad for list loop statement: '+_part.join(' ');
    var _seq = _part[1].split('..');
    if (_seq.length>1){
        // {list 1..100 as x}
        return 'for(var '+_part[3]+','+_part[3]+'_index=0,'+
                    _part[3]+'_beg='+_seq[0]+','+_part[3]+'_end='+_seq[1]+','+
                    _part[3]+'_length=parseInt('+_part[3]+'_end-'+_part[3]+'_beg+1);'+
                    _part[3]+'_index<'+_part[3]+'_length;'+_part[3]+'_index++){'+
                    _part[3]+' = '+_part[3]+'_beg+'+_part[3]+'_index;';
    }else{
        // {list seq as x}
        return 'for(var __LIST__'+_part[3]+' = '+_part[1]+','+
                    _part[3]+','+_part[3]+'_index=0,'+
                    _part[3]+'_length=__LIST__'+_part[3]+'.length;'+
                    _part[3]+'_index<'+_part[3]+'_length;'+_part[3]+'_index++){'+
                    _part[3]+' = __LIST__'+_part[3]+'['+_part[3]+'_index];';
    }
};
/*
 * 解析{macro macroName(arg1,arg2,...argN)}字符串的前缀
 * @param  {Array} _part 按空格拆分的值,['macro','macroName(arg1,arg2,...argN)']
 * @return {String}       解析后的前缀值
 */
var __doParsePrefixMacro = function(_part){
    if (!_part||!_part.length) return;
    _part.shift(); // remove macro key word
    var _name = _part[0].split('(')[0];
    return 'var '+_name+' = function'+_part.join('').replace(_name,'')+'{var __OUT=[];';
};
// jst configuration
_config = {
    blk : /^\{(cdata|minify|eval)/i,
    tag : 'forelse|for|list|if|elseif|else|var|macro|break|notrim|trim',
    // {pmin : min param number,
    //  pdft : param default value,
    //  pfix : statement prefix,
    //  sfix : statement suffix}
    def : {
        'if'     : {pfix:'if(',sfix:'){',pmin:1},
        'else'   : {pfix:'}else{'},
        'elseif' : {pfix:'}else if(',sfix:'){',pdft:'true'},
        '/if'    : {pfix:'}'},
        'for'    : {pfix:__doParsePrefixFor,pmin:3},
        'forelse': {pfix:__doParsePrefixForElse},
        '/for'   : {pfix:__doParsePrefixForEnd},
        'list'   : {pfix:__doParsePrefixList,pmin:3},
        '/list'  : {pfix:'};'},
        'break'  : {pfix:'break;'},
        'var'    : {pfix:'var ',sfix:';'},
        'macro'  : {pfix:__doParsePrefixMacro},
        '/macro' : {pfix:'return __OUT.join(\'\'); };'},
        'trim'   : {pfix:function(){_trim = !0;}},
        '/trim'  : {pfix:function(){_trim = null;}}
    },
    ext : {
        'seed'   : function(_prefix){return (_prefix||'')+_seed;},
        'default': function(_value,_default){return _value||_default;},
        'parse'  : function(_value){var _arr = _value.split('.');return _arr[1]=='prototype'?(_arr[0].toLowerCase()+'.'+_arr[2]):_value;}
    }
};
/*
 * 解析语句，如{if customer != null && customer.balance > 1000}
 * @param  {String} _content 待解析语句
 * @param  {Array}  _out     内容输出
 * @return {Void}
 */
var __doParseStatement = function(_content,_out){
    var _part = _content.slice(1, -1).split(_rspc),
        _conf = _config.def[_part[0]];
    if (!_conf){__doParseSectionText(_content,_out);return;}
    if (!!_conf.pmin&&_conf.pmin>=_part.length)
        throw 'Statement needs more parameters:'+_content;
    // parse prefix
    _out.push((!!_conf.pfix&&
               typeof(_conf.pfix)!='string')
               ?_conf.pfix(_part):(_conf.pfix||''));
    // parse params and suffix
    if (!!_conf.sfix){
        if (_part.length<=1) {
            if (!!_conf.pdft) _out.push(_conf.pdft);
        }else{
            for(var i=1,l=_part.length;i<l;i++){
                if (i>1) _out.push(' ');
                _out.push(_part[i]);
            }
        }
        _out.push(_conf.sfix);
    }
};
/*
 * 解析内容，内容中可能包含换行
 * @param  {String} _content 待解析语句
 * @param  {Array}  _out     内容输出
 * @return {Void}
 */
var __doParseSectionText = function(_content,_out){
    if (!_content) return;
    var _lines = _content.split('\n');
    if (!_lines||!_lines.length) return;
    for(var i=0,l=_lines.length,_line;i<l;i++){
        _line = _lines[i];
        if (!!_trim){
            _line = _line.trim();
            if (!_line) continue;
        } 
        __doParseSectionTextLine(_line,_out);
        if (!!_trim&&i<l-1) _out.push('__OUT.push(\'\\n\');');
    }
};
/*
 * 解析内容，内容中可能包含${a}或者${%a%}取值语句
 * @param  {String} _content 待解析语句
 * @param  {Array}  _out     内容输出
 * @return {Void}
 */
var __doParseSectionTextLine = (function(){
    var _raor = /\|\|/g,
        _rvor = /#@@#/g;
    return function(_content,_out){
        // defined used variable
        var _prvmrkend = '}',_prvexpend = -1,
            _length = _content.length,
            _begin,_end,_begexp,_endexp,_exparr;
        while((_prvexpend+_prvmrkend.length)<_length){
            _begin = '${'; _end = '}';
            _begexp = _content.indexOf(_begin,_prvexpend+_prvmrkend.length);
            if (_begexp<0) break;
            // parse ${% customer.firstName %} syntax
            if (_content.charAt(_begexp+2)=='%'){
                _begin = '${%'; _end = '%}';
            }
            _endexp = _content.indexOf(_end,_begexp+_begin.length);
            if (_endexp<0) break;
            __doParseText(_content.substring(_prvexpend+_prvmrkend.length,_begexp),_out);
            // parse expression: 'firstName|default:"John Doe"|capitalize'.split('|')
            _exparr = _content.substring(_begexp+_begin.length,_endexp).replace(_raor,'#@@#').split('|');
            for(var i=0,l=_exparr.length;i<l;_exparr[i]=_exparr[i].replace(_rvor,'||'),i++);
            _out.push('__OUT.push('); __doParseExpression(_exparr,_out); _out.push(');');
            _prvmrkend = _end; _prvexpend = _endexp;
        }
        __doParseText(_content.substring(_prvexpend+_prvmrkend.length),_out);
    };
})();
/*
 * 解析纯文本内容，不包含需要解析的内容
 * @param  {String} _content 待解析内容
 * @param  {Array}  _out     内容输出
 * @return {Void}
 */
var __doParseText = (function(){
    var _map = {r:/\n|\\|\'/g,'\n':'\\n','\\':'\\\\','\'':'\\\''};
    var _doEncode = function(_content){
        return (_content||'').replace(_map.r,
                function($1){
                    var _result = _map[$1];
                    return _result!=null?_result:$1;
                });
    };
    return function(_content,_out){
        if (!_content) return;
        _out.push('__OUT.push(\''+_doEncode(_content)+'\');');
    };
})();
/*
 * 解析表达式，如['firstName','default:"John Doe"','capitalize']
 * @param  {Array}  _exps  表达式内容
 * @param  {Number} _index 表达式索引
 * @param  {Array}  _out   内容输出
 * @return {Void}
 */
var __doParseExpression = function(_exps,_out){
    // foo|a:x|b:y1,y2|c:z1,z2 -> c(b(a(foo,x),y1,y2),z1,z2)
    if (!_exps||!_exps.length) return;
    if (_exps.length==1){
        _out.push(_exps.pop());return;
    }
    var _exp = _exps.pop().split(':');
    _out.push('__MDF[\''+_exp.shift()+'\'](');
    __doParseExpression(_exps,_out);
    if (_exp.length>0)
        _out.push(','+_exp.join(':'));
    _out.push(')');
};
/*
 * 解析模板为执行函数
 * @param  {String}   _content 模板内容
 * @return {Function}          模板执行函数
 */
var __doParseTemplate = (function(){
    var _rtab = /\t/g,
        _rnln = /\n/g,
        _rlne = /\r\n?/g;
    return function(_content){
        _content = _content.replace(_rlne,'\n').replace(_rtab,'    ');
        var _ftxt = ['if(!__CTX) return \'\';var __OUT=[];with(__CTX){'];
        // defiend used variables
        var _prvend = -1,_length = _content.length;
        var _stmtbeg,_stmtend,_statement,
            _blockrx,_blktmp,_blkend,_blkmrk,_blktxt;
        // search content
        while((_prvend+1)<_length){
            // search statement begin
            _stmtbeg = _prvend;
            _stmtbeg = _content.indexOf("{",_stmtbeg+1);
            while(_stmtbeg>=0){
                _stmtend = _content.indexOf("}",_stmtbeg+1);
                _statement = _content.substring(_stmtbeg,_stmtend);
                _blockrx = _statement.match(_config.blk);
                // minify/eval/cdata implementation
                if (!!_blockrx){
                    _blktmp = _blockrx[1].length+1;
                    _blkend = _content.indexOf('}',_stmtbeg+_blktmp);
                    if (_blkend>=0){
                        // gen block end marker
                        _blkmrk = _blkend-_stmtbeg-_blktmp<=0
                                ? ('{/'+_blockrx[1]+'}')
                                : _statement.substr(_blktmp+1);
                        _blktmp = _content.indexOf(_blkmrk,_blkend+1);
                        // parse block content
                        if (_blktmp>=0){
                            __doParseSectionText(_content.substring(_prvend+1,_stmtbeg),_ftxt);
                            // get block text and parse
                            _blktxt = _content.substring(_blkend+1,_blktmp);
                            switch(_blockrx[1]){
                                case 'cdata' : __doParseText(_blktxt,_ftxt); break;
                                case 'minify': __doParseText(_blktxt.replace(_rnln,' ').replace(_rspc,' '),_ftxt); break;
                                case 'eval'  : if (!!_blktxt) _ftxt.push('__OUT.push((function(){'+_blktxt+'})());'); break;
                            }
                            _stmtbeg = _prvend = _blktmp+_blkmrk.length-1;
                        }
                    }
                }else if(_content.charAt(_stmtbeg-1)!='$'&&
                         _content.charAt(_stmtbeg-1)!='\\'&&
                         _statement.substr(_statement.charAt(1)=='/'?2:1)
                                                     .search(_config.tag)==0){
                    // break when result is a statement
                    break;
                }
                _stmtbeg = _content.indexOf("{",_stmtbeg+1);
            }
            if (_stmtbeg<0) break;
            _stmtend = _content.indexOf("}",_stmtbeg+1);
            if (_stmtend<0) break;
            // parse content
            __doParseSectionText(_content.substring(_prvend+1,_stmtbeg),_ftxt);
            __doParseStatement(_content.substring(_stmtbeg,_stmtend+1),_ftxt);
            _prvend = _stmtend;
        }
        __doParseSectionText(_content.substring(_prvend+1),_ftxt);
        _ftxt.push('};return __OUT.join(\'\');');
        return new Function('__CTX','__MDF',_ftxt.join(''));
    };
})();
// interface
var _e = exports;
/**
 * 根据模板的序列号合并模板数据
 * @param  {String} _sn     模板序列号
 * @param  {Object} _data   模板数据
 * @param  {Object} _extend 扩展接口
 * @return {String}         合并数据后的内容
 */
_e.get = (function(){
    var _fcache = {};
    return function(_sn,_data,_extend){
        try{
            _data = _data||{};
            if (!_fcache[_sn]&&!_tcache[_sn])
                return '';
            if (!_fcache[_sn]){
                _fcache[_sn] = __doParseTemplate(_tcache[_sn]);
                delete _tcache[_sn];
            }
            _data.defined = function(_key){
                return _data[_key]!=null;
            };
            if (!!_extend)
                for(var p in _config.ext)
                    _extend[p] = _config.ext[p];
            return _fcache[_sn](_data,_extend||_config.ext);
        }catch(ex){
            console.log(ex.stack);
            return ex.message||'';
        }
    };
})();
/**
 * 添加JST模板，JST模板可以是节点的值
 * @param  {String}  _content JST模板内容
 * @return {String}           JST模板在缓存中的序列号
 */
_e.add = (function(){
    var _rand = +new Date;
    return function(_content,_sn){
        if (!_content) return '';
        var _sn = _sn||('ck_'+(_rand++));
        _tcache[_sn] = _content;
        return _sn;
    };
})();
/**
 * 取模板随机数种子
 * @return {String} 随机数种子
 */
_e.seed = function(){
    return _seed;
};
