/*
 * tag parser
 * @module   parser/tag
 * @author   genify(caijf@corp.netease.com)
 */
var util     = require('util'),
   _Abstract = require('../util/event.js');
// token parser, split content to one or more tag/text/comment
// supported properties
// - result       rsesult list for content parsing, [{type:'tag',data:{}},{type:'text',data:''},{type:'comment',data:''}...]
// supported events
// - ontag        tag parse end event, {name:'xxx',attrs:{x:'xx'},closed:false,selfClosed:false,source:'<xxx x="xx">'}
// - ontext       text parse end event, {source:'xxxxxxxx'}
// - oncomment    comment pare end event, {comment:'xxxx',source:'<!-- xxxx -->'}
var Tokenizer = function(content){
    _Abstract.apply(this,arguments);
    // state decoration
    var STATE_TAG     = 1, // <XX XX=XX />
        STATE_TEXT    = 2,
        STATE_NAME    = 3, // attr=value
        STATE_VALUE   = 4, 
        STATE_STRING  = 5, // '' OR ""
        STATE_ESCAPE  = 6, // \
        STATE_COMMENT = 7;
    // char parser
    var _gFMap = {
        '<':function(c){
            // for << or <abc<
            _gBuffer.pop();
            _doEndTextState.call(this);
            // switch to tag state
            _doBegTagState.call(this);
        },
        '-':function(c,n){
            n = (n||'').toLowerCase();
            // switch to comment state
            if (_gState==STATE_TAG&&
                _gString[0]=='!'&&
                _gString[1]=='-'&&
                n!='[if '){
                _doBegCommentState();
                return;
            }
            return !0;
        },
        '/':function(c){
            if (_doEndTagCheck()){
                _doUpdateState(STATE_TAG);
            }
        },
        '>':function(c){
            // end comment for -->
            var l = _gString.length-1;
            if (_gState==STATE_COMMENT&&
                _gString[l]=='-'&&_gString[l-1]=='-'){
                // pop --
                _gString.pop();
                _gString.pop();
                _doEndCommentState.call(this);
                _doBegTextState();
                return;
            }
            // for <a>
            // for <a ab>
            // for <a ab=c>
            if (_gState==STATE_TAG||
                _gState==STATE_NAME||
                _gState==STATE_VALUE){
                _doEndTagCheck();
                _doEndTagState.call(this);
                _doBegTextState();
            }
        },
        '"':function(c){
            // "/' in string, eg. '"',"'"
            if (_gState==STATE_STRING&&_gStrSep!=c){
                _gString.push(c);
                return;
            }
            // end string state
            if (_gState==STATE_STRING){
                _doEndStringState();
                return;
            }
            // switch to string state
            if (_gState==STATE_NAME||
                _gState==STATE_VALUE){
                _doBegStringState(c);
            }
        },
        '\\':function(c){
            // switch to escape state
            if (_gState==STATE_STRING){
                _doBegEscapeState(c);
            }
        },
        '=':function(c){
            // switch to value state
            if (_gState==STATE_NAME){
                _doEndNameState();
                _doBegValueState();
            }
        }
    };
    _gFMap["'"] = _gFMap['"'];
    // reset cache and state
    var _gLast,_gState,_gBuffer,
        _gTagOpt,_gString,_gStrSep;
    var _doReset = function(){
        _gLast   = null;        // last state
        _gState  = STATE_TEXT;  // current state
        _gBuffer = [];          // content buffer
        _gString = [];          // temporary string cache
        _gStrSep = null;        // string separator
        this.result = [];      // parser result
    };
    var _doUpdateState = function(s){
        _gLast = _gState;
        _gState = s;
    };
    // tag state
    var _doBegTagState = function(){
        _gString = [];
        _gBuffer = ['<'];
        _gTagOpt = {attrs:{}};
        _doUpdateState(STATE_TAG);
    };
    var _doEndTagName = function(){
        if (!_gTagOpt.name){
            _gTagOpt.name = _gString.join('').trim();
            _gString = [];
        }
    };
    var _doEndTagCheck = function(){
        // for <abc/> or <abc>
        if (_gState==STATE_TAG){
            _doEndTagName();
            return;
        }
        // for <abc x/> or <abc x>
        if (_gState==STATE_NAME){
            _doEndNameState();
            return !0;
        }
        // for <abc x=ab/> or <abc x=ab>
        if (_gState==STATE_VALUE){
            _doEndValueState();
            return !0;
        }
    };
    var _doEndTagState = function(){
        delete _gTagOpt.attr;
        _gTagOpt.source = _gBuffer.join('');
        _gTagOpt.closed = _gBuffer[1]=='/';
        _gTagOpt.selfClosed = _gBuffer[_gBuffer.length-2]=='/';
        this.result.push({
            type:'tag',
            data:_gTagOpt
        });
        this.emit('tag',_gTagOpt);
    };
    // text state
    var _doBegTextState = function(){
        _gBuffer = [];
        _doUpdateState(STATE_TEXT);
    };
    var _doEndTextState = function(){
        if (_gBuffer.length>0){
            var text = _gBuffer.join('');
            this.result.push({
                type:'text',
                data:text
            });
            this.emit('text',{
                source:text
            });
        }
    };
    // name state
    var _doBegNameState = function(){
        _gString = [];
        _doUpdateState(STATE_NAME);
    };
    var _doEndNameState = function(){
        var sep = _gStrSep||'',
            name = util.format(
                '%s%s%s',
                sep,_gString.join('').trim(),sep
            );
        if (!!name){
            _gTagOpt.attr = name;
            _gTagOpt.attrs[name] = '';
        }
    };
    // value state 
    var _doBegValueState = function(){
        _gString = [];
        _doUpdateState(STATE_VALUE);
    };
    var _doEndValueState = function(){
        var value = _gString.join('');
        if (!!_gTagOpt.attr){
            _gTagOpt.attrs[_gTagOpt.attr] = value;
            delete _gTagOpt.attr;
        }
    };
    // string state
    var _doBegStringState = function(c){
        _gStrSep = c;
        _gString = [];
        _doUpdateState(STATE_STRING);
    };
    var _doEndStringState = function(){
        // revert to last state
        _gState  = _gLast;
        if (_gState==STATE_NAME){
            _doEndNameState();
        }else if(_gState==STATE_VALUE){
            _doEndValueState();
        }
        _gStrSep = null;
    };
    // escape state
    var _doBegEscapeState = function(c){
        _gString.push(c);
        _gState = STATE_ESCAPE;
    };
    var _doEndEscapeState = function(c){
        _gString.push(c);
        _gState = STATE_STRING;
    };
    // comment state
    var _doBegCommentState = function(){
        _gString = [];
        _doUpdateState(STATE_COMMENT);
    };
    var _doEndCommentState = function(){
        var event = {
            source:_gBuffer.join(''),
            comment:_gString.join('')
        };
        this.result.push({
            type:'comment',
            data:event
        })
        this.emit('comment',event);
    };
    var _doWhite = function(c){
        // init name state
        if (_gState==STATE_TAG){
            _doEndTagName();
            _doBegNameState();
            return;
        }
        // end name state
        if (_gState==STATE_NAME&&_gString.length>0){
            _doEndNameState();
            _doBegNameState();
            return;
        }
        // end value state
        if (_gState==STATE_VALUE&&_gString.length>0){
            _doEndValueState();
            _doBegNameState();
        }
    };
    // parse content
    var _doParse = function(content){
        var i=0,c,func,next,
            r=/[\s]/,
            l=[
                STATE_TAG,STATE_NAME,
                STATE_VALUE,STATE_COMMENT
            ];
        while(!!(c=content.charAt(i++))){
            //console.log(c);
            _gBuffer.push(c);
            // revert escape state
            if (_gState==STATE_ESCAPE){
                _doEndEscapeState(c);
                continue;
            }
            // char in string or in comment
            if ((_gState==STATE_STRING&&c!='"'&&c!="'")||
                (_gState==STATE_COMMENT&&c!==">")){
                _gString.push(c);
                continue;
            }
            // check white
            if (r.test(c)){
                _doWhite.call(this,c);
                continue;
            }
            // check state char
            func = _gFMap[c];
            if (!!func){
                // for conditional comments
                if (c=='-'){
                    next = content.substr(i,4);
                }
                if (!func.call(this,c,next)){
                    continue;
                }
            }
            // buffer string
            if (l.indexOf(_gState)>=0){
                _gString.push(c);
            }
        }
        _doEndTextState.call(this);
    };
    // update api
    this.update = function(content){
        _doReset.call(this);
        _doParse.apply(this,arguments);
    };
    // dump api
    this.dump = function(type){
        var ret = [];
        this.result.forEach(function(result){
            if (!type||type===result.type){
                ret.push(result);
            }
        });
        return ret;
    };
    // update content
    if (!!content){
        this.update(content);
    }
};
util.inherits(Tokenizer,_Abstract);

