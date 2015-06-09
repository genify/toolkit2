/*
 * Text Resource Class
 * @module   meta/text
 * @author   genify(caijf@corp.netease.com)
 */
var util    = require('util'),
   _io      = require('../util/io.js');
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
/**
 * serialize template content
 * @return {String} template content
 */
pro.stringify = function(){
    var content = _io.getFromCache(this._text)||'';
    return util.format(
        '<textarea name="%s" id="%s">%s</textarea>',
        this._type,this._id,content.replace(
            /<\/(textarea)>/gi,'<&#47;$1>'
        )
    );
};
