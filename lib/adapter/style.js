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
        // for css selector
        (rule.declarations||[]).forEach(function(decl){
            if ((decl.value||'').indexOf('url(')>=0){
                decl.value = this._completeResource(
                    decl.value,config
                );
            }
        },this);
    },this);
};
/**
 * complete resource path
 * @private
 * @param  {String} str - css property string
 * @param  {Object} config - config object
 * @param  {String} config.webRoot - web root path
 * @param  {String} config.resRoot - resource root path
 * @param  {String} config.sptRoot - sprite root path
 * @return {String} string after complete resource path
 */
pro._completeResource = function(str,config){
    var pathRoot = path.dirname(this._file)+'/',
        webRoot = config.webRoot,
        resRoot = config.resRoot,
        sptRoot = config.sptRoot;
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
            // check sprite images with sprite root config
            if (!!sptRoot&&arr[0].indexOf(sptRoot)===0){
                _io.cacheSpriteWithRoot(arr[0],sptRoot);
                return _path.wrapURI('sp',arr[0]);
            }
            // check sprite images with query(start with sprite!) in url, e.g.
            // http://a.b.com/res/a/b.png?sprite!abc
            var name = arr[1]||'';
            if (name.indexOf('sprite!')===0){
                name = name.replace('sprite!','')||'sprite';
                _io.cacheSpriteFile(name,arr[0]);
                return _path.wrapURI('sp',arr[0]);
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