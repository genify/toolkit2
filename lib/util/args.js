/*
 * arguments from shell parse api
 * @module   exec/args
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util');
// arguments parser
// package  - package information
// message  - message config, eg. {'-default':['default message'],'help':['message line1','message line2']}
var Arguments = module.exports
    = require('./klass.js').create();
var pro = Arguments.extend(require('./event.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    this._package = config.package||{};
    this._messages = config.message||{};
};
/**
 * show message
 * @param  {String} key - message key
 * @return {Void}
 */
pro.show = function(key){
    var msg = this._messages[key]||
        this._messages['-default']||'';
    if (util.isArray(msg)){
        msg = msg.join('\n');
    }
    msg = msg.replace(
        '%v',this._package.version
    );
    this._log(msg);
};
/**
 * exec for arguments list
 * @param  {Array} args - arguments
 * @return {Void}
 */
pro.exec = function(args){
    // parse arguments list
    var ret = this._parse(args);
    // check help show
    if (ret.h||ret.help){
        this.show(ret.command);
        this.emit('msg');
        return;
    }
    // check version
    var cmd = (args.command||'').toLowerCase();
    if (!cmd&&(ret.v||ret.version)){
        this._log('Toolkit Version is %s \n',this._package.version);
        this.emit('msg');
        return;
    }
    // emit command event
    var event = {
        args:ret.args,
        options:ret.options
    };
    if (!!cmd){
        this.emit(cmd,event);
    }
    // check command hit
    if (!event.stopped){
        this.show();
        this.emit('msg');
    }
};
/**
 * show log information
 * @private
 * @param  {String} msg - log message
 * @return {Void}
 */
pro._log = function(msg){
    console.log.apply(console,arguments);
};
/**
 * arguments parse
 * @param  {Array}  argv - arguments list
 * @return {Object} result after parse,eg. {command:'abc',options:{a:true,b:'bbb'},args:['aaaa']}
 */
pro._parse = function(argv){
    var result = {options:{}};
    // clear space before/after "=" in aguments
    if (util.isArray(argv)){
        argv = argv.join(' ');
    }
    var argc = argv.replace(/\s*=\s*/g,'=');
    argc.split(' ').forEach(function(arg){
        if (!arg) return;
        var noeq = arg.indexOf('=')<0;
        // check command
        if (arg.indexOf('-')!==0&&noeq){
            if (!result.command){
                result.command = arg;
            }else{
                result.args = result.args||[];
                result.args.push(command);
            }
            return;
        }
        // check options
        arg = arg.replace(/^-*/,'');
        if (noeq){
            result.options[arg] = true;
        }else{
            arg = arg.split('=');
            result.options[arg.shift()] = arg.join('=');
        }
    });
    return result;
};
