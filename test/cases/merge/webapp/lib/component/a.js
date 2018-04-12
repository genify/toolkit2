NEJ.define([
    'css!./a.css',
    'uri!./res/c.png'
],function (x, u) {
    console.log(x);
    console.log('inject uri -> '+u);
});