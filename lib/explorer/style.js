/*
 * Style Explorer, used to manage style list
 * @module   explorer/style
 * @author   genify(caijf@corp.netease.com)
 */
// style explorer
var Style = module.exports =
    require('../util/klass.js').create();
var pro = Style.extend(require('./explorer.js'));
/**
 * parse resource item
 * @protected
 * @param  {Object} res - resource config
 * @return {Void}
 */
this._parseResource = function(res){
    var Style = require('../meta/style.js');
    return new Style(res);
};