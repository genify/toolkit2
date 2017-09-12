/*
 * Text Resource Class
 * @module   meta/text
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
   _io   = require('../util/io.js'),
   _util = require('../util/util.js');
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
    this._sfx = '.txt';
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
    this._super(file,content,config);
    return content;
};
/**
 * serialize template content
 * @param  {Object} config - config object
 * @param  {String} config.resWrap - template wrapper
 * @return {String} template content
 */
pro.stringify = function(config){
    config = config||{};
    var content = _io.getFromCache(this._text)||'',
        reg = _util.wrap2reg(config.resWrap);
    if (!!reg){
        content = _util.fixContent(content).replace(
            reg,'<&#47;$1>'
        );
    }
    return util.format(
        config.resWrap,
        this._id,this._type,
        '\n'+content+'\n'
    );
};
