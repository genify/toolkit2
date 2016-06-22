var should = require('should'),
    main = require('../../main.js');

describe('cache',function(){

    it('should be ok for nej cache',function(done){
        this.timeout(60000);
        main.cache(
            __dirname+'/cache.json',
            {token:'xxxxxx'},function(){
                done();
            }
        );
    });

});
