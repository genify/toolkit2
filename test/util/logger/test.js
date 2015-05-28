var logger = require('../../../lib/util/logger.js'),
    should = require('should');

describe('util/logger',function(){
    
    describe('.config(conf)',function(){
        var dolog = function(){
            logger.log('default log message');
            logger.debug('debug message');
            logger.info('info message');
            logger.warn('warn message');
            logger.error('error message');
        };
        it('should output error log when level=ERROR',function(){
            logger.config({
                level:'ERROR',
                onlog:function(log){
                    ['ERROR'].should.containEql(log.level);
                }
            });
            dolog();
            logger.removeAllListeners();
        });
        it('should output warn/error log when level=WARN',function(){
            var count = 0;
            logger.config({
                level:'WARN',
                onlog:function(log){
                    count++;
                    ['ERROR','WARN'].should.containEql(log.level);
                }
            });
            dolog();
            count.should.equal(2);
            logger.removeAllListeners();
        });
        it('should output info/warn/error log when level=INFO',function(){
            var count = 0;
            logger.config({
                level:'INFO',
                onlog:function(log){
                    count++;
                    ['ERROR','WARN','INFO'].should.containEql(log.level);
                }
            });
            dolog();
            count.should.equal(4);
            logger.removeAllListeners();
        });
        it('should output debug/info/warn/error log when level=DEBUG',function(){
            var count = 0;
            logger.config({
                level:'DEBUG',
                onlog:function(log){
                    count++;
                    ['ERROR','WARN','INFO','DEBUG'].should.containEql(log.level);
                }
            });
            dolog();
            count.should.equal(5);
            logger.removeAllListeners();
        });
    });

    describe('.debug(message)',function(){
        it('should output DEBUG message',function(){
            logger.on('log',function(log){
                log.level.should.equal('DEBUG');
            });
            logger.debug('message');
            logger.removeAllListeners();
        });
    });
    
    describe('.log(message)',function(){
        it('should output INFO message',function(){
            logger.on('log',function(log){
                log.level.should.equal('INFO');
            });
            logger.log('message');
            logger.removeAllListeners();
        });
    });
    
    describe('.info(message)',function(){
        it('should output INFO message',function(){
            logger.on('log',function(log){
                log.level.should.equal('INFO');
            });
            logger.info('message');
            logger.removeAllListeners();
        });
    });
    
    describe('.warn(message)',function(){
        it('should output WARN message',function(){
            logger.on('log',function(log){
                log.level.should.equal('WARN');
            });
            logger.warn('message');
            logger.removeAllListeners();
        });
    });
    
    describe('.error(message)',function(){
        it('should output ERROR message',function(){
            logger.on('log',function(log){
                log.level.should.equal('ERROR');
            });
            logger.error('message');
            logger.removeAllListeners();
        });
    });
    
});
