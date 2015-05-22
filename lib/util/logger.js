/*
 * logger utility api
 * @module   util/logger
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
   _util = require('./util.js'),
    Emitter = require('events').EventEmitter;
// logger constructor
var Logger = function(){
    Emitter.call(this);
    // enumerate level value
    this.LEVEL = {
        ALL   :  100,
        DEBUG :  4,
        INFO  :  3,
        WARN  :  2,
        ERROR :  1,
        OFF   : -1
    };
    // level config
    var _gLevel,_gCache = [];
    // log information
    var _doLog = function(level){
        // format log text
        var args = [].slice.call(arguments,1),
            time = _util.getFormatTime('%s-%s-%s %s:%s:%s.%s');
        args[0] = util.format('[%s]\t%s\t-\t%s',level,time,args[0]);
        var event = {
            level:level,
            message:util.format.apply(util,args)
        };
        // cache log info if not level config
        if (_gLevel==null){
            _gCache.push(event);
            console.log(event.message);
            return;
        }
        // check level
        var reqlv = this.LEVEL[level]||this.LEVEL.INFO;
        if (reqlv>_gLevel){
            return;
        }
        // emit log event to show log info
        this.emit('log',event);
    };
    // init config 
    this.config = function(config){
        config = config||{};
        // check logger config
        _gLevel = this.LEVEL[(config.level||'').toUpperCase()]||
                  this.LEVEL.ALL;
        if (!!config.onlog){
            this.on('log',config.onlog);
        }
        // dump log cache
        if (_gCache.length>0){
            var ret = [];
            _gCache.forEach(function(it){
                if (this.LEVEL[it.level]<=_gLevel){
                    ret.push(it.message);
                }
            },this);
            _gCache = [];
            this.emit('log',{
                message:ret.join('\n')
            });
        }
    };
    // dump log cache to file
    this.dump2file = function(file){
        if (_gCache.length>0){
            require('fs').appendFileSync(
                file,_gCache.join('\n')
            );
            _gCache = [];
        }
    };
    // build interface
    ['debug','info','warn','error'].forEach(
        function(name){
            this[name] = function(){
                var args = [].slice.call(arguments,0);
                args.unshift(name.toUpperCase());
                _doLog.apply(this,args);
            };
        },this
    );
    // default log
    this.log = this.info;
};
util.inherits(Logger,Emitter);

// export api
module.exports = new Logger();
