var should = require('should'),
    path = require('../../../lib/util/path.js'),
    WebApp = require('../../../lib/nei/webapp.js'),
    logger = require('../../../lib/util/logger.js').logger;

describe('nei/webapp',function(){

    var log = function(type,event){
        var args = event.data||[];
        args.unshift(event.message||'');
        logger[type].apply(logger,args);
    };

    describe('new WebApp',function(){

        it('should ok to build webapp',function(done){
            this.timeout(40000);
            var root = path.normalize(__dirname+'/');
            new WebApp({
                id:10004,
                overwrite:true,
                proRoot:root+'pro/',
                webRoot:root+'pro/webapp/',
                viewRoot:root+'pro/views/',
                debug:log.bind(log,'debug'),
                info:log.bind(log,'info'),
                warn:log.bind(log,'warn'),
                error:log.bind(log,'error'),
                done:function(){
                    done();
                }
            });
        });

    });

});