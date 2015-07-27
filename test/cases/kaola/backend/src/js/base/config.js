/*
 * --------------------------------------------
 * 全局配置参数
 * @version  1.0
 * @author   hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 * --------------------------------------------
 */
define([
    'base/global'], function() {

  var config = {};

  // 默认上传地址
  config.UPLOAD_URL = "/upload";
  config.URLPERFIX = "";
  // 默认上传参数
  config.UPLOAD_PARAM = {

  }

  if(DEBUG){
	  config.DOMAIN_URL = 'http://ms.haitao.com:8080/';
	  config.DOMAIN = 'ms.haitao.com';
  } else{
	  config.DOMAIN_URL = 'http://ms.haitao.com/';
	  config.DOMAIN = 'ms.haitao.com';
  }


  return config;


})