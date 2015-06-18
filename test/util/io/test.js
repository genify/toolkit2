var io = require('../../../lib/util/io.js'),
    should = require('should');

describe('util/io',function(){
    
    describe('.get(uri,callback)',function(){
        it('should be ok for getting local file',function(done){
            io.get(__dirname+'/a.txt',function(event){
                '123456789'.should.be.eql(event.value);
            });
        });
    });

    describe('.cache(uri,content)',function(){
        it('should cache content success for uri',function(){
            io.cache('a/b.js','var a=1111;');
            'var a=1111;'.should.be.eql(io.getFromCache('a/b.js'));
        });
    });

    describe('.getFromCache(uri)',function(){
        it('should get content from cache',function(){
            'var a=1111;'.should.be.eql(io.getFromCache('a/b.js'));
            '123456789'.should.be.eql(io.getFromCache(__dirname+'/a.txt'));
        });
    });

    describe('.fill(list,sep)',function(){
        it('should fill content by uri list',function(){
            'var a=1111;\n123456789'.should.be.eql(
                io.fill(['a/b.js',__dirname+'/a.txt'])
            );
        });
    });

});
