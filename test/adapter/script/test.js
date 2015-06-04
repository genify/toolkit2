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

        [
            {
                map:{'a.js':['a1.js','a2.js']},
                code:{'a1.js':'var a=1111;','a2.js':'var b=22222;'},
                config:{level:0}
            }
        ].forEach(function(config){
            it('should be ok for map '+JSON.stringify(config.map)+' with code '+JSON.stringify(config.code),function(){
                var parser = new Parser({
                    map:config.map,
                    code:config.code,
                    warn:function(event){
                        console.log(event);
                    },
                    error:function(event){
                        console.log(event);
                    }
                });
                var conf = config.config||{};
                parser.parse(conf);
                var ret = parser.dump();
                ret.should.have.property('code');
                if (conf.level>0){
                    ret.should.have.property('bags');
                }
                if (!!conf.sourcemap){
                    ret.should.have.property('sourcemap');
                }
                Object.keys(ret.code).should.be.eql(Object.keys(config.map));
                console.log('%j',ret);
            });
        });


    });

});