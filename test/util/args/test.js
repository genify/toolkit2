var args = require('../../../lib/util/args.js'),
    should = require('should');

describe('util/args',function(){
    
    describe('.parse(argv)',function(){
        var doTest = function(argv,result){
            args.parse(argv).should.eql(result);
        };
        
        it('should be ok for ""',function(){
            doTest('',{options:{}});
            doTest([],{options:{}});
        });
        it('should be ok for "-v" or "--version"',function(){
            doTest('-v',{options:{v:true}});
            doTest('--version',{options:{version:true}});
            doTest(['-v'],{options:{v:true}});
            doTest(['--version'],{options:{version:true}});
        });
        it('should be ok for "-h" or "--help"',function(){
            doTest('-h',{options:{h:true}});
            doTest('--help',{options:{help:true}});
            doTest(['-h'],{options:{h:true}});
            doTest(['--help'],{options:{help:true}});
        });
        it('should be ok for "new -h" or "new --help"',function(){
            doTest('new -h',{command:'new',options:{h:true}});
            doTest('new --help',{command:'new',options:{help:true}});
            doTest(['new','-h'],{command:'new',options:{h:true}});
            doTest(['new','--help'],{command:'new',options:{help:true}});
        });
        it('should be ok for "new -o=/path/to/output/" or "new --output=/path/to/output/"',function(){
            doTest('new -o=/path/to/output/',{command:'new',options:{o:'/path/to/output/'}});
            doTest('new --output=/path/to/output/',{command:'new',options:{output:'/path/to/output/'}});
            doTest(['new','-o=/path/to/output/'],{command:'new',options:{o:'/path/to/output/'}});
            doTest(['new','--output=/path/to/output/'],{command:'new',options:{output:'/path/to/output/'}});
        });
        it('should be ok for "new -o = /path/to/output/" or "new --output = /path/to/output/"',function(){
            doTest('new -o = /path/to/output/',{command:'new',options:{o:'/path/to/output/'}});
            doTest('new --output = /path/to/output/',{command:'new',options:{output:'/path/to/output/'}});
            doTest(['new','-o = /path/to/output/'],{command:'new',options:{o:'/path/to/output/'}});
            doTest(['new','--output = /path/to/output/'],{command:'new',options:{output:'/path/to/output/'}});
        });
        it('should be ok for "new -o = /path/to/output/ -u" or "new --output = /path/to/output/ -u"',function(){
            doTest('new -o = /path/to/output/ -u',{command:'new',options:{o:'/path/to/output/',u:true}});
            doTest('new --output = /path/to/output/ -u',{command:'new',options:{output:'/path/to/output/',u:true}});
            doTest(['new','-o = /path/to/output/ -u'],{command:'new',options:{o:'/path/to/output/',u:true}});
            doTest(['new','--output = /path/to/output/ -u'],{command:'new',options:{output:'/path/to/output/',u:true}});
        });
        it('should be ok for "export file1.js,file2.js,file3.js -o=/path/to/output/"',function(){
            doTest(['export file1.js,file2.js,file3.js -o=/path/to/output/',{command:'export',o:'/path/to/output/'}])
        });
    });
    
});