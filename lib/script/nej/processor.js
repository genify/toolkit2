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
