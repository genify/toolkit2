var should = require('should'),
    log = require('../../../lib/util/logger.js');

describe('util/logger',function(){

    var dolog = function(logger){
        logger.log('info message');
        logger.debug('debug message');
        logger.info('info message');
        logger.warn('warn message');
        logger.error('error message');
    };

    describe('Logger',function(){
        it('should be ok when create Logger instance',function(){
            var ret = [];
            var inst = new log.Logger({
                level:log.level.ALL,
                log:function(event){
                    ret.push(event.level);
                }
            });
            dolog(inst);
            ret.should.eql([
                log.level.INFO,
                log.level.DEBUG,
                log.level.INFO,
                log.level.WARN,
                log.level.ERROR
            ]);
        });
    });

    describe('leve',function(){
        it('level can be used in logger.config',function(){
            log.level.should.eql({
                ALL   :  100,
                DEBUG :  4,
                INFO  :  3,
                WARN  :  2,
                ERROR :  1,
                OFF   : -1
            });
        });
    });

    describe('logger',function(){
        it('should be instanceof Logger',function(){
            (log.logger instanceof log.Logger).should.eql(true);
        });
    });

    describe('logger.setLevel(level)',function(){
        it('should output error log when level=ERROR',function(){
            var ret = [];
            log.logger.setLevel(log.level.ERROR);
            log.logger.on('log',function(event){
                ret.push(event.level);
            });
            dolog(log.logger);
            ret.should.eql([
                log.level.ERROR
            ]);
        });
        it('should output warn/error log when level=WARN',function(){
            var ret = [];
            log.logger.setLevel(log.level.WARN);
            log.logger.on('log',function(event){
                ret.push(event.level);
            });
            dolog(log.logger);
            ret.should.eql([
                log.level.WARN,
                log.level.ERROR
            ]);
        });
        it('should output info/warn/error log when level=INFO',function(){
            var ret = [];
            log.logger.setLevel(log.level.INFO);
            log.logger.on('log',function(event){
                ret.push(event.level);
            });
            dolog(log.logger);
            ret.should.eql([
                log.level.INFO,
                log.level.INFO,
                log.level.WARN,
                log.level.ERROR
            ]);
        });
        it('should output debug/info/warn/error log when level=DEBUG',function(){
            var ret = [];
            log.logger.setLevel(log.level.DEBUG);
            log.logger.on('log',function(event){
                ret.push(event.level);
            });
            dolog(log.logger);
            ret.should.eql([
                log.level.INFO,
                log.level.DEBUG,
                log.level.INFO,
                log.level.WARN,
                log.level.ERROR
            ]);
        });
        it('should output debug/info/warn/error log when level=DEBUG',function(){
            var ret = [];
            log.logger.setLevel(log.level.DEBUG);
            log.logger.on('log',function(event){
                ret.push(event.level);
            });
            dolog(log.logger);
            ret.should.eql([
                log.level.INFO,
                log.level.DEBUG,
                log.level.INFO,
                log.level.WARN,
                log.level.ERROR
            ]);
        });
        it('should output debug/info/warn/error log when level=ALL',function(){
            var ret = [];
            log.logger.setLevel(log.level.ALL);
            log.logger.on('log',function(event){
                ret.push(event.level);
            });
            dolog(log.logger);
            ret.should.eql([
                log.level.INFO,
                log.level.DEBUG,
                log.level.INFO,
                log.level.WARN,
                log.level.ERROR
            ]);
        });
        it('should no output log when level=OFF',function(){
            var ret = [];
            log.logger.setLevel(log.level.OFF);
            log.logger.on('log',function(event){
                ret.push(event.level);
            });
            dolog(log.logger);
            ret.should.eql([]);
        });
    });

    describe('logger.debug(message)',function(){
        it('should output DEBUG message',function(){
            var ret;
            log.logger.setLevel(log.level.ALL);
            log.logger.on('log',function(event){
                ret = event.level;
            });
            log.logger.debug('message');
            log.level.DEBUG.should.equal(ret);
        });
    });
    
    describe('logger.log(message)',function(){
        it('should output INFO message',function(){
            var ret;
            log.logger.setLevel(log.level.ALL);
            log.logger.on('log',function(event){
                ret = event.level;
            });
            log.logger.log('message');
            log.level.INFO.should.eql(ret);
        });
    });
    
    describe('logger.info(message)',function(){
        it('should output INFO message',function(){
            var ret;
            log.logger.setLevel(log.level.ALL);
            log.logger.on('log',function(event){
                ret = event.level;
            });
            log.logger.info('message');
            log.level.INFO.should.eql(ret);
        });
    });
    
    describe('logger.warn(message)',function(){
        it('should output WARN message',function(){
            var ret;
            log.logger.setLevel(log.level.ALL);
            log.logger.on('log',function(event){
                ret = event.level;
            });
            log.logger.warn('message');
            log.level.WARN.should.eql(ret);
        });
    });
    
    describe('logger.error(message)',function(){
        it('should output ERROR message',function(){
            var ret;
            log.logger.setLevel(log.level.ALL);
            log.logger.on('log',function(event){
                ret = event.level;
            });
            log.logger.error('message');
            log.level.ERROR.should.eql(ret);
        });
    });
    
});
