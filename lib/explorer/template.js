/*
 * Template Explorer, used to manage template list
 * @module   explorer/template
 * @author   genify(caijf@corp.netease.com)
 */
var _util = require('../util/util.js');
// resource type map
var RES_MAP = {
    txt:'text',
    ntp:'text',
    jst:'text',
    js:'script',
    css:'style',
    html:'template',
    'nej/css':'style',
    'nej/html':'template',
    'nej/javascript':'script'
};
// template explorer
var Template = module.exports =
    require('../util/klass.js').create();
var pro = Template.extend(require('./explorer.js'));
/**
 * parse resource item
 * @protected
 * @param  {Object} res - resource config
 * @return {Void}
 */
pro._parseResource = function(res){
    var type = RES_MAP[res.type];
    if (!!type){
        var Module = require('../meta/'+type+'.js'),
            config = _util.merge(this.getLogger(),res);
        return new Module(config);
    }
};
// dump complete dependency list
// resType          resource type for html, default is "script", eg. style/script
// ignoreEntry      ignore page entry script
// ['/path/to/a.js','/path/to/inline-xxxx']
pro.getDependencies = function(config){

};

