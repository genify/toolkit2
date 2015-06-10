var should = require('should'),
    fs      = require('../../../lib/util/file.js'),
    Patcher = require('../../../lib/script/nej/patcher.js');

describe('script/nej/patcher',function(){

    var patcher = new Patcher({
        expression:'TR<=3.0',
        dependency:['base/config','util/flash/flash'],
        source:fs.read(__dirname+'/func.js').join('\n')
    });

    describe('new Patcher',function(){
        it('should instance of Patcher',function(){
            patcher.should.be.an.instanceof(Patcher);
        });
    });

    describe('.isFit(platform)',function(){
        [
            {
                platform:'td',
                result:true
            },
            {
                platform:'gk',
                result:false
            },
            {
                platform:'wk',
                result:false
            },
            {
                platform:'td|wk|gk',
                result:true
            }
        ].forEach(function(config){
            it('should '+(!config.result?'not ':'')+'fit to platform '+config.platform,function(){
                var ret = patcher.isFit(config.platform);
                config.result.should.be.equal(ret);
            });
        });
    });

    describe('.parse(config)',function(){
        it('will be ok after parse',function(){
            patcher.parse({
                platformName:'p',
                nejRoot:'c:/nej/src/'
            });
            [
                {uri:'c:/nej/src/base/config.js'},
                {uri:'c:/nej/src/util/flash/flash.js'}
            ].should.be.eql(
                patcher.getDependencies()
            );
            patcher.stringify().should.containEql(
                fs.read(__dirname+'/func.js').join('\n')
            );
            //console.log('%j',patcher.stringify());
        });
    });
});