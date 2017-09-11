/*
 * Style Resource Class
 * @module   meta/style
 * @author   genify(caijf@corp.netease.com)
 */
var _util   = require('../util/util.js');
// style in html file
var Style = module.exports =
    require('../util/klass.js').create();
var pro = Style.extend(require('./resource.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    // init config
    this._sfx = '.css';
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
    var parser = new (require('../adapter/style.js'))(
        _util.merge(config,{
            file:file,
            content:content
        })
    );
    parser.parse(config);
    return parser.stringify(config);
};