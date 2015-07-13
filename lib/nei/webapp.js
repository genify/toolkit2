/*
 * WebApp Builder
 * @module   nei/webapp
 * @author   genify(caijf@corp.netease.com)
 */
var tpl   = require('swig'),
    path  = require('path'),
    _io   = require('../util/io.js'),
    _fs   = require('../util/file.js'),
    _path = require('../util/path.js');
// webapp project builder
// webRoot  - absolute path of web root
// viewRoot - absolute path of server view template
var WebApp = module.exports
    = require('../util/klass.js').create();
var pro = WebApp.extend('./builder.js');
/**
 * filter config field from input
 * @param  {Object} config - config data
 * @return {Object} result will be save to config file
 */
pro.config = function(config){
    return {
        webRoot:config.webRoot,
        viewRoot:config.viewRoot
    };
};
/**
 * init template
 * @return {Void}
 */
pro.template = function(){
    this._parseTemplate(__dirname+'/webapp/deploy/');
    this._parseTemplate(__dirname+'/webapp/views/');
};
/**
 * format mock file name
 * @private
 * @param   {String} file - file path
 * @return {String}  file path after format
 */
pro._path2mock = function(file){
    // ./path/to/file.ftl -> path/to/file.ftl
    // path/to/file.ftl -> path_to_file.ftl
    return (file||'').replace(/^\.*\//,'').replace(/[\\\/]+/g,'_');
};
/**
 * build deploy config
 * @private
 * @param  {Object} config - config object
 * @param  {Object} options - build options
 * @return {Void}
 */
pro._buildDeploy = function(config,options){
    // build deploy
    var file = _path.absolute(
        './deploy/release.conf',
        config.proRoot
    );
    // check file exist
    if (_fs.exist(file)&&!options.overwrite){
        return;
    }
    // output deploy config
    var content = this._mergeTemplate(
        __dirname+'/webapp/deploy/release.conf',{
            DIR_WEBROOT:_path.normalize(
                path.relative(file,config.webRoot)
            ),
            DIR_SOURCE_TP:_path.normalize(
                path.relative(config.webRoot,config.viewRoot)
            ),
            DIR_OUTPUT_TP:_path.normalize(
                path.relative(
                    config.webRoot,
                    path.dirname(config.viewRoot)+'/views.out/'
                )
            )
        }
    );
    this._output(file,content);
};
/**
 * build web app
 * @private
 * @param  {Object} config - config object
 * @param  {Object} options - build options
 * @param  {Object} data - nei config data
 * @return {Void}
 */
pro._buildTemplates = function(config,options,data){
    // build wrap
    _fs.cpdir(
        __dirname+'/webapp/views/wrap/',
        config.viewRoot+'/wrap/'
    );
    // build page
    var mocks = {},
        web = config.webRoot,
        root = config.viewRoot,
        template = tpl.compileFile(
            __dirname+'/webapp/views/page/index.ftl'
        );
    (data.templates||[]).forEach(function(item){
        // generator mock data
        var name = this._path2mock(item.path),
            key = root+'/mock/'+name;
        mocks[key] = this._getMockData(item.params||[]);
        // check overwrite
        var file = _path.normalize(
            root+'/'+item.path
        );
        if (_fs.exist(file)&&!options.overwrite){
            return;
        }
        // output view template
        var filename = path.basename(
            item.path,path.extname(item.path)
        );
        var content = template({
            mock:name,
            title:item.name,
            filename:filename
        });
        this._output(file,content);
        // output style and script

    },this);
    // build mock data
    var template = tpl.compileFile(
        __dirname+'/webapp/views/mock/data.ftl'
    );
    Object.keys(mocks).forEach(function(file){
        var content = template({
            mocks:mocks[file]
        });
        this._output(file,content);
    },this);
};
/**
 * build web app
 * @private
 * @param  {Object} config - config object
 * @param  {Object} options - build options
 * @param  {Object} data - nei config data
 * @return {Void}
 */
pro._buildWebApp = function(config,options,data){

};
/**
 * build project
 * @param  {Object}  config - config object, parameters return from this.config api
 * @param  {Number}  config.id - project id
 * @param  {String}  config.webRoot - absolute path of web root
 * @param  {String}  config.viewRoot - absolute path of server template root
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
    this._buildDeploy(config,options);
    this._buildWebApp(config,options,data);
    this._buildTemplates(config,options,data);
    // check build finish
    _io.ondone(function(){

    });
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

};