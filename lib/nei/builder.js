/*
 * nei builder
 * @module   nei/builder
 * @author   genify(caijf@corp.netease.com)
 */
var _io = require('../util/io.js'),
    _logger = require('./util/logger.js').logger;
// nei builder
// nei      - nei platform api
// file     - nei config file path
// config   - config file path or config object
var NEIBuilder = module.exports =
    require('../util/klass.js').create();
var pro = NEIBuilder.extend(require('../util/event.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    // init config
    config = config||{};
    this._api = config.nei;
    this._file = config.file;
    this._config = config.config;
    this._checkTime = this._config.updateTime||0;
    // load nei config
    _logger.info('load nei config with project id %s',this._config.id);
    _io.download(
        this._api+this._config.id,
        this._parseNEIConfig.bind(this)
    );
};
/**
 * parse nei config
 * @private
 * @param  {String} content - content from nei platform
 * @return {Void}
 */
pro._parseNEIConfig = function(content){
    _logger.info('parse nei config');
    // pages        - [{id,path,params,updateTime}]
    // templates    - [{id,path,params,updateTime}]
    // interfaces   - [{id,path,method,isRest,input,output}]
    // datatypes    - [{id,name,format}]
    // attributes   - [{id,name,type,isArray}]
    try{
        var ret = JSON.parse(content);
    }catch(ex){
        _logger.debug('content from nei %s',content);
        _logger.error('nei config parse error\n%s',ex.stack);
        process.exit(1);
    }
    // check result
    if (ret.code!==200){
        _logger.error('config from nei failed, %j',ret);
        process.exit(1);
    }
    this._data = ret.result;
    this._config.updateTime = +new Date;
    // build nei project
    this._buildProject();
    this._buildTemplate();
    this._buildWebRoot();
};
/**
 *
 * @private
 */
pro._buildProject = function(){
    _logger.info('build nei project');


};
/**
 *
 * @private
 */
pro._buildTemplate = function(){

};
/**
 *
 * @private
 */
pro._buildWebRoot = function(){

};

