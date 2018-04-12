/**
 * nej text injector processor
 *
 * @param  {Object} event - event
 * @param  {String} event.file    - file path
 * @param  {String} event.content - file content
 * @return {String} content after process
 */
exports.text = function(event){
    return JSON.stringify(event.content);
};
/**
 * nej json injector processor
 *
 * @param  {Object} event - event
 * @param  {String} event.file    - file path
 * @param  {String} event.content - file content
 * @return {String} content after process
 */
exports.json = function(event){
    return event.content;
};
/**
 * nej css injector processor
 *
 * @param  {Object} event - event
 * @param  {String} event.file    - file path
 * @param  {String} event.content - file content
 * @return {String} content after process
 */
exports.css = function (event) {
    var CFGParser = require('../../parser/config.js');
    if (!CFGParser.inst){
        return JSON.stringify(event.content);
    }
    var parser = new (require('../../adapter/style'))({
        file: event.file,
        content: event.content
    });
    var config = CFGParser.inst.format({
        webRoot:'DIR_WEBROOT',
        resRoot:'DIR_STATIC',
        resReg:'DIR_STATIC_MERGE',
        sptRoot:'OPT_IMAGE_SPRITE'
    });
    parser.parse(config);
    return JSON.stringify(
        parser.stringify(config)
    );
};
/**
 * nej uri injector processor
 *
 * @param  {Object} event - event
 * @param  {String} event.file    - file path
 * @param  {String} event.content - file content
 * @return {String} content after process
 */
exports.res = function (event) {
    var file = event.file;
    var path = require('../../util/path.js');
    var ret = JSON.stringify(
        path.wrapURI('rs',file)
    );
    var CFGParser = require('../../parser/config.js');
    if (!CFGParser.inst){
        return ret;
    }
    // check resource merge
    var config = CFGParser.inst.format({
        resRoot:'DIR_STATIC',
        resReg:'DIR_STATIC_MERGE'
    });
    if (!config.resReg){
        return ret;
    }
    // merge resource
    if (config.resReg.test(file)){
        var dst = file.replace(
            config.resReg,
            config.resRoot
        );
        var _fs = require('../../util/file.js');
        // check resource exist
        // copy resource to project if not exist
        if (!_fs.exist(dst)){
            _fs.copy(file, dst);
        }
        // adjust resource path
        return JSON.stringify(
            path.wrapURI('rs',dst)
        );
    }
    return ret;
};