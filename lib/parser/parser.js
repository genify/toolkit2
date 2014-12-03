var util = require('util'),
    Emitter = require('events').EventEmitter;

var Parser = module.exports = function(arg,events){
    Emitter.apply(this,arguments);
    
    // emit with catch
    this.emit = function(name,event){
        try{
            Emitter.prototype.emit.apply(this,arguments);
        }catch(ex){
            // ignore
        }
    };
    // add events
    if (!!events){
        Object.keys(events).forEach(function(k){
            this.on(k,events[k]);
        },this);
    }
};
util.inherits(Parser,Emitter);

