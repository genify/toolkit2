/*
 * exports toolkit
 * @author genify(caijf@corp.netease.com)
 */
var  fs   = require('fs'),
     exec = require('child_process').exec,
    _fs   = require('./util/file.js'),
    _util = require('./util/util.js'),
    _path = require('./util/path.js'),
    _logger = require('./util/logger.js').logger;
var FormData = require('form-data');
/**
 * dump files to temporary directory
 * @param  {Object} config - config object
 * @return {Void}
 */
var dumpFiles2Temp = function(config){
    _logger.info('begin dump files ...');
    var map = {};
    ['fileInclude','fileExclude'].forEach(function(name){
        var value = config[name];
        if (typeof value==='string'){
            var reg = new RegExp(value,'i');
            config[name] = function(file){
                return reg.test(file);
            };
        }else if(!!value&&!!value.test){
            config[name] = function(file){
                return value.test(file);
            }
        }
        if (!_util.isFunction(config[name])){
            var flag = name!=='fileExclude';
            config[name] = function(file){
                return flag;
            };
        }
    });
    (config.resRoot||'').split(',').forEach(function(dir){
        if (!dir){
            return;
        }
        var ret = _fs.lsfile(dir,function(name,file){
            return !config.fileExclude(file)&&
                config.fileInclude(file);
        });
        ret.forEach(function(v){
            map[v] = v.replace(config.webRoot,config.temp);
        });
    });
    _logger.debug('package file map -> %j',map);
    Object.keys(map).forEach(function(src){
        var dst = map[src];
        _fs.copy(src,dst,function(a,b){
            _logger.info('copy file %s to %s',a,b);
        });
    });
};
/**
 * zip files package
 * @param  {Object} config - config object
 * @return {Void}
 */
var zipPackage = function(config){
    _logger.info('begin zip package ...');
    var cmd = [
        'java','-jar',
        JSON.stringify(config.zip),
        JSON.stringify(config.temp),
        JSON.stringify(config.output)
    ].join(' ');
    _logger.debug('do command: %s',cmd);
    exec(cmd,function(error,stdout,stderr){
        if (error){
            _logger.error('zip package error for reason:\n%s',error.stack);
            process.abort();
            return;
        }
        if (stdout){
            _logger.info(stdout);
        }
        if (stderr){
            _logger.error(stderr);
        }
        uploadToServer(config);
    });
};
/**
 * upload package to web cache server
 * @param  {Object} config - config object
 * @return {Void}
 */
var uploadToServer = function(config){
    _logger.info('begin upload package to web cache server ...');
    var form = new FormData();
    form.append('token',config.token);
    form.append('appId',config.appid);
    form.append('nativeId',config.nativeId);
    form.append('domains',config.domains);
    form.append('zip',fs.createReadStream(config.output));
    form.submit(config.api,function(err,res){
        if (err){
            _logger.error('upload failed for reason:\n%s',err.stack);
            clearTemp(config);
            process.abort();
            return;
        }
        _logger.info('package upload success');
        clearTemp(config);
        config.ondone();
    });
};
/**
 * clear temporary infomation
 * @param  {Object} config - config object
 * @return {Void}
 */
var clearTemp = function(config){
    _logger.info('clear temporary directory and files');
    _fs.rmdir(config.temp);
    _fs.rm(config.output);
};
/**
 * run zip and upload
 * @param {Object} config - config object
 * @param {String} config.api - upload api url
 * @param {String} config.appid - web cache for app identify
 * @param {String} config.token - web cache upload api token
 * @param {String} config.domains - domains used in project
 * @param {String} config.webRoot - web root path
 * @param {String} config.resRoot - resource root path
 * @param {String} config.staticRoot - static file (css/js/html) root path
 * @param {String|RegExp|Function} config.fileInclude - file include match
 * @param {String|RegExp|Function} config.fileExclude - file exclude match
 * @return {Void}
 */
exports.run = function(config){
    var name = +new Date,
        root = config.root||(process.cwd()+'/');
    config.zip = _path.absolute(
        './3rd/zip.jar',
        __dirname+'/'
    );
    config.temp = _path.absolute(
        './'+name+'/',root
    );
    config.output = _path.absolute(
        './'+name+'.zip',root
    );
    dumpFiles2Temp(config);
    zipPackage(config);
};
