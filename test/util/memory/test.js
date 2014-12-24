var mm = require('../../../lib/util/memory.js'),
    should = require('should');

describe('util/memory',function(){
    
    describe('.set(key,value)',function(){
        it('should be ok when set value',function(){
            mm.set('a','aaaaaa');
            mm.get('a').should.equal('aaaaaa');
        });
    });
    describe('.get(key)',function(){
        it('should return null when get unsetted key',function(){
            (mm.get('abc')==null).should.be.true;
        });
        it('should return value when get setted key',function(){
            mm.set('b','bbbbbbbb');
            mm.get('b').should.equal('bbbbbbbb');
        });
    });
    
    describe('.setFileContent(file,content)',function(){
        it('should be ok when set file content',function(){
            mm.set('/a/b/c.js','var a = "aaaa";');
            mm.get('/a/b/c.js').should.equal('var a = "aaaa";');
        });
    });
    describe('.getFileContent(file)',function(){
        it('should return null when get unsetted file',function(){
            (mm.get('/a/b/a.js')==null).should.be.true;
        });
        it('should return file content when get setted file',function(){
            mm.set('/a/b/b.js','doSomething();');
            mm.get('/a/b/b.js').should.equal('doSomething();');
        });
    });
    
    describe('.getFileKey(file)',function(){
        it('should return same value for the same file',function(){
            var file = '/a/b/c.js';
            var key1 = mm.getFileKey(file);
            var key2 = mm.getFileKey(file);
            key1.should.equal(key2);
        });
        it('should return diff value for diff file',function(){
            var file1 = '/a/b/c.js';
            var file2 = '/a/b/d.js';
            var key1 = mm.getFileKey(file1);
            var key2 = mm.getFileKey(file2);
            key1.should.not.equal(key2);
        });
    });
});