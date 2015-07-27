/*
 * module没有继承自_$$Event对象，因此module对象里不支持绑定自定义事件以及触发
 * 通过_p._$$MModule添加的方法,子类可以在当前方法对象里找到
 * 通过__proMModule添加的方法,子类可以在prototype里找到
 */
NEJ.define(['util/event',
            'base/klass', 
            'util/event',
            './BaseComponent.js',
            'pro/base/extend',
            'pro/widget/leftMenu'],
function(_v,_k,_t,BaseComponent,_ext,LeftMenu,_p, _o, _f, _r,_pro){
	var _p = NEJ.P('haitao.bw');  // class prototype
	
	// interface
	/**
	 * 模块内容管理对象
	 * @constructor
	 * @class   模块内容管理对象
	 * @extends #<N.ut>._$$Event
	 * @param   {jp.w._$$Module} _module 模块实例
	 * @param   {Object}         _data   模块配置对象
	 */
	_p._$$MModule = _k._$klass();
	_pro = _p._$$MModule._$extend(_t._$$EventTarget);
	/**
	 * 初始化函数
	 * @param   {nb.w._$$Module} _module 模块实例
	 * @param   {Object}         _data   模块配置对象
	 * @return  {Void}
	 */
	_pro.__init = function(_options){
		this.__super(_options);
		this.__config = window._config||{};
		LeftMenu._$allocate();
	};
	/**
     * 控件重置
     * @param  {Object} 配置参数
     * @return {Void}
     */
	_pro.__reset = function(_options) {
        this.__super(_options);
        if (!_options.noboot) {
            this.__hub = BaseComponent.boot(_options);
        }
    };
    
    return _p;
});