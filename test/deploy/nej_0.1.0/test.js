var should = require('should'),
    Processor = require('../../../lib/deploy.js');

describe('deploy',function(){

    describe('new Processor',function(){

        it('should be ok for deploy module project with nej 0.1.0+',function(done){
            this.timeout(20000);
            new Processor({
                file:__dirname+'/release.conf',
                done:function(){
                    done();
                }
            });
        });

    });

});
