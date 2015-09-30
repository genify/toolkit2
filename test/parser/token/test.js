var should = require('should'),
    fs = require('../../../lib/util/file.js'),
    Tokenizer = require('../../../lib/parser/token.js');

describe('parser/token',function(){

    var cases = [
        {
            code:'<a href = "/res/loading.gif" title = "a = zbc & b =c ">',
            result:{name:'a',attrs:{href:'/res/loading.gif',title:'a = zbc & b =c '},closed:!1,selfClosed:!1}
        },{
            code:'<img src = "/res/loading.gif" />',
            result:{name:'img',attrs:{src:'/res/loading.gif'},closed:!1,selfClosed:!0}
        },{
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
        },{
            code:'<img alt="" src="../../res/image/loading.gif" class="test">',
            result:{name:'img',closed:!1,selfClosed:!1,attrs:{src:'../../res/image/loading.gif',alt:'',class:'test'}}
        }
    ];

    describe('Tokenizer',function(){

        cases.push({
            code:'<#assign a = b + c />',
            result:{name:'#assign',closed:!1,selfClosed:!0}
        },{
            code:'<@topbar title="title!\"Ʒ��ҳ\""/>',
            result:{name:'@topbar',closed:!1,selfClosed:!0}
        });
        cases.forEach(function(config){
            config.type = config.type||'tag';
            config.result.source = config.code;
            it('should return '+JSON.stringify(config.result)+' for parse '+config.type+': '+config.code,function(){
                // do tokenizer
                //var opt = {},ret;
                //opt[config.type] = function(e){ret = e;};
                var tokenizer = new Tokenizer({
                    content:config.code
                });
                var ret = (tokenizer.dump(config.type)[0]||{}).data;
                // check result
                var r = config.result;
                if (!!r.attrs){
                    (ret.attrs).should.containEql(r.attrs);
                }
                delete r.attrs;
                delete ret.attrs;
                ret.should.eql(r);
            });
        });

        var _doTestFromFile = function(file){
            var ret = {tag:[],text:[],comment:[]};
            new Tokenizer(
                {
                    content:fs.read(__dirname+'/'+file).join('\n'),
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
        // _doTestFromFile('a.html');
        // });
        // it('should be ok for parsing freemarker file',function(){
        // _doTestFromFile('a.ftl');
        // });
        it('should be ok for parsing script with tag',function(){
            var ret = _doTestFromFile('b.html');
            // beg script
            var tag = ret.tag.shift();
            tag.name.should.equal('script');
            // end script
            var tag = ret.tag.pop();
            tag.name.should.equal('script');
            tag.closed.should.be.true;
        });
        it('should be ok for parsing textarea with content',function(){
            var ret = _doTestFromFile('c.html');
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
            var ret = _doTestFromFile('d.html');
            ret.comment.length.should.equal(1);
            ret.comment[0].comment.trim().should.equal('Comment content');
        });
    });

});



