var should = require('should'),
    io = require('../../../lib/util/io.js'),
    fs = require('../../../lib/util/file.js'),
    Parser = require('../../../lib/meta/script.js');

describe('meta/script',function(){

    var parser = new Parser({
        file:'c:/pro/test.html',
        text:fs.read(__dirname+'/a.js').join('\n')
    });

    describe('new Parser',function(){
        it('should instance of Parser',function(){
            parser.should.be.an.instanceof(Parser);
        });
    });

    describe('.parse(config)',function(){
        it('should return ok after parse',function(){
            parser.parse({
                webRoot:'c:/webapp/'
            });
            var list = parser.getDependencies();
            var ret = io.getFromCache(list[0]).replace(/\s/g,'');
            var org = fs.read(__dirname+'/r.css').join('').replace(/\s/g,'');
            ret.should.be.eql(org);
        });
    });

});