// tag parser
// supported properties
//
// supported events
// onstyle          style resource parse end event, {config:{},buffer:[],source:''}
// onscript         script resource parse end event, {config:{},buffer:[],source:''}
// ontextarea       textarea resource parse end event, {config:{},buffer:[],source:''}
// oninstruction    nej deploy instruction parse end event, {command:'STYLE',config:{core:false},closed:false}
// ontag            tag parse end event, {tag:{},buffer:[]}
// ontext           text parse end event, {source:'',buffer:[]}
// oncomment        comment parse end event, {source:'',buffer:[]}
var Parser = function(content){
    _Abstract.apply(this,arguments);
    // parser state
    var STATE_TEXT     = 1,
        STATE_STYLE    = 2,
        STATE_SCRIPT   = 3,
        STATE_TEXTAREA = 4,
        STATE_NOTMATCH = 100;
    // private cache
    var _gBuffer,_gText,
        _gROpt,_gState,_gLast;
    // state process function
    var _gFMap = {
        style:function(options){
            // begin style
            var attrs = options.attrs||{};
            if (_gState==STATE_TEXT&&attrs.disabled==null){
                return STATE_STYLE;
            }
            // end style
            if (_gState==STATE_STYLE&&
                !!options.closed&&!options.selfClosed){
                return 'style';
            }
        },
        script:function(options){
            var attrs = options.attrs||{};
            // begin script
            if (_gState==STATE_TEXT){
                return STATE_SCRIPT;
            }
            // end script
            if (_gState==STATE_SCRIPT&&
                !!options.closed&&!options.selfClosed){
                return 'script';
            }
        },
        textarea:function(options){
            // begin textarea
            if (_gState==STATE_TEXT){
                return STATE_TEXTAREA;
            }
            // end textarea
            if (_gState==STATE_TEXTAREA&&
                !!options.closed&&!options.selfClosed){
                return 'textarea';
            }
        },
        link:function(options){
            var attrs = options.attrs||{};
            // external style link
            if (_gState==STATE_TEXT&&!!attrs.href&&attrs.disabled==null){
                // begin style
                _doEndTextState.call(this);
                _doBegResState(STATE_STYLE,options);
                // end style
                _doEndResState.call(this,'style','');
                _doBegTextState();
                return STATE_NOTMATCH;
            }
        }
    };
    var _inResource = function(){
        return _gState==STATE_STYLE||
               _gState==STATE_SCRIPT||
               _gState==STATE_TEXTAREA;
    };
    // reset
    var _doReset = function(){
        _gROpt   = null;        // tag config data
        _gText   = [];          // temporary text cache
        _gLast   = null;        // last state
        _gState  = STATE_TEXT;  // current state
        _gBuffer = [];          // content buffer
    };
    // update state
    var _doUpdateState = function(state){
        _gLast = _gState;
        _gState = state;
    };
    // text state
    var _doBegTextState = function(){
        _gText = [];
        _doUpdateState(STATE_TEXT);
    };
    var _doEndTextState = function(){
        var text = _gText.join('');
        if (!!text){
            this.emit('text',{
                source:text,
                buffer:_gBuffer
            });
        }
    };
    // resource state
    // for style/script/textarea
    var _doBegResState = function(state,options){
        _gROpt = options.attrs;
        _gText = [options.source];
        _doUpdateState(state);
    };
    var _doEndResState = function(name,source){
        var beg = _gText.shift(),
            end = source||'';
        var event = {
            config:_gROpt,
            buffer:_gBuffer,
            source:_gText.join('')
        };
        this.emit(name,event);
        // event.value will be pushed to buffer (for placeholder)
        // if not event.value the origin style will be pushed to buffer
        if (event.value!=null){
            _gBuffer.push(event.value);
        }else{
            _gBuffer.push(beg,event.source,end);
        }
    };
    // parse nej deploy instruction
    var _doParseInstruction = (function(){
        var _eval = function(script){
            var ret = null;
            if (!!script){
                try{
                    ret = eval(util.format('(%s)',script));
                }catch(e){
                    // ignore
                }
            }
            return ret;
        };
        return function(comment){
            comment = (comment||'').trim();
            // begin instruction
            if (comment.indexOf('@')===0){
                var ret = {closed:!1};
                // @ABC {a:'',b:''}
                var index = comment.search(/[\s\{]/);
                if (index>0){
                    ret.command = comment.substr(1,index-1).toUpperCase();
                    ret.config = _eval(comment.substr(index));
                }else{
                    ret.command = comment.substr(1).toUpperCase();
                }
                return ret;
            }
            // end instruction
            if (comment.indexOf('/@')===0){
                return {
                    closed:!0,
                    command:comment.substr(2).toUpperCase()
                };
            }
        };
    })();
    // process tag
    var _onTag = function(options){
        // script/style/textarea
        var attrs = options.attrs||{},
            tname = options.name.toLowerCase(),
            pfunc = _gFMap[tname];
        if (!!pfunc){
            var ret = pfunc.call(this,options);
            // ignore cache
            if (ret===STATE_NOTMATCH){
                return;
            }
            // end state
            if (typeof ret==='string'){
                _doEndResState.call(
                    this,ret,options.source
                );
                _doBegTextState();
                return;
            }
            // begin state
            if (typeof ret==='number'){
                _doEndTextState.call(this);
                _doBegResState(ret,options);
                return;
            }
        }else{
            var event = {
                tag:options,
                buffer:_gBuffer
            };
            this.emit('tag',event);
            if (event.value!=null){
                _gBuffer.push(event.value);
                return;
            }
        }
        // save source
        _onText.call(this,options);
    };
    // process text
    var _onText = function(options){
        // save source
        if (_inResource()){
            _gText.push(options.source);
        }else{
            // text content
            if (!options.name){
                var event = {
                    source:options.source,
                    buffer:_gBuffer
                };
                this.emit('text',event);
                if (event.value!=null){
                    _gBuffer.push(event.value);
                    return;
                }
            }
            _gBuffer.push(options.source);
        }
    };
    // process comment
    var _onComment = function(options){
        var ret = _doParseInstruction(options.comment);
        if (!!ret){
            ret.buffer = _gBuffer;
            ret.source = options.source;
            this.emit('instruction',ret);
        }else{
            this.emit('comment',{
                buffer:_gBuffer,
                source:options.source
            });
        }
    };
    // parse content
    this.update = function(content){
        _doReset.call(this);
        var tokenizer = new Tokenizer(
            content,{
                tag:_onTag.bind(this),
                text:_onText.bind(this),
                comment:_onComment.bind(this)
            }
        );
    };
    // dump buffer
    this.dump = function(){
        return _gBuffer;
    };
    // serialize result
    this.toString = function(){
        return !_gBuffer?'':_gBuffer.join('');
    };
    // update content
    if (!!content){
        this.update(content);
    }
};
util.inherits(Parser,_Abstract);

/**
 * 序列化标签
 * {name:'div',attrs:{a:'aaa',b:'bbbb'},closed:false,selfClosed:false} -> <div a="aaa" b="bbbb">
 * @param  {Object} tag 标签对象
 * @return {String}     序列化后的标签代码
 */
exports.stringify = function(tag){
    // illegal tag object
    if (!tag.name){
        return '';
    }
    var ret = ['<'];
    // close tag
    if (tag.closed){
        ret.push('/');
    }
    ret.push(tag.name);
    // merge properties
    if (!tag.closed){
        var arr = [],
            attrs = tag.attrs||{};
        Object.keys(attrs).forEach(function(key){
            var v = attrs[key];
            if (!!v){
                v = '="'+v+'"';
            }
            arr.push(key+v);
        });
        if (arr.length>0){
            ret.push(' ',arr.join(' '));
        }
        if (tag.selfClosed){
            ret.push('/');
        }
    }
    ret.push('>');
    return ret.join('');
};
// export Tokenizer for test
exports.Tokenizer = Tokenizer;
// export Parser
exports.Parser    = Parser;
