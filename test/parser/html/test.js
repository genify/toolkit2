var should = require('should'),
    fs = require('../../../lib/util/file.js'),
    Parser = require('../../../lib/parser/html.js');
    
describe('parser/html',function(){
    
    describe('new Parser',function(){
         it('should be ok for parse html file',function(){
             var parser = new Parser({
                 content:fs.read(__dirname+'/a.html').join('\n')
             });
             parser.should.be.an.instanceof(Parser);
             //console.log('%s',JSON.stringify(parser,null,4));
         });
        it('should be ok for parse freemarker file',function(){
            var parser = new Parser({
                content:fs.read(__dirname+'/a.ftl').join('\n')
            });
            parser.should.be.an.instanceof(Parser);
            console.log('%s',JSON.stringify(parser,null,4));
        });
    });
    
});
