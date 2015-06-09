/*
 * CSS Content Parser Adapter
 * @module   adapter/style
 * @author   genify(caijf@corp.netease.com)
 */
var util = require('util'),
    path = require('path'),
   _fs   = require('../util/file.js'),
   _path = require('../util/path.js'),
   _util = require('../util/util.js');
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
        );
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
 * @return {Void}
 */
pro._checkResource = function(rules,config){
    var webRoot = config.webRoot;
    rules.forEach(function(rule){
        if (rule.type==='rule'){
            rule.declarations.forEach(function(decl){
                if (decl.property==='background'){
                    decl.value = this._completeResource(
                        decl.value,webRoot
                    );
                }
            },this);
        }
    },this);
};
/**
 * complete resource path
 * @private
 * @param  {String} str - css property string
 * @param  {String} webRoot - web root path
 * @return {String} string after complete resource path
 */
pro._completeResource = function(str,webRoot){
    var pathRoot = path.dirname(this._file)+'/';
    return str.replace(
        /url\((['"])?(.*?)(['"])?\)/i,function($1,$2,$3,$4){
            // $2 - ' or "
            // $3 - /path/to/image.png
            // $4 - ' or "
            // for remote or data url
            if ($3.indexOf(':')>0){
                return util.format(
                    'url(%s)',$3
                );
            }
            // for local file
            var arr = $3.split('?');
            arr[0] = _path.absoluteAltRoot(
                arr[0],pathRoot,webRoot
            );
            if (!_fs.exist(arr[0])){
                this.emit('warn',{
                    data:[arr[0],this._file],
                    message:'resource %s in file %s not exist'
                });
            }
            return util.format('url(%s)',_util.wrapURI(arr.join('?')));
        }.bind(this)
    );
};