/*
 * CSS Content Parser Adapter
 * @module   adapter/style
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
    path = require('path'),
   _io   = require('../util/io.js'),
   _fs   = require('../util/file.js'),
   _path = require('../util/path.js');
// css parser
// file    - css file path
// content - css content
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
    this._file = config.file||'';
    this._source = config.content||'';
};
/**
 * parse file cotent
 * @param  {Object} config - parse config
 * @param  {String} config.webRoot  - web root path
 * @param  {String} config.resRoot  - resource root path
 * @param  {String} config.sptRoot  - image sprite root path
 * @param  {RegExp} config.resReg   - resource merge check regexp
 * @return {Void}
 */
pro.parse = function(config){
    // parse css content
    var css = require('css'),
        ast = css.parse(
            this._source,{
                silent:!0,
                source:this._file
            }
        ),
        err = ast.stylesheet.parsingErrors;
    // check parse error
    if (!!err&&err.length>0){
        err = err[0];
        delete err.source;
        this.emit('warn',{
            data:[err],
            message:'illegal style content %j'
        });
        this._source = this._completeResource(
            this._source,config
        );
        return;
    }
    // complete resouce path
    this._checkResource(
        ast.stylesheet.rules||[],config
    );
    this._source = css.stringify(ast,{
        indent:0,
        compress:!0,
        sourcemap:!1,
        inputSourcemaps:!1
    });
};
/**
 * stringify file content
 * @param  {Object} config - parse config
 * @return {String} file content
 */
pro.stringify = function(){
    return this._source;
};
/**
 * check resource in rules
 * @private
 * @param  {Array} rules - rules for css content
 * @param  {Object} config - config object
 * @param  {String} config.webRoot - web root path
 * @param  {String} config.resRoot - resource root path
 * @param  {String} config.sptRoot - sprite root path
 * @param  {RegExp} config.resReg  - resource merge check regexp
 * @return {Void}
 */
pro._checkResource = function(rules,config){
    var webRoot = config.webRoot,
        resRoot = config.resRoot,
        sptRoot = config.sptRoot;
    rules.forEach(function(rule){
        // for media query
        if (!!rule.rules){
            this._checkResource(
                rule.rules,config
            );
            return;
        }
        // for keyframes
        if (!!rule.keyframes){
            this._checkResource(
                rule.keyframes,config
            );
            return;
        }
        // for css selector
        (rule.declarations||[]).forEach(function(decl,index,list){
            if ((decl.value||'').indexOf('url(')>=0){
                decl.value = this._completeResource(
                    decl.value,config,{
                        name:decl.property,
                        index:index,
                        list:list
                    }
                );
            }
        },this);
    },this);
};
/**
 * check sprite size config
 *
 * @private
 * @param  {Array} list - declarations list
 * @return {Array} background size, e.g. [x,y]
 */
pro._checkSpriteSize = function(url,list){
    var ret,value;
    (list||[]).some(function(decl) {
        if (decl.property==='background-size'){
            value = decl.value;
            return !0;
        }
    });
    if (!!value){
        // only support percent background size
        // background-size: 50%;
        // background-size: 50% 100%;
        // background-size: 50% auto;
        // background-size: auto 50%;
        value = value.split(/\s+/);
        if (value[0]=='auto'){
            value[0] = value[1];
        }else if (value[1]=='auto'){
            value[1] = value[0];
        }
        value = value.join(' ');
        // parse result
        if (/^([\d]+?)\%$/.test(value)){
            // background-size: 50%;
            ret = [parseInt(RegExp.$1,10)/100];
            ret[1] = ret[0];
        }else if (/^([\d]+?)\%\s+([\d]+?)\%$/.test(value)){
            // background-size: 50% 100%;
            ret = [
                parseInt(RegExp.$1,10)/100,
                parseInt(RegExp.$2,10)/100
            ];
        }
        if (!ret){
            this.emit('warn',{
                data:[value,url],
                message:'not supported sprite background size %s for %s'
            });
        }
    }
    return ret||[1,1];
};
/**
 * wrapper sprite background
 *
 * @private
 * @param  {String} uri - file path
 * @param  {Object} options - sprite config
 * @return {String} wrapped file path
 */
