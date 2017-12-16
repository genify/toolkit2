var should = require('should'),
    Processor = require('../../../lib/deploy.js');

describe('deploy',function(){

    it('should be ok with dependency config',function(done){
        this.timeout(1000000);
        new Processor({
            file:__dirname+'/release.conf',
            done:function(){
                done();
            }
        });
    });

});
