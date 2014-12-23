var _tag = require('../../../lib/parser/tag.js'),
    _fs  = require('../../../lib/util/file.js'),
     should = require('should');
    
describe('parser/tag',function(){
    
    describe('Tokenizer',function(){
        [
            {
                code:'<!DOCTYPE html>',
                result:{name:'!DOCTYPE',attrs:{html:''},closed:!1,selfClosed:!1}
            },{
                code:'<html>',
                result:{name:'html',closed:!1,selfClosed:!1}
            },{
                code:'<meta charset="utf-8"/>',
                result:{name:'meta',attrs:{charset:'utf-8'},closed:!1,selfClosed:!0}
            },{
                type:'comment',
                code:'<!-- @STYLE -->',
                result:{comment:' @STYLE '}
            },{
                code:'<link href="../css/template.css" rel="stylesheet" type="text/css"/>',
                result:{name:'link',attrs:{href:'../css/template.css',rel:'stylesheet',type:'text/css'},closed:!1,selfClosed:!0}
            },{
                code:'<textarea name="html" data-src="module/tab/index.html">',
                result:{name:'textarea',attrs:{name:'html','data-src':'module/tab/index.html'},closed:!1,selfClosed:!1}
            },{
                code:'</script>',
                result:{name:'script',closed:!0,selfClosed:!1}
            },{
                code:'<a hidefocus>',
                result:{name:'a',attrs:{hidefocus:''},closed:!1,selfClosed:!1}
            },{
                code:'<a hidefocus/>',
                result:{name:'a',attrs:{hidefocus:''},closed:!1,selfClosed:!0}
            },{
                code:'<a hidefocus=true>',
                result:{name:'a',attrs:{hidefocus:'true'},closed:!1,selfClosed:!1}
            },{
                code:'<a hidefocus=true/>',
                result:{name:'a',attrs:{hidefocus:'true'},closed:!1,selfClosed:!0}
            },{
                code:'<#escape x as x?html>',
                result:{name:'#escape',closed:!1,selfClosed:!1}
            },{
                code:'<#include "../../wrap/3g.common.ftl">',
                result:{name:'#include',closed:!1,selfClosed:!1}
            },{
                code:'<@topbar title=title!"品购页"/>',
                result:{name:'@topbar',closed:!1,selfClosed:!0}
            },{
                code:'<#if category??&&category?size&gt;0>',
                result:{name:'#if',attrs:{'category??&&category?size&gt;0':''},closed:!1,selfClosed:!1}
            },{
                code:'</#list>',
                result:{name:'#list',closed:!0,selfClosed:!1}
            },{
                code:'<#assign a = b + c />',
                result:{name:'#assign',closed:!1,selfClosed:!0}
            }
            
        ].forEach(function(config){
            config.type = config.type||'tag';
            config.result.source = config.code;
            it('should be ok for '+config.type+': '+config.code,function(){
                // do tokenizer
                var opt = {},ret;
                opt[config.type] = function(e){ret = e;};
                new _tag.Tokenizer(config.code,opt);
                // check result
                var r = config.result;
                if (!!r.attrs){
                    ret.attrs.should.eql(r.attrs);
                }else{
                    delete ret.attrs;
                }
                ret.should.eql(r);
            });
        });
        
        var _doTestFromFile = function(file){
            var ret = {tag:[],text:[],comment:[]};
            new _tag.Tokenizer(
                _fs.read(process.cwd()+file).join('\n'),{
                    tag:function(event){
                        ret.tag.push(event);
                        //var source = event.source;
                        //delete event.source;
                        //console.log('TAG: %s -> %j',source,event);
                    },
                    text:function(event){
                        ret.text.push(event);
                        //console.log('TEXT -> %j',event);
                    },
                    comment:function(event){
                        ret.comment.push(event);
                        //console.log('COMMENT -> %j',event);
                    }
                }
            );
            return ret;
        };
        // it('should be ok for parsing html file',function(){
            // _doTestFromFile('/parser/tag/a.html');
        // });
        // it('should be ok for parsing freemarker file',function(){
            // _doTestFromFile('/parser/tag/a.ftl');
        // });
        it('should be ok for parsing script with tag',function(){
            var ret = _doTestFromFile('/parser/tag/b.html');
            // beg script
            var tag = ret.tag.shift();
            tag.name.should.equal('script');
            // end script
            var tag = ret.tag.pop();
            tag.name.should.equal('script');
            tag.closed.should.be.true;
        });
        it('should be ok for parsing textarea with content',function(){
            var ret = _doTestFromFile('/parser/tag/c.html');
            // beg textarea
            var tag = ret.tag.shift();
            tag.name.should.equal('textarea');
            tag.attrs.should.eql({name:"jst",id:"#<seedDate>"});
            // end textarea
            var tag = ret.tag.pop();
            tag.name.should.equal('textarea');
            tag.closed.should.be.true;
        });
        it('should be ok for parsing conditional comments',function(){
            var ret = _doTestFromFile('/parser/tag/d.html');
            ret.comment.length.should.equal(1);
            ret.comment[0].comment.trim().should.equal('Comment content');
        });
    });
    
    describe('Paser',function(){

        var _doTestFromFile = function(file){
            var ret = {style:[],script:[],textarea:[],comment:[]};
            var parser = new _tag.Parser(
                _fs.read(process.cwd()+file).join('\n'),{
                    style:function(event){
                        ret.style.push(event);
                        console.log('STYLE\n%j\n%j',event.config,event.source);
                    },
                    script:function(event){
                        ret.script.push(event);
                        console.log('SCRIPT\n%j\n%j',event.config,event.source);
                    },
                    textarea:function(event){
                        ret.textarea.push(event);
                        console.log('TEXTAREA\n%j\n%j',event.config,event.source);
                    },
                    comment:function(event){
                        ret.comment.push(event);
                        console.log('COMMENT\n%j\n%s',event.config,event.source);
                    }
                }
            );
            ret.inst = parser;
        };
        it('should be ok for parsing html file',function(){
            var ret = _doTestFromFile('/parser/tag/a.html');
            
        });
        
    });
});
