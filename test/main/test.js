var should = require('should'),
    fs = require('../../lib/util/file.js'),
    path = require('../../lib/util/path.js'),
    main = require('../../main.js');

describe('main',function(){

    describe('.init(output)',function(){

        //it('should output release.conf',function(){
        //    main.init(__dirname+'/');
        //    fs.exist(__dirname+'/release.conf').should.be.true;
        //});

    });

    describe('.export(list,config,callback)',function(){

        //it('should be ok for export nev',function(done){
        //    this.timeout(60000);
        //    var root = path.absolute(
        //        '../cases/nev/',
        //        __dirname+'/'
        //    );
        //    main.export(['define.js?pro='+root+'src/',root+'build/nev.js'],{
        //        output:root+'build/nev.min.js',
        //        codeWrap:'(function(I$){%s})();'
        //    },function(){
        //        fs.exist(root+'build/nev.min.js').should.be.true;
        //        done();
        //    });
        //});

        it('should be ok for export nej module',function(done){
            this.timeout(60000);
            var output = path.absolute(
                './xdr.min.js',
                __dirname+'/'
            );
            main.export(['http://fed.hz.netease.com/git/nej2/src/define.js','util/ajax/xdr'],{
                output:output
            },function(){
                fs.exist(output).should.be.true;
                done();
            });
        });

    });


});