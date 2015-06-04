/*
 * Style Resource Class
 * @module   meta/style
 * @author   genify(caijf@corp.netease.com)
 */
var _css    = require('../adapter/style.js'),
    _util   = require('../util/util.js');
// style in html file
var Style = module.exports =
    require('../util/klass.js').create();
var pro = Style.extend(require('./resource.js'));
/**
 * parse file content with config
 * @protected
 * @param  {String} file    - file path
 * @param  {String} content - file content
 * @param  {Object} config  - config object
 * @return {String} file content after parse
 */
pro._parseContent = function(file,content,config){
    var opt = _util.merge(
            this.getLogger(),{
                file:file,
                content:content
            }
        );
    var parser = new _css.Parser(opt);
    parser.parse(config);
    return parser.stringify(config);
};