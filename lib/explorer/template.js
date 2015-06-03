/*
 * Template Explorer, used to manage template list
 * @module   explorer/template
 * @author   genify(caijf@corp.netease.com)
 */
var _util = require('../util/util.js');
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
pro._parseResource = (function(){
    var _rMap = {
        txt:'text',
        ntp:'text',
        jst:'text',
        js:'script',
        css:'style',
        html:'html',
       'nej/css':'style',
       'nej/html':'html',
       'nej/javascript':'script'
    };
    return function(res){
        var type = _rMap[res.type];
        if (!!type){
            var Module = require('../meta/'+type+'.js'),
                config = _util.merge(this.getLogger(),res);
            return new Module(config);
        }
    };
})();