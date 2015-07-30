var should = require('should'),
    Processor = require('../../../lib/deploy.js');

describe('deploy',function(){

    it('should be ok for deploy injector test case',function(done){
        this.timeout(20000);
        new Processor({
            file:__dirname+'/release.conf',
            done:function(){
                done();
            }
        });
    });

});
