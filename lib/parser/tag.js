var util     = require('util'),
   _Abstract = require('../event.js');
// token parser
var Tokenizer = function(content){
    _Abstract.apply(this,arguments);
    // state decoration
    var STATE_NUL     = 0,
        STATE_TAG     = 1, // <XX XX=XX />
        STATE_TEXT    = 2,
        STATE_NAME    = 3,
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
            // init tag state
            _gBuffer = [c];
            _gString = [];
            _gTagOpt = {attrs:{}};
            _doUpdateState(STATE_TAG);
        },
        '/':function(c){
            if (_gState!=STATE_TAG&&
                _gState!=STATE_NAME&&
                _gState!=STATE_VALUE){
                return;
            }
            _doEndTagState();
            _doUpdateState(STATE_TAG);
        },
        '>':function(c){
            if (_gState==STATE_TAG||
                _gState==STATE_NAME||
                _gState==STATE_VALUE){
                _doEndTagState();
                delete _gTagOpt.attr;
                _gTagOpt.source = _gBuffer.join('');
                _gTagOpt.closed = _gBuffer[1]=='/';
                _gTagOpt.selfClosed = _gBuffer[_gBuffer.length-2]=='/';
                _gBuffer = [];
                _doUpdateState(STATE_TEXT);
                this.emit('tag',_gTagOpt);
            }
        },
        '"':function(c){
            // " in string, eg. '"'
            if (_gState==STATE_STRING&&_gStrSep!=c){
                _gString.push(c);
                return;
            }
            // end string state
            if (_gState==STATE_STRING){
                if (_gLast==STATE_NAME){
                    _doEndNameState();
                }else if(_gLast==STATE_VALUE){
                    _doEndValueState();
                }
                _gString = [];
                _gStrSep = null;
                _gState  = _gLast;
                return;
            }
            // init string state
            if (_gState==STATE_NAME||
                _gState==STATE_VALUE){
                _gStrSep = c;
                _gString = [];
                _doUpdateState(STATE_STRING);
            }
        },
        '\\':function(c){
            // init escape state
            if (_gState==STATE_STRING){
                _gString.push(c);
                _gState = STATE_ESCAPE;
            }
        },
        '=':function(c){
            // init value state
            if (_gState==STATE_NAME){
                if (!_gString.length){
                    _gString.push(c);
                }else{
                    _doEndNameState();
                    _doUpdateState(STATE_VALUE);
                }
            }
        }
    };
    _gFMap["'"] = _gFMap['"'];
    // reset cache and state
    var _gLast,_gState,_gBuffer,
        _gTagOpt,_gString,_gStrSep;
    var _doReset = function(){
        _gLast   = STATE_NUL;
        _gState  = STATE_TEXT;
        _gBuffer = [];
        _gTagOpt = {attrs:{}};
        _gString = [];
        _gStrSep = null;
    };
    var _doUpdateState = function(_state){
        _gLast = _gState;
        _gState = _state;
    };
    var _doEndTagState = function(){
        if (_gState==STATE_TAG){
            _doEndTagNameState();
        }
        if (_gState==STATE_NAME){
            _doEndNameState();
        }
        if (_gState==STATE_VALUE){
            _doEndValueState();
        }
    };
    var _doEndTagNameState = function(){
        var name = _gString.join('').trim();
        if (!_gTagOpt.name&&!!name){
            _gTagOpt.name = name;
            _gString = [];
        }
    };
    var _doEndNameState = function(){
        var name = _gString.join('').trim();
        if (!!name){
            _gTagOpt.attr = name;
            _gTagOpt.attrs[name] = '';
        }
        _gString = [];
    };
    var _doEndValueState = function(){
        var value = _gString.join('').trim();
        if (!!_gTagOpt.attr){
            _gTagOpt.attrs[_gTagOpt.attr] = value;
            delete _gTagOpt.attr;
        }else{
            _gTagOpt.attrs[value] = '';
        }
        _gString = [];
    };
    var _doEndTextState = function(){
        var text = _gBuffer.join('');
        if (!!text){
            this.emit('text',{
                text:text
            });
        }
        _gBuffer = [];
    };
    var _isWhite = (function(){
        var reg = /[\s]/;
        return function(c){
            return reg.test(c);
        };
    })();
    var _isSelfClose = function(buffer){
        // last is >
        for(var i=buffer.length-2,c;i>=0;i--){
            c = buffer[i];
            if (_isWhite(c)){
                continue;
            }
            return c=='/';
        }
        return !1;
    };
    var _doWhite = function(c){
        // init name state
        if (_gState==STATE_TAG){
            _doEndTagNameState();
            _doUpdateState(STATE_NAME);
            return;
        }
        // end name state
        if (_gState==STATE_NAME&&_gString.length>0){
            _doEndNameState();
            _doUpdateState(STATE_NAME);
            return;
        }
        // end value state
        if (_gState==STATE_VALUE&&_gString.length>0){
            _doEndValueState();
            _doUpdateState(STATE_NAME);
            return;
        }
    };
    // parse content
    var _doParse = function(content){
        var i=0,c,wt,func,
            ll='<>=/',
            l=[STATE_TAG,STATE_NAME,STATE_VALUE];
        debugger;
        while(!!(c=content.charAt(i++))){
            _gBuffer.push(c);
            // revert escape state
            if (_gState==STATE_ESCAPE){
                _gState = STATE_STRING;
            }
            // <>= in string
            wt = _isWhite(c);
            if (_gState==STATE_ESCAPE||
               (_gState==STATE_STRING&&(ll.indexOf(c)>=0||wt))){
                _gString.push(c);
                continue;
            }
            // check white
            if (wt){
                _doWhite.call(this,c);
                continue;
            }
            // check state char
            func = _gFMap[c];
            if (!!func){
                func.call(this,c);
                continue;
            }
            // buffer string
            if (l.indexOf(_gState)>=0){
                _gString.push(c);
            }
        }
        _doEndTextState.call(this);
    };
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
    
    var _onTag = function(options){
        // script/style/textarea
        
    };
    
    // parse content
    this.update = function(content){
        var tokenizer = new Tokenizer(
            content,{
                tag:function(options){
                    
                }
            }
        );
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
