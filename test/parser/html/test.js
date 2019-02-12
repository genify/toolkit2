var should = require('should'),
    fs = require('../../../lib/util/file.js'),
    Parser = require('../../../lib/parser/html.js');
    
describe('parser/html',function(){
    
    describe('new Parser',function(){
         // it('should be ok for parse html file',function(){
         //     var parser = new Parser({
         //         file:__dirname+'/create.ftl',
         //         noParseFlag:3,
         //         content:fs.read(__dirname+'/create.ftl').join('\n')
         //     });
         //     console.log('%s',JSON.stringify(parser,null,4));
         //     parser.scan(function(event){
         //         console.log('%s : %s',event.type,event.content);
         //     });
         //     parser.should.be.an.instanceof(Parser);
         // });
        it('should be ok for parse freemarker file',function(){
           var parser = new Parser({
               file:__dirname+'/a.ftl',
               content:fs.read(__dirname+'/a.ftl').join('\n')
           });
           parser.should.be.an.instanceof(Parser);
           console.log('%s',JSON.stringify(parser,null,4));
        });
    });
    
});
