var should = require('should'),
    fs  = require('../../../lib/util/file.js'),
    nej = require('../../../lib/script/nej.js');

describe('script/nej',function(){

    describe('.try(file,content)',function(){
        var prsConf = {
            webRoot:__dirname+'/',
            libRoot:__dirname+'/',
            nejPlatform:'td|wk|gk',
            params:{
                lib:__dirname+'/'
            }
        };
        [
            {
                file:'base/global.js',
                result:'result/global.js'
            },
            {
                file:'base/klass.js',
                result:'result/klass.js'
            },
            {
                file:'base/chain.js',
                result:'result/chain.js'
            },
            {
                file:'base/config.js',
                result:'result/config.js'
            },
            {
                file:'base/constant.js',
                result:'result/constant.js'
            },
            {
                file:'base/element.js',
                result:'result/element.js'
            },
            {
                file:'base/event.js',
                result:'result/event.js'
            },
            {
                file:'base/platform.js',
                result:'result/platform.js'
            },
            {
                file:'base/util.js',
                result:'result/util.js'
            }
        ].forEach(function(config){
            it('should output '+config.result+' content for file input '+config.file,function(){
                var file = __dirname+'/'+config.file;
                var ret = nej.try(file,fs.read(file).join('\n'));
                ret.parse(prsConf);
                var code = (ret.stringify()||'').replace(/\s+/g,'');
                var match = (fs.read(__dirname+'/'+config.result)||[]).join('\n').replace(/\s+/g,'');
                code.should.be.eql(match);
            });
        });
    });

});
