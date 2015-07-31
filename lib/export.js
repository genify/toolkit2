/*
 * script exporter
 * @module   export
 * @author   genify(caijf@corp.netease.com)
 */
var _io     = require('./util/io.js'),
    _log = require('./util/logger.js'),
    _util   = require('./util/util.js');
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
        info:_log.log.bind(this,'info'),
        warn:_log.log.bind(this,'warn'),
        debug:_log.log.bind(this,'debug'),
        error:_log.log.bind(this,'error')
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