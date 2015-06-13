var should = require('should'),
    Processor = require('../../../lib/deploy.js');

describe('deploy',function(){

    describe('new Processor',function(){

        it('should be ok for deploy module project with nej 0.1.0+',function(done){
            new Processor({
                file:__dirname+'/release.conf',
                done:function(){
                    done();
                }
            });
        });

    });

});
