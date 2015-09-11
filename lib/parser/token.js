/*
 * HTML Content Tag Tokenizer
 * @module   parser/token
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util');
// state decoration
var STATE = {
    TAG     : 1,    // <XX XX=XX />
    TEXT    : 2,
    NAME    : 3,    // attr=value
    VALUE   : 4,
    STRING  : 5,    // '' OR ""
    ESCAPE  : 6,    // \
    COMMENT : 7
};
// state transform handler
var TRANSFORM = {
    '<':function(c){
        // for << or <abc<
        this._buffer.pop();
        this._endTextState();
        // switch to tag state
        this._begTagState();
    },
    '-':function(c,n){
        n = (n||'').toLowerCase();
        // switch to comment state
        if (this._state===STATE.TAG&&
            this._string[0]==='!'&&
            this._string[1]==='-'&&
            n!='[if '){
            this._begCommentState();
            return;
        }
        return !0;
    },
    '/':function(c){
        if (this._endTagCheck()){
            this._updateState(STATE.TAG);
        }
    },
    '>':function(c){
        // end comment for -->
        var l = this._string.length-1;
        if (this._state===STATE.COMMENT&&
            this._string[l]==='-'&&this._string[l-1]==='-'){
            // pop --
            this._string.pop();
            this._string.pop();
            this._endCommentState();
            this._begTextState();
            return;
        }
        // for <a>
        // for <a ab>
        // for <a ab=c>
        if (this._state===STATE.TAG||
            this._state===STATE.NAME||
            this._state===STATE.VALUE){
            this._endTagCheck();
            this._endTagState();
            this._begTextState();
        }
    },
    '"':function(c){
        // "/' in string, eg. '"',"'"
        if (this._state===STATE.STRING&&this._strSep!==c){
            this._string.push(c);
            return;
        }
        // end string state
        if (this._state===STATE.STRING){
            this._endStringState();
            return;
        }
        // switch to string state
        if (this._state===STATE.NAME||
            this._state===STATE.VALUE){
            this._begStringState(c);
        }
    },
    '\\':function(c){
        // switch to escape state
        if (this._state===STATE.STRING){
            this._begEscapeState(c);
        }
    },
    '=':function(c){
        // switch to value state
        if (this._state===STATE.NAME){
            this._endNameState();
            this._begValueState();
        }
    }
};
TRANSFORM["'"] = TRANSFORM['"'];
// token parser, split content to one or more tag/text/comment
// input config
// - content        html file content
// supported properties
// - result       rsesult list for content parsing, [{type:'tag',data:{}},{type:'text',data:''},{type:'comment',data:''}...]
// supported events
// - ontag        tag parse end event, {name:'xxx',attrs:{x:'xx'},closed:false,selfClosed:false,source:'<xxx x="xx">'}
// - ontext       text parse end event, {source:'xxxxxxxx'}
// - oncomment    comment pare end event, {comment:'xxxx',source:'<!-- xxxx -->'}
var Tokenizer = module.exports =
    require('../util/klass.js').create();
var pro = Tokenizer.extend(require('../util/event.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    this.update(
        (config||{}).content
    );
};
/**
 * update parse content
 * @param  {String} content - content to be parsed
 * @return {Void}
 */
pro.update = function(content){
    this._reset();
    this._parse(content);
};
/**
 * dump result
 * @param  {String} type - tag type
 * @return {Array}
 */
pro.dump = function(type){
    var ret = [];
    this.result.forEach(function(result){
        if (!type||type===result.type){
            ret.push(result);
        }
    });
    return ret;
};
/**
 * reset internal state
 * @private
 * @return {Void}
 */
pro._reset = function(){
    this._last    = null;
    this._state   = STATE.TEXT;
    this._buffer  = [];
    this._string  = [];
    this._strSep  = null;
    this.result   = [];
};
/**
 * check white char
 * @private
 * @param  {String} c - string char
 * @return {Void}
 */
pro._white = function(c){
    // init name state
    if (this._state===STATE.TAG){
        this._endTagName();
        this._begNameState();
        return;
    }
    // end name state
    if (this._state===STATE.NAME&&
        this._string.length>0){
        this._endNameState();
        this._begNameState();
        return;
    }
    // end value state
    // ok for empty value
    if (this._state===STATE.VALUE){
        this._endValueState();
        this._begNameState();
    }
};
/**
 * parse content
 * @private
 * @param  {String} content - content will to be parsed
 * @return {Void}
 */
