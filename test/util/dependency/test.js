var deps = require('../../../lib/util/dependency.js'),
    should = require('should');

describe('util/dependency',function(){

    describe('.set(uri,list)',function(){
        it('should be ok for caching dependency list',function(){
            deps.set('a.js',['b.js','c.js','d.js']);
            deps.set('b.js',['e.js','c.js']);
            deps.set('c.js',['b.js','f.js']);
            deps.set('d.js',['e.js']);
            deps.get('a.js').should.be.eql(['b.js','c.js','d.js']);
            deps.get('b.js').should.be.eql(['e.js','c.js']);
            deps.get('c.js').should.be.eql(['b.js','f.js']);
            deps.get('d.js').should.be.eql(['e.js']);
            (deps.get('f.js')==null).should.be.true;
        });
    });

    describe('.get(uri)',function(){
        it('should return dependency list for uri',function(){
            deps.set('a.js',['b.js','c.js','d.js']);
            deps.set('b.js',['e.js','c.js']);
            deps.set('c.js',['b.js','f.js']);
            deps.set('d.js',['e.js']);
            deps.get('a.js').should.be.eql(['b.js','c.js','d.js']);
            deps.get('b.js').should.be.eql(['e.js','c.js']);
            deps.get('c.js').should.be.eql(['b.js','f.js']);
            deps.get('d.js').should.be.eql(['e.js']);
            (deps.get('f.js')==null).should.be.true;
        });
    });

    describe('.complete(list)',function(){
        it('should return complete dependency list',function(){
            deps.complete(['a.js','f.js']).should.be.eql(['e.js','f.js','c.js','b.js','d.js','a.js']);
        });
    });

});