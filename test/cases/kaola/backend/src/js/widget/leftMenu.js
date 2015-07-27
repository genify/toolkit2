/**
 * Created by zmm on 15/11/14.
 */
NEJ.define([
    'base/element',
    'base/klass', 
    'base/event',
    'base/util',
    'util/event'
], function(_e, _k,_v, _u,_t,_p, _o, _f, _r,_pro) {
	/**
	 * 模块内容管理对象
	 * @constructor
	 * @class   模块内容管理对象
	 * @extends #<N.ut>._$$Event
	 * @param   {jp.w._$$Module} _module 模块实例
	 * @param   {Object}         _data   模块配置对象
	 */
	var LeftMenu = _k._$klass();
	_pro = LeftMenu._$extend(_t._$$EventTarget);
	/**
	 * 初始化函数
	 * @param   {nb.w._$$Module} _module 模块实例
	 * @param   {Object}         _data   模块配置对象
	 * @return  {Void}
	 */
	_pro.__init = function(_options){
		this.__super(_options);
		var _leftMenu = _e._$get('J-sidebar');
	    if (!!_leftMenu) {
	        var _navList = _e._$getChildren(_leftMenu);
	        _u._$forEach(_navList, function (_element) {
	            var _headEle = _e._$getByClassName(_element, 'nav-header')[0];
	            _v._$addEvent(_headEle, 'click', this.__onMenuClick._$bind(this,_element));
	        }._$bind(this));
	    };
	};
	
	_pro.__onMenuClick = function(_element){
        if(_e._$hasClassName(_element, 'js-active')) {
            _e._$delClassName(_element, 'js-active');
        } else {
            _e._$addClassName(_element, 'js-active');
        }
    }
    
    return LeftMenu;
   
});