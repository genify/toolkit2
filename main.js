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
    lg:'util/logger#level,logger',
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
var _fs   = require('./util/fs.js'),
    _path = require('./util/path.js');
/**
 * init project deploy config
 * @param  {String} output - output directory
 * @return {Void}
 */
exports.init = function(output){
    output = _path.absolute(
        output+'/',process.cwd()+'/'
    );
    _fs.copy(
        __dirname+'/template/release.conf',
        output+'release.conf'
    );
    console.log('init release.conf to %srelease.conf',output);
};
/**
 * deploy project by config file
 * @param  {String} file - config file path
 * @param  {Function} callback - deploy done callback
 * @return {Void}
 */
exports.build = function(file,callback){
    file = _path.absolute(
        file,process.cwd()+'/'
    );
    new (require('./deploy.js'))({
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

};
