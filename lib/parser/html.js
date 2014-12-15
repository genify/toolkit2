var util     = require('util'),
    path     = require('path'),
    html     = require('htmlparser2'),
   _fs       = require('../util/file.js'),
   _path     = require('../util/path.js'),
   _Abstract = require('../event.js');

var Parser = module.exports = function(file){
    _Abstract.apply(this,arguments);
    // dump content
    var _doDumpContent = function(file){
        var content;
        var absrc = _path.absolute(
            file,process.cwd()+'/'
        );
        if (_fs.exist(absrc)){
            // content from file
            content = _fs.read(absrc);
            if (!!content){
                content = content.join('\n');
            }else{
                this.emit('warn',{
                    data:[absrc],
                    message:'empty content for %s'
                });
            }
        }else{
            // input content
            content = file;
        }
        return content;
    };
    // serialize attributes
    var _doSerializeAttr = function(name,attr){
        var arr = [];
        var ist = name.search(/[@#]/)==0;
        var sep = ist?'':'=';
        var dot = ist?'':'"';
        Object.keys(attr).forEach(function(k){
            arr.push(k+sep+dot+attr[k]+dot);
        });
        return arr.join(' ').trim();
    };
    // dump text function map
    var _tmap = {
        style:function(name,attr){
            
        },
        script:function(name,attr){
            
        },
        textarea:function(name,attr){
            
        }
    };
    // private variable
    var _buffer,_config;
    this.update = function(file){
        _buffer = [];
        _config = {style:[],script:[]};
        var content = _doDumpContent.call(this,file);
        if (!content) return;
        var _tag,_txt;
        var parser = new html.Parser({
            onprocessinginstruction:function(name,data){
                console.log('%s:%s->%s','instruction',name,data);
                _buffer.push(util.format('<%s>',data));
            },
            onopentag:function(name,attrs) {
                console.log('%s:%s->%j','opentag',name,attrs);
                _tag = name;
                var _func = _tmap[name];
                if (!!_func){
                    // for style/script/textarea
                    
                }else{
                    // for common tag
                    var val = _doSerializeAttr(name,attrs),
                        att = util.format('<%s%s>',name,!val?'':(' '+val));
                    _buffer.push(att);
                }
            },
            ontext:function(text){
                console.log('%s:%s','text',text);
            },
            onclosetag:function(name) {
                console.log('%s:%s','endtag',name);
            },
            oncomment:function(text) {
                console.log('%s:%s','comment',text);
            },
            oncommentend:function(){
                console.log('comment end');
            },
            oncdatastart:function(){
                console.log('cdata start');
            },
            oncdataend:function(){
                console.log('cdata end');
            }
        },{
            recognizeSelfClosing:true
        });
        parser.write(content);
        parser.end();
        console.log(_buffer.join('\n'));
    };
    // get style list for html file
    this.getStyles = function(){
    
    };
    // get script list for html file
    this.getScripts = function(){
    
    };
    // update parser
    this.update(file);
};
util.inherits(Parser,_Abstract);
