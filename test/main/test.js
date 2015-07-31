var should = require('should'),
    fs = require('../../lib/util/file.js'),
    path = require('../../lib/util/path.js'),
    main = require('../../main.js');

describe('main',function(){

    describe('.init(output)',function(){

        it('should output release.conf',function(){
            main.init(__dirname+'/');
            fs.exist(__dirname+'/release.conf').should.be.true;
        });

    });

    describe('.export(list,config,callback)',function(done){
        this.timeout(60000);
        var root = path.absolute(
            '../cases/nev/',
            __dirname+'/'
        );
        main.export(['define.js?pro='+root+'src/',root+'build/nev.js'],{
            output:root+'build/nev.min.js',
            codeWrap:'(function(I$){%s})();'
        },function(){
            fs.exist(root+'build/nev.min.js').should.be.true;
            done();
        });
    });

});