/*
 * Style Explorer, used to manage style list
 * @module   explorer/style
 * @author   genify(caijf@corp.netease.com)
 */
var _util = require('../util/util.js');
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
pro._parseResource = function(res){
    return new (require('../meta/style.js'))(res);
};