var should = require('should'),
    fs  = require('../../../lib/util/file.js'),
    Parser = require('../../../lib/adapter/style.js');

describe('adapter/style',function(){

    var parser = new Parser({
        file:'c:/pro/a.css',
        content:fs.read(__dirname+'/a.css').join('\n')
    });

    describe('new Parser',function(){
        it('should instance of Parser',function(){
            parser.should.be.an.instanceof(Parser);
        });
    });

    describe('.parse(config)',function(){
        it('should be ok after parse with config',function(){
            parser.parse({
                webRoot:'c:/webapp/'
            });
            var ret = parser.stringify().replace(/\s/g,'');
            var out = fs.read(__dirname+'/r.css').join('\n').replace(/\s/g,'');
            ret.should.be.eql(out);
        });
    });

});