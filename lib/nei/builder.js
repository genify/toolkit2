/*
 * nei builder
 * @module   nei/builder
 * @author   genify(caijf@corp.netease.com)
 */
var util   = require('util'),
    path   = require('path'),
   _ut     = require('./util.js'),
   _io     = require('../util/io.js'),
   _fs     = require('../util/file.js'),
   _path   = require('../util/path.js'),
   _logger = require('./util/logger.js').logger;
// nei builder
// nei      - nei config get api
// config   - build config object
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
    this._config = config.config;
    this._checkTime = this._config.updateTime||0;
    // load nei config
    _logger.info('load nei config with project id %s',this._config.id);
    _io.download(
        util.format(config.nei,this._config.id),
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
    this._formatData();
    this._buildProject();
    this._buildTemplate();
    this._buildWebRoot();
};
/**
 * format nei config data
 * @private
 * @return {Void}
 */
pro._formatData = function(){

};
/**
 * build project structure
 * @private
 * @return {Void}
 */
pro._buildProject = function(){
    _logger.info('build nei project');
    // build webapp
    _fs.cpdir(
        __dirname+'/../../template/webapp/',
        this._config.webroot,function(src,dst){
            _logger.info('create %s',dst);
        }
    );
    // build template
    _fs.cpdir(
        __dirname+'/../../template/view/',
        this._config.template,function(src,dst){
            _logger.info('create %s',dst);
        }
    );
    // build deploy config
    var deploy = this._config.project+'deploy/release.conf';
    if (!_fs.exist(deploy)){
        _logger.info('create %s',deploy);
        var file = __dirname+'/../../template/deploy/release.conf',
            output = this._config.template.replace(/\/.*?\/$/,'/tpl/'),
            content = (_fs.read(file)||[]).join('\n');
        _fs.mkdir(deploy);
        _fs.write(
            deploy,_ut.unwrap(content,{
                DIR_WEBROOT:_path.normalize(
                    path.relative(deploy,this._config.webroot)
                ),
                DIR_SOURCE_TP:_path.normalize(
                    path.relative(this._config.webroot,this._config.template)
                ),
                DIR_OUTPUT_TP:_path.normalize(
                    path.relative(this._config.webroot,output)
                )
            })
        );
    }
};
/**
 * build template structure
 * @private
 * @return {Void}
 */
pro._buildTemplate = function(){
    var root = this._config.template,
        mock = root+'mock/',
        list = this._data.templates||[];

    list.forEach(function(it){
        // build mock directory


        // build template directory
        var file = _path.absolute(
            it.path,root
        );
        _logger.info('create %s',file);
        _fs.mkdir(file);



    });


};
/**
 * build webapp structure
 * @private
 * @return {Void}
 */
pro._buildWebRoot = function(){

};

