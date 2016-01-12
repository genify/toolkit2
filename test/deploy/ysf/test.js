var should = require('should'),
    Processor = require('../../../lib/deploy.js');

describe('deploy',function(){

    it('should be ok',function(done){
        this.timeout(60000);
        new Processor({
            file:__dirname+'/release.kefu.conf',
            done:function(){
                done();
            }
        });
    });

});
