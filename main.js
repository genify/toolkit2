/*
 * exports toolkit
 * @author   genify(caijf@corp.netease.com)
 */
// klass exports map
var KLASS = {
    // base klass
    Event:'util/event',
    Logger:'util/logger#Logger',
    // nei builder
    NEI_Builder:'nei/builder',
    NEI_WebApp:'nei/webapp',
    // resource meta
    RES_Text:'meta/text',
    RES_Html:'meta/html',
    RES_Style:'meta/style',
    RES_Script:'meta/script',
    RES_Template:'meta/template',
    RES_Resource:'meta/resource',
    // resource explorer
    EXP_Html:'explorer/html',
    EXP_Style:'explorer/style',
    EXP_Script:'explorer/script',
    EXP_Template:'explorer/template',
    EXP_Explorer:'explorer/explorer',
    // resource adapter
    ADP_Style:'adapter/style',
    ADP_Script:'adapter/script',
    // resource parser
    PRS_Tag:'parser/tag#Parser',
    PRS_Html:'parser/html',
    PRS_Config:'parser/config',
    PRS_Tokenizer:'parser/token',
    // file parser
    FLP_Parser:'script/parser',
    FLP_NEJParser:'script/nej#Parser',
    FLP_NEJPatcher:'script/nej/patcher',
    // entry parser
    Deployer:'deploy',
    Exporter:'export'
};
// api exports map
var API = {
    io:'util/io',
    rg:'util/args',
    fs:'util/file',
    ps:'util/path',
    ut:'util/util',
    ks:'util/klass',
    dp:'util/dependency',
    lg:'util/logger#level,logger,log',
    tag:'parser/tag#stringify',
    nej:'script/nej/util'
};
// export klass or api
function global(map){
    Object.keys(map).forEach(function(key){
        var file = map[key],
            arr = file.split('#'),
            mdl = require('./lib/'+arr[0]+'.js');
        // for util/logger#Logger
        if (!!arr[1]){
            // for util/logger#level,logger
            var brr = arr[1].split(',');
            if (brr.length>1){
                var ret = {};
                brr.forEach(function(name){
                    ret[name] = mdl[name];
                });
                mdl = ret;
            }else{
                mdl = mdl[brr[0]];
            }
        }
        exports[key] = mdl;
    });
};
// export constructor
// export api
global(KLASS);
global(API);

// bin api
var _fs     = require('./lib/util/file.js'),
    _path   = require('./lib/util/path.js'),
    _util   = require('./lib/util/util.js'),
    _log    = require('./lib/util/logger.js'),
    _logger = _log.logger;
/**
 * init project deploy config
 * @param  {String} output - output path
 * @return {Void}
 */
exports.init = function(output){
    output = _path.absolute(
        output+'/',process.cwd()+'/'
    );
    var content = require('swig').renderFile(
        __dirname+'/template/release.conf',{
            comment:'#',
            DIR_WEBROOT:'../webapp/'
        }
    );
    _fs.write(output+'release.conf',content);
    _logger.info('output release.conf to %s',output);
};
/**
 * deploy project by config file
 * @param  {String}   file - config file path
 * @param  {Function} callback - deploy done callback
 * @return {Void}
 */
exports.build = function(file,callback){
    file = _path.absolute(
        file,process.cwd()+'/'
    );
    new (require('./lib/deploy.js'))({
        file:file,
        done:callback||function(){}
    });
};
/**
 * export script list
 * @param  {Array} list - script list
 * @param  {Object} config - config object
 * @return {Void}
 */
exports.export = function(list,config){
    var file = _path.absolute(
        './export.html',process.cwd()+'/'
    );
    var exporter = new (require('./lib/export.js'))({
        file:file,
        list:list
    });
    exporter.parse(config);
};
/**
 * build nei project
 * @param  {Object} config - config object
 * @param  {String} config.action    - builder action
 * @param  {String} config.id        - nei project id
 * @param  {String} config.project   - path to project root
 * @param  {String} config.template  - path to template output
 * @param  {String} config.overwrite - whether overwrite files existed
 * @param  {Function} callback - build finish callback
 * @return {Void}
 */
exports.nei = function(config,callback){
    var cwd = process.cwd()+'/',
        project = _path.absolute(
            config.project+'/',cwd
        ),
        action = config.action||'build';
    // check nei.json file
    var msg;
    if (_fs.exist(project+'nei.json')){
        if (action==='build'){
            msg = 'use "nei update" to update nei project';
        }
    }else{
        if (action==='update'){
            msg = 'use "nei build" to build nei project';
        }
    }
    if (!!msg){
        _logger.error(msg);
        process.exit(1);
        return;
    }
    // generator builder
    var bmap = {
            webapp:'./lib/nei/webapp.js'
        },
        name = bmap[config.template]||bmap.webapp;
    var Builder;
    try{
        Builder = require(name);
    }catch(ex){
        Builder = require(bmap.webapp);
    }
    // generator config
    var conf = config;
    if (action==='update'){
        conf = require(project+'nei.json');
        conf.overwrite = !!config.overwrite;
    }else{
        conf.updateTime = 0;
    }
    conf = _util.merge(conf,{
        proRoot:project,
        done:callback||function(){},
        debug:_log.log.bind(_log,'debug'),
        info:_log.log.bind(_log,'info'),
        warn:_log.log.bind(_log,'warn'),
        error:_log.log.bind(_log,'error')
    });
    // do build or update
    var builder = new Builder(conf),
        handler = builder[action];
    if (!!handler){
        handler.call(builder);
    }else{
        _logger.error('not supported action %s',action);
    }
};