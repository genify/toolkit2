var util     = require('util'),
   _Abstract = require('../event.js');
// token parser
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
        '-':function(c){
            // switch to comment state
            if (_gState==STATE_TAG&&
                _gString[0]=='!'&&_gString[1]=='-'){
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
        _gLast   = null;
        _gState  = STATE_TEXT;
        _gBuffer = [];
        _gString = [];
        _gStrSep = null;
    };
    var _doUpdateState = function(_state){
        _gLast = _gState;
        _gState = _state;
        //console.log('state to %s',_gState);
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
        this.emit('tag',_gTagOpt);
    };
    // text state
    var _doBegTextState = function(){
        _gBuffer = [];
        _doUpdateState(STATE_TEXT);
    };
    var _doEndTextState = function(){
        if (_gBuffer.length>0){
            this.emit('text',{
                source:_gBuffer.join('')
            });
        }
    };
    // name state
    var _doBegNameState = function(){
        _gString = [];
        _doUpdateState(STATE_NAME);
    };
    var _doEndNameState = function(){
        var name = _gString.join('').trim();
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
        var value = _gString.join('').trim();
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
        this.emit('comment',{
            source:_gBuffer.join(''),
            comment:_gString.join('')
        });
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
            return;
        }
    };
    // parse content
    var _doParse = function(content){
        var i=0,c,func,
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
                if (!func.call(this,c)){
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
        _doReset();
        _doParse.apply(this,arguments);
    };
    // update content
    if (!!content){
        this.update(content);
    }
};
util.inherits(Tokenizer,_Abstract);

// tag parser
var Parser = function(content){
    _Abstract.apply(this,arguments);
    // parser state
    var STATE_TEXT     = 0,
        STATE_STYLE    = 1,
        STATE_SCRIPT   = 2,
        STATE_TEXTAREA = 3;
    // private cache
    var _gBuffer,_gText,_gState;
    // style state
    var _doBegStyleState = function(){
        
    };
    var _doEndStyleState = function(){
        
    };
    
    var _onTag = function(options){
        // script/style/textarea
        var attrs = options.attrs||{};
        switch(options.name.toLowerCase()){
            case 'style':
                if (!attrs.type||attrs.type){
                    
                }
            return;
            case 'link':
            
            return;
            case 'script':
            
            return;
            case 'textarea':
            
            return;
        }
        _gBuffer.push(options.source);
    };
    var _onText = function(options){
        
    };
    var _onComment = function(options){
        
    };
    // parse content
    this.update = function(content){
        _gBuffer = [];
        var tokenizer = new Tokenizer(
            content,{
                tag:_onTag,
                text:_onText,
                comment:_onComment
            }
        );
    };
    this.toString = function(){
        return !_gBuffer?'':_gBuffer.join('');
    };
    // update content
    if (!!content){
        this.update(content);
    }
};
util.inherits(Parser,_Abstract);

exports.Parser    = Parser;
// export tokenizer for test
exports.Tokenizer = Tokenizer;
