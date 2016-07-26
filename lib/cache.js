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
        if (!!value){
            if (typeof value==='string'){
                var reg = new RegExp(value,'i');
                config[name] = function(file){
                    return reg.test(file);
                };
            }else if(!!value.test){
                config[name] = function(file){
                    return value.test(file);
                }
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
        _fs.copy(src,dst,function(a){
            _logger.info('copy file %s',a);
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
    if (!_fs.exist(config.output)){
        return abortProcess(
            config,'no package to be uploaded'
        );
    }
    _logger.info('begin build upload form ...');
    var form = new FormData();
    var ex = {
        version: '0.1',
        platform: 'ios&android'
    };
    Object.assign(ex,config.extension);
    // build form
    Object.keys(ex).forEach(function(name){
        form.append(name,ex[name]);
    });
    form.append('token',config.token);
    form.append('resID',config.appid);
    form.append('appID',config.nativeId);
    form.append('userData',JSON.stringify({domains:config.domains}));
    form.append('zip',fs.createReadStream(config.output));
    // submit form
    _logger.info('begin upload package to web cache server ...');
    form.submit(config.api,function(err,res){
        if (err){
            return abortProcess(
                config,'upload failed for reason:\n%s',err.stack
            );
        }
        // chunk response data
        var arr = [];
        res.on('data',function(chunk){
            arr.push(chunk);
        });
        // parse response result
        res.on('end',function(){
            var ret = null,
                txt = arr.join('');
            try{
                ret = JSON.parse(txt);
            }catch(ex){
                // result error
                return abortProcess(
                    config,'[%s] %s\n%s',
                    res.statusCode,txt,ex.stack
                );
            }
            if (!!ret&&ret.code==0){
                clearTemp(config);
                _logger.info('package upload success');
                config.ondone();
            }else{
                return abortProcess(
                    config,'package upload failed for reason: [%s] %s',
                    res.statusCode,txt
                );
            }
        });
        res.resume();
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
 * abort process when error
 * @param  {Object} config - config object
 * @return {Void}
 */
var abortProcess = function(config){
    var args = [].slice.call(arguments,0);
    clearTemp(args.shift());
    _logger.error.apply(_logger,args);
    process.abort();
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
