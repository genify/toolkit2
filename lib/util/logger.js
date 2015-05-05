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
    var _gLevel = this.LEVEL.ALL;
    // log information
    var _doLog = function(level){
        // check level
        var reqlv = this.LEVEL[level]||this.LEVEL.INFO;
        if (reqlv>_gLevel){
            return;
        }
        // format log text
        var args = [].slice.call(arguments,1),
            time = _util.getFormatTime('%s-%s-%s %s:%s:%s.%s');
        args[0] = util.format('[%s]\t%s\t-\t%s',level,time,args[0]);
        var text = util.format.apply(util,args);
        this.emit('log',{
            level:level,
            message:text
        });
    };
    // init config 
    this.config = function(config){
        config = config||{};
        _gLevel = this.LEVEL[(config.level||'').toUpperCase()]||
                  this.LEVEL.ALL;
        if (!!config.onlog){
            this.on('log',config.onlog);
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
