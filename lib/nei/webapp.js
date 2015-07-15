/*
 * WebApp Builder
 * @module   nei/webapp
 * @author   genify(caijf@corp.netease.com)
 */
var path  = require('path'),
    util  = require('util'),
   _io    = require('../util/io.js'),
   _fs    = require('../util/file.js'),
   _path  = require('../util/path.js'),
   _util  = require('../util/util.js');
// webapp project builder
// webRoot  - path of web root relative to project root
// viewRoot - path of server view template relative to project root
var WebApp = module.exports
    = require('../util/klass.js').create();
var pro = WebApp.extend(require('./builder.js'));
/**
 * filter config field from input
 * @param  {Object} config - config data
 * @return {Object} result will be save to config file
 */
pro.config = function(config){
    return {
        webRoot:_path.absolute(
            config.webRoot,config.proRoot
        ),
        viewRoot:_path.absolute(
            config.viewRoot,config.proRoot
        )
    };
};
/**
 * init template
 * @return {Void}
 */
pro.template = function(){
    this._parseTemplate(__dirname+'/webapp/template/');
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
    if (_fs.exist(file)&&
        !options.overwrite){
        return;
    }
    // output deploy config
    var content = this._mergeTemplate(
        __dirname+'/webapp/template/release.conf',{
            DIR_WEBROOT:_path.normalize(
                path.relative(path.dirname(file),config.webRoot)+'/'
            ),
            DIR_SOURCE_TP:_path.normalize(
                path.relative(config.webRoot,config.viewRoot)+'/'
            ),
            DIR_OUTPUT_TP:_path.normalize(
                path.relative(
                    config.webRoot,
                    path.dirname(config.viewRoot)+'/views.out/'
                )+'/'
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
    // build page template
    var list = data.templates||[];
    list.forEach(function(it){
        var file = _path.absoluteAltRoot(
            it.path,config.viewRoot,config.viewRoot
        );
        // generate mock file name
        var mock = '',
            params = it.parameters||[];
        if (params.length>0){
            mock = file.replace(config.viewRoot,'')
                .replace(/^\.*\//,'').replace(/[\\\/]+/g,'_');
        }
        // generate file name
        var filename = file.replace(config.viewRoot+'page/','');
        if (filename===file){
            filename = file.replace(config.viewRoot,'');
        }
        filename = filename.replace(/\/+/g,'_').replace(/\.[^\/]*?$/,'');
        // generate template file content
        var content = this._mergeTemplate(
            __dirname+'/webapp/template/page.ftl',{
                mock:mock,
                filename:filename,
                title:it.name||'页面标题',
                description:it.description||'页面描述'
            }
        );
        this._output(file,content);
        // build mock data
        if (!!mock){
            // generate mock parameters
            var arr = [];
            params.forEach(function(it){
                var dat = this._mock(it.type,it.isArray==1);
                arr.push({
                    name:it.name,
                    type:it.typeName,
                    array:it.isArray==1,
                    value:JSON.stringify(dat,null,4),
                    description:it.description||'测试数据'
                });
            },this);
            this.emit('debug',{
                data:[arr],
                message:'mock data -> %j'
            });
            // output mock data
            var file = util.format(
                '%smock/%s',config.viewRoot,mock
            );
            var content = this._mergeTemplate(
                __dirname+'/webapp/template/mock.ftl',{
                    mocks:arr
                }
            );
            this._output(file,content.trim().replace(/[\r\n]+/g,'\n'));
        }
        // build page style
        var file = util.format(
            '%ssrc/css/page/%s.css',
            config.webRoot,filename
        );
        this._output(file,'');
        // build page script
        var file = util.format(
            '%ssrc/javascript/page/%s.js',
            config.webRoot,filename
        );
        var content = this._mergeTemplate(
            __dirname+'/webapp/template/page.js',{
                // TODO
            }
        );
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
    // build web app structure
    _fs.cpdir(
        __dirname+'/webapp/webroot/',
        config.webRoot
    );
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
    _io.ondone(
        function(){
            // update relative path
            var config = this._config;
            config.webRoot = config.webRoot.replace(
                config.proRoot,'./'
            );
            config.viewRoot = config.viewRoot.replace(
                config.proRoot,'./'
            );
            // output config
            this._finishBuild();
            this.emit('info',{
                message:'build success'
            });
            this.emit('done');
        }
        .bind(this)
    );
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