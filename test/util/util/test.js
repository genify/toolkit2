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
            // TODO
        });
    });
});
