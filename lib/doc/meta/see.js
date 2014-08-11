var _util = require('../util/util.js'),
    _pkg1 = require('./item.js');
/**
 * 类定义
 */
var _Class = function(){
    _pkg1.Item.call(this);
    this.tag = 'see';
};
_util.extend(_Class,_pkg1.Item);

exports.See = _Class;