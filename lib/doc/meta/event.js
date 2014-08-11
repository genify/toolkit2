var _util = require('../util/util.js'),
    _pkg1 = require('./process.js');
/**
 * 类定义
 */
var _Class = function(){
    _pkg1.Process.call(this);
    this.tag = 'event';
};
_util.extend(_Class,_pkg1.Process);
// export class
exports.Event = _Class;