pro._wrapSpriteResource = function(uri,options){
    var ret = options.ratio.join(',');
    this.emit('debug',{
        data:[uri,ret],
        message:'zoom for sprite resource %s is %s'
    });
    if (options.name.toLowerCase()==='background-image'){
        options.list.push({
            type:'declaration',
            property:'background-position',
            value:_path.wrapURI('sp',uri+'?position@'+ret)
        });
        return _path.wrapURI('sp',uri+'?image');
    }
    return _path.wrapURI('sp',uri+'?@'+ret);
};
/**
 * complete resource path
 * @private
 * @param  {String} str - css property string
 * @param  {Object} config - config object
 * @param  {String} config.webRoot - web root path
 * @param  {String} config.resRoot - resource root path
 * @param  {String} config.sptRoot - sprite root path
 * @param  {RegExp} config.resReg  - resource merge check regexp
 * @param  {Object} options - options object
 * @param  {Number} options.index - declaration index
 * @param  {Array}  options.list  - declaration list
 * @param  {String} options.name  - declaration property
 * @return {String} string after complete resource path
 */
pro._completeResource = function(str,config,options){
    var pathRoot = path.dirname(this._file)+'/',
        webRoot = config.webRoot,
        resRoot = config.resRoot,
        sptRoot = config.sptRoot,
        resReg  = config.resReg;
    var formatRatio = function(ratio){
        if (!ratio){
            return [1,1];
        }
        // for 50,20 or 30
        ratio = ratio.split(/\s*,\s*/);
        ratio.forEach(function(it,index,list){
            list[index] = (parseInt(it,10)/100)||1;
        });
        if (ratio.length<2){
            ratio[1] = ratio[0];
        }
        return ratio;
    };
    return str.replace(
        /url\((['"])?(.*?)(['"])?\)/gi,function($1,$2,$3,$4){
            var ret = util.format(
                'url(%s)',$3
            );
            // $2 - ' or "
            // $3 - /path/to/image.png
            // $4 - ' or "
            // for remote or data url
            if ($3.indexOf(':')>0){
                // fix bug https://github.com/genify/toolkit2/issues/2
                ret = util.format(
                    'url(%s%s%s)',
                    $2||'',$3,$4||''
                );
                return ret;
            }
            // for local file
            var arr = $3.split('?');
            arr[0] = _path.absoluteAltRoot(
                arr[0],pathRoot,webRoot
            );
            // check file exist
            if (!_fs.exist(arr[0])){
                this.emit('warn',{
                    data:[arr[0],this._file],
                    message:'resource %s in file %s not exist'
                });
                return ret;
            }
            // check resource merge
            if (!!resReg&&resReg.test(arr[0])){
                var dst = arr[0].replace(resReg,resRoot);
                // check resource exist
                if (_fs.exist(dst)){
                    this.emit('warn',{
                        data:[dst],
                        message:'merged resource %s has existed'
                    });
                }
                // copy resource to project
                _fs.copy(arr[0],dst,function(src,dst){
                    this.emit('debug',{
                        data:[src,dst],
                        message:'copy merged resource form %s to %s'
                    });
                }.bind(this));
                // adjust resource path
                arr[0] = dst;
            }
            // check sprite images with sprite root config
            if (!!sptRoot&&arr[0].indexOf(sptRoot)===0){
                _io.cacheSpriteWithRoot(arr[0],sptRoot);
                options.ratio = this._checkSpriteSize(
                    arr[0],options.list
                );
                return this._wrapSpriteResource(arr[0],options);
            }
            // check sprite images with query(start with sprite!) in url, e.g.
            // http://a.b.com/res/a/b.png?sprite!abc@50,100
            var name = arr[1]||'';
            if (name.indexOf('sprite!')===0){
                name = name.replace('sprite!','');
                name = name.split('@');
                _io.cacheSpriteFile(
                    name[0]||'sprite',arr[0]
                );
                options.ratio = formatRatio(name[1]);
                return this._wrapSpriteResource(arr[0],options);
            }
            var uri = arr.join('?');
            // warn if resource not in res root
            if (!resRoot||arr[0].indexOf(resRoot)<0){
                this.emit('warn',{
                    data:[uri,this._file],
                    message:'%s is not in DIR_STATIC[%s]'
                });
                //return ret;
            }
            // check resource in web root
            if (!webRoot||arr[0].indexOf(webRoot)<0){
                return ret;
            }
            // use path placeholder
            this.emit('debug',{
                data:[uri,this._file],
                message:'find resource %s in file %s'
            });
            return util.format(
                'url(%s)',
                _path.wrapURI('rs',uri)
            );
        }.bind(this)
    );
};