/*
 * CSS Background Sprite
 * @module   adapter/sprite
 * @author   genify(caijf@corp.netease.com)
 */
var  fs     = require('fs'),
     util   = require('util'),
     PNG    = require('pngjs').PNG,
     Layout = require('layout'),
    _io     = require('../util/io.js'),
    _util   = require('../util/util.js');
// default options
var DEFAULT = {
    layout : 'binary-tree',
    output : process.cwd()+'/',
    webRoot: ''
};
// sprite parser
// map     - file sprite map
// output  - sprite file output root
// webRoot - web root path
// layout  - sprite layout type (https://github.com/twolfson/layout)
var Parser = module.exports =
    require('../util/klass.js').create();
var pro = Parser.extend(require('../util/event.js'));
/**
 * class initialization
 * @param  {Object} config - config parameters
 * @return {Void}
 */
pro.init = function(config){
    this._super(config);
    // init config
    config = config||{};
    this._map = config.map||{};
    this._options = _util.fetch(
        DEFAULT,config
    );
    this._result = {_length:0};
    // prepare image dimension
    this.emit('info',{
        message:'prepare sprite images dimension'
    });
    this._map._length = 0;
    this._dimension = {
        _length:0
    };
    var callback = this._onDimensionLoad.bind(this);
    Object.keys(this._map).forEach(function(key){
        var list = this._map[key];
        if (!util.isArray(list)){
            return;
        }
        this._dimension[key] = [];
        this._map._length += list.length;
        list.forEach(function(it,index){
            fs.createReadStream(it).pipe(
                new PNG()
            ).on('parsed',function(){
                callback(key,index,{
                    width:this.width,
                    height:this.height,
                    meta:{file:it,inst:this}
                });
            });
        });
    },this);
};
/**
 * get image information in sprite
 * @param  {String} file - file path
 * @return {Object} image information
 */
pro.getImageInfo = function(file){
    return this._result[file];
};
/**
 * check dimension prepared
 * @private
 * @return {Void}
 */
pro._doCheckPrepared = function(){
    // all dimension prepared
    if (this._map._length===this._dimension._length){
        this.emit('info',{
            message:'layout sprite images'
        });
        Object.keys(this._dimension).forEach(function(key){
            var list = this._dimension[key];
            if (!util.isArray(list)){
                return;
            }
            // layout sprite
            var layout = Layout(
                this._options.layout
            );
            list.forEach(function(it){
                layout.addItem(it);
            });
            var ret = layout.export();
            this.emit('debug',{
                data:[key,JSON.stringify(ret,['width','height','x','y','items'])],
                message:'layout for sprite %s is %s'
            });
            this.emit('info',{
                data:[key],
                message:'generate sprite image %s'
            });
            // generate sprite image
            var image = new PNG({
                width:ret.width,
                height:ret.height
            });
            // fill sprite image
            ret.items.forEach(function(it){
                it.meta.inst.bitblt(
                    image,0,0,
                    it.width,it.height,it.x,it.y
                );
            });
            // output sprite file
            var version = _util.md5(image.data),
                file = this._options.output+key+'_'+version+'.png';
            // cache resource file version for manifest
            _io.resource(file.replace(this._options.webRoot,''),version);
            this.emit('info',{
                data:[file],
                message:'output sprite image to %s'
            });
            image.pack().pipe(fs.createWriteStream(file))
                 .on('finish',this._onSpriteOutput.bind(this,file,ret));
        },this);
    }
};
/**
 * on image dimension loaded
 * @private
 * @param  {String} key   - file key
 * @param  {Number} index - image index in list with key
 * @param  {Object} ret   - image dimension result
 * @return {Void}
 */
pro._onDimensionLoad = function(key,index,ret){
    this.emit('debug',{
        data:[ret.meta.file,ret.width,ret.height],
        message:'dimension for %s is [width=%s,height=%s]'
    });
    this._dimension[key][index] = ret;
    this._dimension._length++;
    this._doCheckPrepared();
};
/**
 * sprite file output
 * @private
 * @param  {String} file - sprite file path
 * @param  {Object} ret  - sprite information
 * @return {Void}
 */
pro._onSpriteOutput = function(file,ret){
    this._result._length += ret.items.length;
    ret.items.forEach(function(it){
        var key = it.meta.file;
        this._result[key] = {
            x:it.x,
            y:it.y,
            file:key,
            sprite:file,
            width:it.width,
            height:it.height
        };
    },this);
    if (this._result._length===this._map._length){
        this.emit('done',this._result);
    }
};