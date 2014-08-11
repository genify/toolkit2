/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   
 * ------------------------------------------
 */
NEJ.define([
    './#<PATCH_NAME>.js',
    '{lib}base/platform.js'
],function(_h,_m,_p,_o,_f,_r){
    // TR 2.0 - IE 6
    // TR 3.0 - IE 7
    // TR 4.0 - IE 8
    // TR 5.0 - IE 9
    // TR 6.0 - IE 10
    // TR 7.0 - IE 11
    
    // for ie9-
    NEJ.patch('TR<=5.0',function(){
        /**
         * 接口描述
         * @param  {String} 接口参数
         * @return {Void}
         */
        _h.__api = function(){
            // TODO
        };
        
        // 或者采用AOP形式扩展
        
        /**
         * 接口描述
         * @param  {String} 接口参数
         * @return {Void}
         */
        _h.__api = 
        _h.__api._$aop(function(_event){
            // TODO
            // _event.args    输入参数列表
            // _event.value   输出结果
            // _event.stopped 是否终止后续逻辑
        });
        
    });
    
    return _h;
});
