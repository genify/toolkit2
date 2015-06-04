var should = require('should'),
    fs  = require('../../../lib/util/file.js'),
    Parser = require('../../../lib/adapter/script.js');

describe('adapter/script',function(){

    describe('new Parser',function(){
        it('should instance of Parser',function(){
            var parser = new Parser({
                map:{'a.js':['a1.js','a2.js']},
                code:{'a1.js':'var a=1111;','a2.js':'var b=22222;'}
            });
            parser.should.be.an.instanceof(Parser);
        });
    });

    describe('.parse(config)',function(){
        var codeMap = {
            'a1.js':'(function(x,y){var a=1111;})();if (DEBUG){dosomething(1);}',
            'a2.js':'(function(z){var b=22222;})();',
            'a3.js':fs.read(__dirname+'/../../cases/base/global.js').join('\n'),
            'b1.js':'var c="ccc";if (CMPT){dosomething2(1);}',
            'b2.js':'var d="ddddd";',
            'c1.js':'var a;console.log(1);var b;',
            'error.js':'zzzz+function();'
        };
        [
            {
                map:{'a.js':['error.js','a1.js','a2.js','error.js','b1.js','b2.js']},
                config:{level:0},
                result:function(ret){
                    //ret.should.have.property('code');
                    //Object.keys(ret.code).should.be.eql(Object.keys(this.map));
                    //console.log('%j',ret);
                }
            },
            {
                map:{'a.js':['a1.js','a2.js'],'b.js':['b1.js','b2.js']},
                config:{level:0},
                result:function(ret){
                    ret.should.have.property('code');
                    Object.keys(ret.code).should.be.eql(Object.keys(this.map));
                    console.log('%j',ret);
                }
            },
            {
                map:{'a.js':['a1.js','a2.js']},
                config:{level:3},
                result:function(ret){
                    ret.should.have.property('code');
                    Object.keys(ret.code).should.be.eql(Object.keys(this.map));
                    console.log('%j',ret);
                }
            },
            {
                map:{'c.js':['c1.js','b2.js']},
                config:{dropconsole:true},
                result:function(ret){
                    ret.should.have.property('code');
                    Object.keys(ret.code).should.be.eql(Object.keys(this.map));
                    console.log('%j',ret);
                }
            }
        ].forEach(function(config){
            it('should be ok for map '+JSON.stringify(config.map),function(){
                var parser = new Parser({
                    map:config.map,
                    code:codeMap,
                    warn:function(event){
                        console.log(event.message);
                    },
                    error:function(event){
                        event.data.unshift(event.message);
                        console.log.apply(console,event.data);
                        console.log('%j',event.files);
                    }
                });
                parser.parse(config.config);
                config.result(parser.dump());
            });
        });


    });

});