var util = require('../../../lib/util/util.js'),
    should = require('should');

describe('util/util',function(){
    
    describe('.merge(arg0,arg1,...)',function(){
        it('should return empty object if whitout arguments',function(){
            var ret = util.merge();
            ret.should.eql({});
        });
        it('should be ok with one argument',function(){
            var ret = util.merge({a:'aaaaa'});
            ret.should.eql({a:'aaaaa'});
        });
        it('should be ok with two argument',function(){
            var ret = util.merge({a:'aaaaa'},{b:'bbbbb'});
            ret.should.eql({a:'aaaaa',b:'bbbbb'});
        });
        it('should be ok with repeat properties',function(){
            var ret = util.merge({a:'aaaaa'},{b:'bbbbb',a:1});
            ret.should.eql({a:1,b:'bbbbb'});
        });
    });
    
    describe('.fetch(template,config)',function(){
        it('should return empty object if without arguments',function(){
            var ret = util.fetch();
            ret.should.eql({});
        });
        it('should return empty object if without template',function(){
            var ret = util.fetch(null,{a:'aaaa'});
            ret.should.eql({});
        });
        it('should return template if without config',function(){
            var ret = util.fetch({a:'aaaa'});
            ret.should.eql({a:'aaaa'});
        });
        it('should be ok with no properties in config',function(){
            var ret = util.fetch({a:'aaaa'},{b:'bbbbb'});
            ret.should.eql({a:'aaaa'});
        });
        it('should be ok with template and config',function(){
            var ret = util.fetch({a:'aaaa'},{a:'bbbbb'});
            ret.should.eql({a:'bbbbb'});
        });
    });
    
    describe('.getFormatTime(format,time)',function(){
        it('should be ok for format %s%s%s.%s%s%s%s with time',function(){
            var date = new Date(2015,10,6,12,5,40,260);
            var ret = util.getFormatTime('%s%s%s.%s%s%s%s',date);
            ret.should.be.eql('20151106.120540260');
        });
    });

    describe('.md5(content)',function(){
        it('should be ok for md5 content',function(){
            var ret = util.md5('MD5 message-digest algorithm is a widely used cryptographic hash function producing a 128-bit (16-byte) hash value');
            ret.should.be.eql('64ad334455c932287a3d1861ad3d62fa');
        });
    });

    describe('.rand(min,max)',function(){
        it('should generate rand number between min and max',function(){
            var ret = util.rand(5,20);
            ret.should.be.within(5,19);
            var ret = util.rand(1,1);
            ret.should.be.eql(1);
        });
    });

    describe('.increment()',function(){
        it('should return increment number',function(){
            var a = util.increment();
            var b = util.increment();
            a.should.be.below(b);
        });
    });

    describe('.isFunction(func)',function(){
        it('should be ok for any type of parameters',function(){
            util.isFunction(function(){}).should.be.true;
            util.isFunction(1).should.be.false;
            util.isFunction('1111').should.be.false;
            util.isFunction(true).should.be.false;
            util.isFunction({a:'aaaa'}).should.be.false;
            util.isFunction([1,2,3]).should.be.false;
        });
    });

    describe('.concat(list1,list2,...,filter)',function(){
        it('return unique items from all list',function(){
            var ret = util.concat(
                [1,2,3,4,5],
                [6,3,8,7,9,'a','1']
            );
            ret.should.be.eql([1,2,3,4,5,6,8,7,9,'a','1']);
        });
        it('can check complex type by filter',function(){
            var ret = util.concat(
                [{id:1,name:'111'},{id:2,name:'222'}],
                [{id:2,name:'222'},{id:3,name:'33333'}],
                function(item){
                    return item.id;
                }
            );
            ret.should.be.eql([{id:1,name:'111'},{id:2,name:'222'},{id:3,name:'33333'}]);
        });
    });

    describe('.split(list1,list2)',function(){
        it('split list2 items from list1, and list1 will be updated',function(){
            var list = [1,2,3,4,5,6];
            var ret = util.split(list,[4,5,7,8]);
            list.should.be.eql([1,2,3,6]);
            ret.should.be.eql([4,5]);
        });
    });

    describe('.version(mode,map)',function(){
        var map = {
            RAND:util.increment(),
            VERSION:util.md5('content content'),
            FILENAME:'abc'
        };
        [
            {
                mode:0,
                result:{file:map.FILENAME,version:map.VERSION}
            },
            {
                mode:1,
                result:{file:map.FILENAME,version:map.RAND}
            },
            {
                mode:'v1',
                result:{file:map.FILENAME+'_v1',version:''}
            },
            {
                mode:'[FILENAME]_v2',
                result:{file:map.FILENAME+'_v2',version:''}
            },
            {
                mode:'[FILENAME]_[VERSION]',
                result:{file:map.FILENAME+'_'+map.VERSION,version:''}
            },
            {
                mode:'[FILENAME]_[RAND]',
                result:{file:map.FILENAME+'_'+map.RAND,version:''}
            }
        ].forEach(function(config){
            it('should return '+JSON.stringify(config.result)+' for mode '+config.mode,function(){
                var ret = util.version(config.mode,map);
                config.result.should.be.eql(ret);
            });
        });
    });

    describe('.randNext(list)',function(){
        it('should return the only item for length is 1',function(){
            var ret = util.randNext([1]);
            ret.should.be.eql(1);
        });
        it('should be ok for multiple items',function(){
            var list = [1,2,3];
            var ret = util.randNext(list);
            list.should.containEql(ret);
        });
    });

    describe('.datetime(time,format)',function(){
        var dt = new Date(2015,11,12,10,30,20,300);
        it('should return ok for format yyyy-MM-dd HH:mm:ss.ms',function(){
            var ret = util.datetime(dt,'yyyy-MM-dd HH:mm:ss.ms');
            ret.should.be.eql('2015-12-12 10:30:20.300');
        });
    });

    describe('.isModeOf(mode,test)',function(){
        [
            {
                arg:['online','online'],
                ret:!0
            },
            {
                arg:['online|test','release'],
                ret:!1
            },
            {
                arg:['online|test','test'],
                ret:!0
            },
            {
                arg:['!online|test','release'],
                ret:!0
            },
            {
                arg:['!test','online'],
                ret:!0
            },
            {
                arg:['!test','test'],
                ret:!1
            }
        ].forEach(function(conf){
            it('should return '+conf.ret+'for mode '+conf.arg[0]+' with test '+conf.arg[1],function(){
                var ret = util.isModeOf.apply(util,conf.arg);
                conf.ret.should.be.equal(ret);
            });
        })
    });

});
