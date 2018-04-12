NEJ.define([
    'css!./a.css',
    'res!./res/img/',
    'res!./res/c.png',
    'res!./res/img/b.png'
],function (x, u, y, z) {
    console.log(x);
    console.log('inject uri -> '+u);
    console.log('inject dir -> '+y);
    console.log('inject img -> '+z);
});