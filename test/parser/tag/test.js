var _tag = require('../../../lib/parser/tag.js'),
    _fs  = require('../../../lib/util/file.js'),
     should = require('should');
    
describe('parser/tag',function(){
    
    describe('new Tokenizer',function(){
        it('should be ok for parse token',function(){
            var file = process.cwd()+'/parser/tag/a.ftl';
            var parser = new _tag.Tokenizer(
                _fs.read(file).join('\n'),{
                    tag:function(options){
                        console.log('%s -> %j',options.source,options);
                    },
                    text:function(options){
                        console.log('text -> %j',options);
                    }
                }
            );
            parser.should.be.an.instanceof(_tag.Tokenizer);
        });
    });
    
});