pro._parse = function(content){
    var i=0,c,func,next,
        r=/[\s]/,
        l=[
            STATE.TAG,STATE.NAME,
            STATE.VALUE,STATE.COMMENT
        ];
    while(!!(c=content.charAt(i++))){
        //console.log(c);
        this._buffer.push(c);
        // revert escape state
        if (this._state===STATE.ESCAPE){
            this._endEscapeState(c);
            continue;
        }
        // char in string or in comment
        if ((this._state===STATE.STRING&&c!=='"'&&c!=="'")||
            (this._state===STATE.COMMENT&&c!==">")){
            this._string.push(c);
            continue;
        }
        // check white
        if (r.test(c)){
            this._white(c);
            continue;
        }
        // check state char
        func = TRANSFORM[c];
        if (!!func){
            // for conditional comments
            if (c==='-'){
                next = content.substr(i,4);
            }
            if (!func.call(this,c,next)){
                continue;
            }
        }
        // buffer string
        if (l.indexOf(this._state)>=0){
            this._string.push(c);
        }
    }
    this._endTextState();
};
/**
 * update internal state
 * @private
 * @param  {Number} state - state value
 * @return {Void}
 */
pro._updateState = function(state){
    this._last = this._state;
    this._state = state;
};
/**
 * begin tag state
 * @private
 * @return {Void}
 */
pro._begTagState = function(){
    this._string = [];
    this._buffer = ['<'];
    this._tagOpt = {attrs:{}};
    this._updateState(STATE.TAG);
};
/**
 * end tag name state
 * @private
 * @return {Void}
 */
pro._endTagName = function(){
    if (!this._tagOpt.name){
        this._tagOpt.name = this._string.join('').trim();
        this._string = [];
    }
};
/**
 * check end tag state
 * @private
 * @return {Boolean} whether name or value state
 */
pro._endTagCheck = function(){
    // for <abc/> or <abc>
    if (this._state===STATE.TAG){
        this._endTagName();
        return;
    }
    // for <abc x/> or <abc x>
    if (this._state===STATE.NAME){
        this._endNameState();
        return !0;
    }
    // for <abc x=ab/> or <abc x=ab>
    if (this._state===STATE.VALUE){
        this._endValueState();
        return !0;
    }
};
/**
 * end tag state
 * @private
 * @return {Void}
 */
pro._endTagState = function(){
    delete this._tagOpt.attr;
    this._tagOpt.source = this._buffer.join('');
    this._tagOpt.closed = this._buffer[1]==='/';
    this._tagOpt.selfClosed = this._buffer[this._buffer.length-2]==='/';
    this.result.push({
        type:'tag',
        data:this._tagOpt
    });
    this.emit('tag',this._tagOpt);
};
/**
 * begin text state
 * @private
 * @return {Void}
 */
pro._begTextState = function(){
    this._buffer = [];
    this._updateState(STATE.TEXT);
};
/**
 * end text state
 * @private
 * @return {Void}
 */
pro._endTextState = function(){
    if (this._buffer.length>0){
        var text = this._buffer.join('');
        this.result.push({
            type:'text',
            data:text
        });
        this.emit('text',{
            source:text
        });
    }
};
/**
 * begin name state
 * @private
 * @return {Void}
 */
pro._begNameState = function(){
    this._string = [];
    this._updateState(STATE.NAME);
};
/**
 * end name state
 * @private
 * @return {Void}
 */
pro._endNameState = function(){
    var sep = this._strSep||'',
        name = util.format(
            '%s%s%s',
            sep,this._string.join('').trim(),sep
        );
    if (!!name){
        this._tagOpt.attr = name;
        this._tagOpt.attrs[name] = '';
    }
};
/**
 * begin value state
 * @private
 * @return {Void}
 */
pro._begValueState = function(){
    this._string = [];
    this._updateState(STATE.VALUE);
};
/**
 * end value state
 * @private
 * @return {Void}
 */
pro._endValueState = function(){
    var value = this._string.join('');
    if (!!this._tagOpt.attr){
        this._tagOpt.attrs[this._tagOpt.attr] = value;
        delete this._tagOpt.attr;
    }
};
/**
 * begin string state
 * @private
 * @param {String} c - string char
 * @return {Void}
 */
pro._begStringState = function(c){
    this._strSep = c;
    this._string = [];
    this._updateState(STATE.STRING);
};
/**
 * end string state
 * @private
 * @return {Void}
 */
pro._endStringState = function(){
    // revert to last state
    this._state  = this._last;
    if (this._state===STATE.NAME){
        this._endNameState();
    }else if(this._state===STATE.VALUE){
        this._endValueState();
    }
    this._strSep = null;
};
/**
 * begin escape state
 * @private
 * @param  {String} c - string char
 * @return {Void}
 */
pro._begEscapeState = function(c){
    this._string.push(c);
    this._state = STATE.ESCAPE;
};
/**
 * end escape state
 * @private
 * @param  {String} c - string char
 * @return {Void}
 */
pro._endEscapeState = function(c){
    this._string.push(c);
    this._state = STATE.STRING;
};
/**
 * begin comment state
 * @private
 * @return {Void}
 */
pro._begCommentState = function(){
    this._string = [];
    this._updateState(STATE.COMMENT);
};
/**
 * end comment state
 * @private
 * @return {Void}
 */
pro._endCommentState = function(){
    var event = {
        source:this._buffer.join(''),
        comment:this._string.join('')
    };
    this.result.push({
        type:'comment',
        data:event
    })
    this.emit('comment',event);
};