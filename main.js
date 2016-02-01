/*
 * exports toolkit
 * @author   genify(caijf@corp.netease.com)
 */
// klass exports map
var KLASS = {
    // base klass
    Event:'util/event',
    Logger:'util/logger#Logger',
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
 * @param  {Object}   config - config options
 * @param  {Function} callback - deploy done callback
 * @return {Void}
 */
exports.build = function(file,config,callback){
    file = _path.absolute(
        file,process.cwd()+'/'
    );
    var opt = _util.merge(config,{
        file:file,
        done:callback||function(){}
    });
    new (require('./lib/deploy.js'))(opt);
};
/**
 * export script list
 * @param  {Array}    list     - script list
 * @param  {Object}   config   - config object
 * @param  {String}   config.output - output file path
 * @param  {String}   config.bags   - output name bags
 * @param  {Function} callback - export callback
 * @return {Void}
 */
exports.export = function(list,config,callback){
    // check list
    callback = callback||function(){};
    if (!list||!list.length){
        _logger.warn('no input script files');
        callback();
        return;
    }
    // absolute output
    config = config||{};
    var cwd = process.cwd()+'/';
    config.output = _path.absolutePath(
        config.output||'./output.js',cwd
    );
    // absolute name bags
    if (!!config.bags){
        config.bags = _path.absolutePath(
            config.bags,cwd
        );
    }
    // do export
    new (require('./lib/export.js'))(
        _util.merge(config,{
            file:_path.absolutePath(
                './script.html',cwd
            ),
            list:list,
            done:callback||function(){}
        })
    );
};
