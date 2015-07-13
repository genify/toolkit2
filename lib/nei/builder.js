/*
 * Abstract NEI Builder
 * @module   nei/builder
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
    swig = require('swig'),
   _io   = require('../util/io.js'),
   _fs   = require('../util/file.js'),
   _path = require('../util/path.js'),
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
    // init template
    this.template();
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
 * parse template under dir
 * @protected
 * @param  {String} dir - template directory
 * @return {Void}
 */
pro._parseTemplate = function(dir){
    // init template cache
    if (!this._templates){
        this._templates = {};
    }
    // dump template
    _fs.lsfile(dir,
        function(name,file){
            this.emit('debug',{
                data:[file],
                message:'complie template %s'
            });
            this._templates[file] = swig.compileFile(file);
        }
        .bind(this)
    );
};
/**
 * merge template with data
 * @protected
 * @param  {String} file - key of template
 * @param  {Object} data - template data
 * @return {String} content after merge data
 */
pro._mergeTemplate = function(file,data){
    file = _path.normalize(file);
    var func = (this._templates||{})[file];
    if (!!func){
        return func(data||{});
    }
    return '';
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
 *
 * @private
 */
pro._mock = function(){

};
/**
 * output file content
 * @protected
 * @param  {String} file - file path
 * @param  {String} content - file content
 * @return {Void}
 */
pro._output = function(file,content){
    _io.output(file,content);
    this.emit('info',{
        data:[file],
        message:'output %s'
    });
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
 * init template
 * @return {Void}
 */
pro.template = function(){
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
 * @param  {Array}   data.pages - page object list, eg. [{id,path,params,updateTime}]
 * @param  {Array}   data.templates - template object list, eg. [{id,path,params,updateTime}]
 * @param  {Array}   data.interfaces - interface object list, eg. [{id,path,method,isRest,input,output}]
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
 * @param  {Array}   data.pages - page object list, eg. [{id,path,params,updateTime}]
 * @param  {Array}   data.templates - template object list, eg. [{id,path,params,updateTime}]
 * @param  {Array}   data.interfaces - interface object list, eg. [{id,path,method,isRest,input,output}]
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

