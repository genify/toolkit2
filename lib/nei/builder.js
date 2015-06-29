/*
 * Abstract NEI Builder
 * @module   nei/builder
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
   _fs   = require('../util/file.js'),
   _util = require('../util/util.js');
// nei config file field
var NEI_CONFIG = {
    id:0,
    proRoot:'./',
    updateTime:0
};
// nei builder
// id         - nei project id
// updateTime - last update time
// overwrite  - whether overwrite file existed
var NEIBuilder = module.exports
    = require('../util/klass.js').create();
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
    this._config = _util.fetch(
        NEI_CONFIG, config
    );
    this._config = _util.merge(
        this._config,
        this.config(config)
    );
    // init build/update config
    this._options = {
        overwrite:!!config.overwrite,
        checkTime:parseInt(config.updateTime,10)||0
    };
    // load config data from nei platform
    var api = util.format(
        require('../../package.json').nei,
        config.id
    );
    this.emit('info',{
        data:[api],
        message:'load nei config from %s'
    });
    _io.download(api,this._parseConfig.bind(this));
};
/**
 * parse nei config object
 * @private
 * @param  {String} content - nei config string
 * @return {Void}
 */
pro._parseConfig = function(content){
    this.emit('info',{
        message:'parse nei config'
    });
    // parse content to json
    try{
        // timestamp    - current timestamp
        // pages        - [{id,path,params,updateTime}]
        // templates    - [{id,path,params,updateTime}]
        // interfaces   - [{id,path,method,isRest,input,output}]
        // datatypes    - [{id,name,format}]
        // attributes   - [{id,name,type,isArray}]
        var ret = JSON.parse(content);
    }catch(ex){
        this.emit('debug',{
            data:[content],
            message:'content from nei %s'
        });
        this.emit('error',{
            data:[ex.stack],
            message:'nei config parse error\n%s'
        });
    }
    // check config data
    if (!ret){
        return;
    }
    if (ret.code!==200){
        this.emit('error',{
            data:[ret],
            message:'illegal config data from nei %j'
        });
        return;
    }
    // check result
    var ret = ret.result;
    if (!ret.timestamp){
        this.emit('error',{
            data:[ret],
            message:'illegal config data from nei %j'
        });
        return;
    }
    // save update time
    this._config.updateTime = ret.timestamp;
    // build/update project
    this._formatConfig(ret);
    if (this._options.checkTime===0){
        this.build(this._config,this._options,this._data);
    }else{
        this.update(this._config,this._options,this._data);
    }
};
/**
 * format config data
 * @private
 * @param  {Object} data - config data
 * @return {Void}
 */
pro._formatConfig = function(data){

};
/**
 * flush nei config file
 * @private
 * @return {Void}
 */
pro._finishBuild = function(){
    var file = _path.absolute(
        './nei.json',
        this._config.proRoot
    );
    this.emit('info',{
        data:[file],
        message:'output %s'
    });
    _fs.write(
        file,JOSN.stringify(
            this._config,null,4
        )
    );
};
/**
 * filter config field from input
 * @param  {Object} config - config data
 * @return {Object} result will be save to config file
 */
pro.config = function(config){
    // do something by subclass
};
/**
 * build project
 * @param  {Object}  config - config object, parameters return from this.config api
 * @param  {Number}  config.id - project id
 * @param  {Object}  options - build options
 * @param  {Boolean} options.overwrite - whether overwrite mode
 * @param  {Number}  options.checkTime - last update check time
 * @param  {Object}  data - data config from nei platform
 * @return {Void}
 */
pro.build = function(config,options,data){
    // do something by subclass
};
/**
 * update project
 * @param  {Object}  config - config object, parameters return from this.config api
 * @param  {Number}  config.id - project id
 * @param  {Object}  options - update options
 * @param  {Boolean} options.overwrite - whether overwrite mode
 * @param  {Number}  options.checkTime - last update check time
 * @param  {Object}  data - data config from nei platform
 * @return {Void}
 */
pro.update = function(config,options,data){
    // do something by subclass
};
/**
 * build success logic
 * @param  {Function} callback - finish callback
 * @return {Void}
 */
pro.done = function(callback){
    this._finishBuild();
    if (_util.isFunction(callback)){
        callback.call(this);
    }
};
/**
 * build error logic
 * @param  {Function} callback - finish callback
 * @return {Void}
 */
pro.error = function(callback){
    // revert check time
    this._config.updateTime =
        this._options.checkTime;
    this._finishBuild();
    if (_util.isFunction(callback)){
        callback.call(this);
    }
};

