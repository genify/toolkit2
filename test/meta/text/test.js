var should = require('should'),
    fs = require('../../../lib/util/file.js'),
    Parser = require('../../../lib/meta/text.js');

describe('meta/text',function(){

    var parser = new Parser({
        id:'jst-test',
        type:'jst',
        file:'c:/pro/test.html',
        text:fs.read(__dirname+'/a.html').join('\n')
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

        });
    });

    describe('.stringify()',function(){
        it('should return ok for stringify',function(){
            var ret = parser.stringify();
            ret.should.startWith('<textarea name="jst" id="jst-test">');
            ret.should.endWith('</textarea>');
        });
    });
});
