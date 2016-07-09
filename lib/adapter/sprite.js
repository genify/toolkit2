/*
 * CSS Background Sprite
 * @module   adapter/sprite
 * @author   genify(caijf@corp.netease.com)
 */
var  fs     = require('fs'),
     util   = require('util'),
     path   = require('path'),
     PNG    = require('pngjs').PNG,
     Layout = require('layout'),
    _io     = require('../util/io.js'),
    _fs     = require('../util/file.js'),
    _util   = require('../util/util.js'),
    _path   = require('../util/path.js');
// default options
var DEFAULT = {
    margin : '4,4',
    layout : 'binary-tree',
    prefix : '',
    output : process.cwd()+'/',
    webRoot: ''
};
// sprite parser
// map     - file sprite map
// output  - sprite file output root
// webRoot - web root path
// layout  - sprite layout type (https://github.com/twolfson/layout)
// margin  - margin between icons
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
    this._options.margin = this._formatMargin(
        this._options.margin
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
 * format margin string to array
 * @private
 * @param  {String} margin - margin between icons, e.g. '4,5'
 * @param  {Array}  margin array, e.g. [4,5]
 */
pro._formatMargin = function(margin){
    if (margin==null){
        margin = DEFAULT.margin;
    }
    var arr = (''+margin).split(',');
    arr.forEach(function(it,index,list){
        it = parseInt(it);
        if (isNaN(it)){
            it = 4;
        }
        list[index] = it;
    });
    if (arr[1]==null){
        arr[1] = arr[0];
    }
    return [arr[0],arr[1]];
};
/**
 * check dimension prepared
 * @private
 * @return {Void}
 */
pro._checkDimensions = function(){
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
            // remove noise
            for(var i=0,h=image.height;i<h;i++){
                for(var j=0,w=image.width,it,dt;j<w;j++){
                    dt = image.data;
                    it = (image.width*i+j)<<2;
                    dt[it] = 0;
                    dt[it+1] = 0;
                    dt[it+2] = 0;
                    dt[it+3] = 0;
                }
            }
            // fill sprite image
            var margin = this._options.margin;
            ret.items.forEach(function(it){
                it.meta.inst.bitblt(
                    image,0,0,
                    it.width-margin[0],
                    it.height-margin[1],
                    it.x,it.y
                );
            });
            // output sprite file
            var version = _util.md5(image.data),
                file = util.format(
                    '%s%s%s_%s.png',
                    this._options.output,
                    this._options.prefix,
                    key,version
                );
            // normalize file path
            file = _path.normalize(file);
            _fs.mkdir(path.dirname(file));
            // cache resource file version for manifest
            _io.resource(file.replace(this._options.webRoot,''),version);
            this.emit('info',{
                data:[file],
                message:'output sprite image to %s'
            });
            image.pack().pipe(fs.createWriteStream(file))
                 .on('finish',this._outputSpriteFile.bind(this,file,ret));
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
    var margin = this._options.margin;
    ret.width += margin[0];
    ret.height += margin[1];
    this._dimension[key][index] = ret;
    this._dimension._length++;
    this._checkDimensions();
};
/**
 * sprite file output
 * @private
 * @param  {String} file - sprite file path
 * @param  {Object} ret  - sprite information
 * @return {Void}
 */
pro._outputSpriteFile = function(file,ret){
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