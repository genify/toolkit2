var should = require('should'),
    fs  = require('../../../lib/util/file.js'),
    tag = require('../../../lib/parser/tag.js');
    
describe('parser/tag',function(){

    var cases = [
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
            code:'<a hidefocus="true">',
            result:{name:'a',attrs:{hidefocus:'true'},closed:!1,selfClosed:!1}
        },{
            code:'<a hidefocus="true"/>',
            result:{name:'a',attrs:{hidefocus:'true'},closed:!1,selfClosed:!0}
        },{
            code:'<#escape x as x?html>',
            result:{name:'#escape',attrs:{x:'',as:'','x?html':''},closed:!1,selfClosed:!1}
        },{
            code:'<#include "../../wrap/3g.common.ftl">',
            result:{name:'#include',attrs:{'"../../wrap/3g.common.ftl"':''},closed:!1,selfClosed:!1}
        },{
            code:'<#if category??&&category?size&gt;0>',
            result:{name:'#if',attrs:{'category??&&category?size&gt;0':''},closed:!1,selfClosed:!1}
        },{
            code:'</#list>',
            result:{name:'#list',closed:!0,selfClosed:!1}
        }
    ];

    describe('.stringify(tag)',function(){
        cases.forEach(function(config){
            if (config.type==='comment'){
                return;
            }
            it('should return '+config.code+' for stringify '+JSON.stringify(config.result),function(){
                var ret = tag.stringify(config.result);
                ret.should.eql(config.code);
            });
        });
    });


    describe('Parser',function(){
        var _doTestFromFile = function(file){
            var ret = {style:[],script:[],textarea:[],instr:[]};
            ret.inst = new tag.Parser(
                {
                    content:fs.read(__dirname+'/'+file).join('\n'),
                    style:function(event){
                        ret.style.push(event);
                        //console.log('STYLE\n%j\n%j',event.config,event.source);
                    },
                    script:function(event){
                        ret.script.push(event);
                        //console.log('SCRIPT\n%j\n%j',event.config,event.source);
                    },
                    textarea:function(event){
                        ret.textarea.push(event);
                        //console.log('TEXTAREA\n%j\n%j',event.config,event.source);
                    },
                    instruction:function(event){
                        ret.instr.push(event);
                        //console.log('INSTRUCTION\n%s\n%j',event.command,event.config);
                    }
                }
            );
            return ret;
        };
        it('should be ok for parsing html file',function(){
            var ret = _doTestFromFile('a.html');
            // check style
            ret.style[0].config.href.should.equal('../css/template.css');
            ret.style[1].config.href.should.equal('../css/app.css');
            // check script
            ret.script[0].source.should.not.be.empty;
            ret.script[1].config.src.should.equal('../javascript/cache/tag.data.js');
            ret.script[2].config.src.should.equal('../javascript/cache/blog.data.js');
            ret.script[3].source.should.not.be.empty;
            ret.script[4].config.src.should.equal('http://nej.netease.com/nej/src/define.js');
            ret.script[5].source.should.not.be.empty;
            // check textarea
            ret.textarea[0].config.should.eql({name:"html","data-src":"module/tab/index.html"});
            ret.textarea[1].config.should.eql({name:"html","data-src":"module/layout/system/index.html"});
            ret.textarea[2].config.should.eql({name:"html","data-src":"module/layout/blog/index.html"});
            ret.textarea[3].config.should.eql({name:"html","data-src":"module/layout/blog.list/index.html"});
            ret.textarea[4].config.should.eql({name:"html","data-src":"module/layout/setting/index.html"});
            ret.textarea[5].config.should.eql({name:"html","data-src":"module/layout/setting.account/index.html"});
            // check instruction
            //ret.instr.should.eql([{"closed":false,"command":"STYLE","config":{"core":false}},{"closed":false,"command":"TEMPLATE"},{"closed":true,"command":"TEMPLATE"},{"closed":false,"command":"MODULE"},{"closed":true,"command":"MODULE"},{"closed":false,"command":"IGNORE"},{"closed":true,"command":"IGNORE"},{"closed":false,"command":"VERSION"},{"closed":false,"command":"DEFINE","config":{"inline":true}}]);
        });
        it('should be ok for parsing freemarker file',function(){
            var ret = _doTestFromFile('a.ftl');
            // check style
            ret.style[0].config.href.should.equal('/src/css/page/schedule.css');
            // check script
            ret.script[0].source.should.not.be.empty;
            ret.script[1].config.src.should.equal('${jslib}define.js?${jscnf}');
            ret.script[2].config.src.should.equal('${jspro}page/schedule/schedule.js');
            // check textarea
            ret.textarea[0].config.should.eql({"name":"txt","id":"product-loading"});
            ret.textarea[0].source.should.not.be.empty;
            ret.textarea[1].config.should.eql({"name":"jst","id":"product-list"});
            ret.textarea[1].source.should.not.be.empty;
            // check instruction
            ret.instr.should.be.empty;
        });
        
    });
});
