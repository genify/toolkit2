/*
 * Text Resource Class
 * @module   meta/text
 * @author   genify(caijf@corp.netease.com)
 */
// text in html template
// id       template id
// type     template type
var Text = module.exports =
    require('../util/klass.js').create();
var pro = Text.extend(require('./resource.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    // init config
    config = config||{};
    this._id = config.id;
    this._type = config.type;
};
/**
 * parse file content with config
 * @protected
 * @param  {String} file    - file path
 * @param  {String} content - file content
 * @param  {Object} config  - config object
 * @return {String} file content after parse
 */
pro._parseContent = function(file,content,config){
    return content;
};