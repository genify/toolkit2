/*
 * script exporter
 * @module   export
 * @author   genify(caijf@corp.netease.com)
 */
var _io     = require('./util/io.js'),
    _util   = require('./util/util.js'),
    _logger = require('./util/logger.js').logger;
// script exporter
// file  - file relative to
// list  - script file list
var Exporter = module.exports =
    require('./util/klass.js').create();
var pro = Exporter.extend(require('./util/event.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    config = config||{};
    this._super(config);
    this._logConfig = {
        info:this._log.bind(this,'info'),
        warn:this._log.bind(this,'warn'),
        debug:this._log.bind(this,'debug'),
        error:this._log.bind(this,'error')
    };
    this._explorer = new (require('./explorer/script.js'))(
        _util.merge(this._logConfig,{
            file:config.file,
            list:config.list
        })
    );
};
/**
 * parse script list
 * @param  {Object} config - config object
 * @return {Void}
 */
pro.parse = function(config){
    this._explorer.parse(config);
    _io.onload(this._afterScriptLoad.bind(this,config));
};
/**
 * log message
 * @private
 * @param  {String} type  - message type
 * @param  {Object} event - message information
 * @return {Void}
 */
pro._log = function(type,event){
    var args = event.data||[];
    args.unshift(event.message||'');
    _logger[type].apply(_logger,args);
};
/**
 * after script loaded
 * @private
 * @return {Void}
 */
pro._afterScriptLoad = function(config){
    var list = this._explorer.getDependencies(),
        script = new (require('../adapter/script.js'))(
            _util.merge(this._logConfig,{
                map:{'export.js':_io.fill(list)}
            })
        ),
        ret = script.parse(config);

};