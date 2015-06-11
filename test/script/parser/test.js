var should = require('should'),
    path = require('../../../lib/util/path.js'),
    dep = require('../../../lib/util/dependency.js'),
    io  = require('../../../lib/util/io.js'),
    fs  = require('../../../lib/util/file.js'),
    ut  = require('../../../lib/script/nej/util.js'),
    nej = require('../../../lib/script/nej.js');

describe('script/nej',function(){

    describe('.try(file,content)',function(){
        ut.cacheConfig({
            nejRoot:__dirname+'/../../cases/',
            nejPlatform:'td|wk|gk'
        });

        it('should be ok after file parser',function(done){
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
                    var file = path.normalize(__dirname+'/../../cases/'+config.file);
                    var ret = nej.try({
                        file:file,
                        content:fs.read(file).join('\n')
                    });
                    ret.should.be.an.instanceof(nej.Parser);
                    ret.parse({
                        webRoot:__dirname
                    });
                    //fs.write(__dirname+'/'+config.result,ret.stringify());
                    //var code = (ret.stringify()||'').replace(/\s+/g,'');
                    //var match = (fs.read(__dirname+'/'+config.result)||[]).join('\n').replace(/\s+/g,'');
                    //code.should.be.eql(match);
                    //ut.formatDependencies();
                    //fs.write(__dirname+'/dep.json',JSON.stringify(dep.dump(),null,4));
                    //fs.write(__dirname+'/io.json',JSON.stringify(Object.keys(io.dump()).sort(),null,4));
            });

            io.onload(function(){
                ut.formatDependencies();
                fs.write(__dirname+'/dep.json',JSON.stringify(dep.dump(),null,4));
                fs.write(__dirname+'/io.json',JSON.stringify(Object.keys(io.dump()).sort(),null,4));
                done();
            });

        });

    });

});
