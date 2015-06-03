/*
 * Script Explorer, used to manage script list
 * @module   explorer/script
 * @author   genify(caijf@corp.netease.com)
 */
var _util = require('../util/util.js');
// script explorer
var Script = module.exports =
    require('../util/klass.js').create();
var pro = Script.extend(require('./explorer.js'));
/**
 * parse resource item
 * @protected
 * @param  {Object} res - resource config
 * @return {Void}
 */
pro._parseResource = function(res){
    var Script = require('../meta/script.js'),
        config = _util.merge(this.getLogger(),res);
    return new Script(config);
};