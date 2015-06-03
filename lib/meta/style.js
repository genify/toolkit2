/*
 * Style Resource Class
 * @module   meta/style
 * @author   genify(caijf@corp.netease.com)
 */
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
    var StyleAdapter = require('../adapter/css.js'),
        opt = require('../util/util.js').merge(
            this.getLogger(),{
                file:file,
                content:content
            }
        );
    var parser = new StyleAdapter(opt);
    return parser.stringify(config);
};