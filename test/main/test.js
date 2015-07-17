var should = require('should'),
    fs = require('../../lib/util/file.js'),
    main = require('../../main.js');

describe('main',function(){

    describe('.init(output)',function(){

        it('should output release.conf',function(){
            main.init(__dirname+'/');
            fs.exist(__dirname+'/release.conf').should.be.true;
        });

    });

});