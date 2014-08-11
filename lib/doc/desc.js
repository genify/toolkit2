var  query = require('querystring'),
    _tpl   = require('./tpl.js'),
    _log   = require('./util/logger.js'),
    _shjs  = require('./3rd/syntaxhighlighter/scripts/shBrushJScript.js').Brush,
    _shcs  = require('./3rd/syntaxhighlighter/scripts/shBrushCss.js').Brush,
    _shxml = require('./3rd/syntaxhighlighter/scripts/shBrushXml.js').Brush;
/**
 * 解析自定义标签
 * @param  {list}   每行内容
 * @param  {Object} 标签信息
 * @return {String} 自定义标签内容
 */
var __doParseUDTag = (function(){
    var _reg0 = /\s*\|\s*/,
        _reg1 = /^\s*\-+\s*$/,
        _tmap = {
            ntb : function(_list){
                var _opt = {rows:[]};
                for(var i=0,l=_list.length,_line;i<l;i++){
                    _line = _list[i];
                    if (_reg1.test(_line)){
                        _opt.hd = _opt.rows.shift();
                        continue;
                    }
                    _opt.rows.push(_line.split(_reg0));
                }
                return _tpl.get('ntb',_opt);
            },
            ul : function(_list){
                return _tpl.get('list',{tag:'ul',li:_list});
            },
            ol : function(_list){
                return _tpl.get('list',{tag:'ol',li:_list});
            },
            code : function(_list,_tag){
                var _brush;
                switch(_tag.options.type){
                    case 'css':
                        _brush = new _shcs();
                        _brush.init({'class-name':'css'});
                    break;
                    case 'html':
                        _brush = new _shxml();
                        _brush.init({'class-name':'html'});
                    break;
                    default:
                        _brush = new _shjs();
                        _brush.init({'class-name':'js'});
                    break;
                }
                return _brush.getHtml(_list.join('\n'));
            }
        };
    return function(_list,_tag){
        var _func = _tmap[_tag.name];
        if (!!_func){
            return _func(_list,_tag);
        }
        _log.warn('unknow custom tag[%s]',_tag.name);
        return _tag.source+'\n'+_list.join('\n')+'\n[/'+_tag.name+']';
    };
})();
/**
 * 解析描述信息 
 * @param  {String} 描述内容
 * @return {String} 解析后的描述信息 
 */
var __doParseDescription = (function(){
        // start tag
    var _reg0 = /^\s*\[([\w\s"'=]+?)\]\s*$/,
        // end tag
        _reg1 = /^\s*\[\/(\w*?)\]\s*$/,
        // space split
        _reg2 = /\s+/,
        _reg3 = /\s*=\s*/g,
        _reg4 = /(?:^['"])|(?:['"]$)/g,
        _reg5 = /(?:<br\/>)+/g;
    var _doParseTag = function(_content){
        var _arr = _content.replace(_reg3,'=').split(_reg2),
            _name = _arr.shift(),
            _options = query.parse(_arr.join('&'));
        for(var x in _options){
            _options[x] = _options[x].replace(_reg4,'');
        }
        return {
            name:_name.toLowerCase(),
            options:_options,
            source:_content
        };
    };
    return function(_content){
        var _lines = (_content||'').split('\n'),
            _arr = [],_brr,_tag;
        for(var i=0,l=_lines.length,_line;i<l;i++){
            _line = _lines[i];
            // end tag
            if (_reg1.test(_line)&&!!_tag){
                _arr.push(__doParseUDTag(_brr,_tag));
                _brr = null;
                _tag = null;
                continue;
            }
            // start tag
            if (_reg0.test(_line)){
                if (!!_brr){
                    _arr.push(_tag.source+'\n'+_brr.join('\n'));
                    _tag = null;
                }
                _brr = [];
                _tag = _doParseTag(RegExp.$1);
                continue;
            }
            // tag content
            if (!!_brr){
                _brr.push(_line);
                continue;
            }
            // description content
            _arr.push(_line);
        }
        return _arr.join('');
    };
})();
/**
 * 解析描述链接
 * @param  {String} 内容
 * @param  {String} 名字空间
 * @return {String} 解析完链接后内容
 */
var __doParseLink = (function(){
    var _reg = /\{([\w\.\$]+)?#([\w\.\$]+?)\}/gi;
    return function(_content,_space){
        return _content.replace(_reg,
               function($1,$2,$3){
                   if (!$3) return $1;
                   var _arr = $3.split('.'),
                       _opt = {
                           label:_arr[_arr.length-1]
                       };
                   if (_arr.length>1){
                       _opt.href = _arr.join('.');
                   }else{
                       var _prefix = $2||_space||'';
                       if (!_prefix){
                           _opt.href = $3;
                       }else{
                           var _split = _prefix.indexOf('_$$')>0?'|':'.';
                           _opt.href = _prefix+_split+$3;
                       }
                   }
                   return _tpl.get('link',_opt)
               });
    };
})();
exports.parse = __doParseDescription;
exports.link  = __doParseLink;