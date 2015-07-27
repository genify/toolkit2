/**
 * 重载nej.u里的方法 / 添加公用的自定义方法
 */
NEJ.define(['util/event', 
            'util/ajax/dwr'],
function(_v,_j){
	var _j = NEJ.P('nej.j'),
		_g = NEJ.P('haitao.g');
	var Request;
	
	_j._$haitaoDWR = function(_beanName, _funcName, _param, _callback, _err) {
		if(!_beanName || !_funcName) {
			alert('没有定义方法名');
			return;
		}

		var _dwrstirng = _beanName + '.' + _funcName;
		nej.j._$requestByDWR(_dwrstirng,{
			path:'/backend/dwr/call/plaincall/',
		    script:false,
		    param:_param,
		    onload:_callback,
		    onerror:_err || function(_errtext){
                if(_errtext.javaClassName === "com.netease.haitao.backend.web.filter.DwrAuthFailException") {
                    alert('没有权限');
                } else {
					if(_errtext.message) {
						alert(_errtext.message);
					} else {
						alert(_errtext.javaClassName);
					}
                }
            }
		});
	};
	
	//下面开始是给ftl使用的公用方法（为了避免混淆打包后的名称变化）
	_g.hidelist = function(_elem) {
		if(!_elem) 	return;
		var _list = nej.e._$getSibling(_elem);
		_list.style.display = (_list.style.display === 'none')?'':'none';
	};
	return Request;
});