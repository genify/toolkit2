var ut = require('../../lib/util/util.js'),
    fs = require('../../lib/util/file.js');

console.log(ut.md5(fs.raw(__dirname+'/1.png')))
console.log(ut.md5(fs.raw(__dirname+'/2.png')))

console.log(ut.md5(fs.read(__dirname+'/1.js').join('\n')))
console.log(ut.md5(fs.read(__dirname+'/2.js').join('\n')))