/*
 * nei utility api
 * @module   nei/util
 * @author   genify(caijf@corp.netease.com)
 */
var _fs   = require('../util/file.js'),
    _path = require('../util/path.js');
/**
 * find nei config file
 * @param  {String} path - path to find
 * @return {String} nei config file path
 */
exports.find = function(path){
    // /a/b/c -> ['a','b','c']
    var arr = path.split(/[\\/]/);
    // check nei config file
    while(arr.length>0){
        var file = arr.join('/')+'/nei.json';
        if (_fs.exist(file)){
            return _path.normalize(file);
        }
        arr.pop();
    }
    return null;
};