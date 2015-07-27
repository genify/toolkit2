/*
 * --------------------------------------------
 * 项目内工具函数集合，此页面尽量写注释
 * @version  1.0
 * @author   yuqijun(yuqijun@corp.netease.com)
 * --------------------------------------------
 */
define([
    '{pro}components/progress/progress.js',
    'util/ajax/rest',
    'util/ajax/xdr',
    'base/util'
    ], function( progress , rest, xdr,_ut) {


  /**
   * 平台request, 避免后续需要统一处理
   * opt:  其他参数如 $request
   *   - progress:  是否使用进度条提示(假)
   *   - norest:  是否 不使用REST接口
   */
  var noop = function(){};
  var request = function(url, opt){
    opt = opt || {};
    var olderror = typeof opt.onerror === "function" ? opt.onerror : noop,
      oldload = typeof opt.onload === "function"? opt.onload : noop;

    if(opt.progress){
      progress.start();
    }
    opt.onload = function(json){
      if(json && json.code){
        progress.end();
        oldload.apply(this, arguments);
      }else{
        progress.end(true)
        olderror.apply(this, arguments);
      }
    }
    opt.onerror = function(json){
      progress.end(true)
      olderror.apply(this, arguments);
    }
    if(!opt.method||opt.method.toLowerCase()=='get'){
    	if(!opt.data){
    		opt.data = {};
    	}
    	opt.data.t= +new Date();
    }
    if(opt.norest){
    	if(opt.method&&opt.method.toLowerCase()=='post'&&!_ut._$isString(opt.data)){
    		opt.data = _ut._$object2query(opt.data);
    	}
      xdr._$request(url, opt)
    }else{
      rest._$request(url, opt)
    }
  }
  return request;
})