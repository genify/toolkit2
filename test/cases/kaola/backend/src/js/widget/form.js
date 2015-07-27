/*
 * ------------------------------------------
 * 项目通用表单控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/klass',
    'base/util',
    'base/event',
    'base/element',
    'util/event',
    'util/form/form',
    'util/selector/cascade',
    'ui/datepick/datepick'
],function(_k,_u,_v,_e,_t,_t0,_t1,_ut0,_p,_o,_f,_r,_pro){
    /**
     * 项目通用表单控件
     * 
     * @param    {Object}      config   - 配置参数
     * @property {Node|String} form     - 表单节点
     */
    _p._$$WebForm = _k._$klass();
    _pro = _p._$$WebForm._$extend(_t._$$EventTarget);
    /**
     * 重置控件
     * @param {Object} _options
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        var _form = _e._$get(_options.form);
        _form.onsubmit='return false;'
        _v._$addEvent(
            _form['submit'],'click',
            this.__onSubmit._$bind(this)
        );
        this.__doInitFormCtrl(_form,_options);
        this.__form = _t0._$$WebForm._$allocate({
            form:_form
        });
        this.__onSubmit();
    };
    /**
     * 控件销毁
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__form._$recycle();
        delete this.__form;
        if (!!this.__selector){
            this.__selector._$recycle();
            delete this.__selector;
        }
        this.__super();
    };
    /**
     * 初始化表单控件
     * @return {Void}
     */
    _pro.__doInitFormCtrl = function(_form,_options){
        // init datepick
        _u._$forEach(
            _e._$getByClassName(_form,'j-datepick'),
            function(_parent){
            	if(_parent.tagName=='INPUT'){
            		var _span = _e._$wrapInline(_parent);
            		_span.parentNode.style.zIndex = '9';
            		_v._$addEvent(_parent,'click',this.__onDatePickClick._$bind(this,_parent));
            	} 
            }._$bind(this)
        );
    };
    
    _pro.__onDatePickClick = function(_elm,_event){
		_v._$stop(_event);
		
		if(this.__datepick){
			this.__datepick = this.__datepick._$recycle();
		}
		this.__datepick = _ut0._$$DatePick._$allocate({
								parent:_elm.parentNode,
								clazz:'datepick',
								date:_elm.value,
								onchange:function(_date){
									_elm.value = _u._$format(_date,'yyyy-MM-dd');
								}
							})
	}
    /**
     * 提交查询
     * @param {Object} _event
     */
    _pro.__onSubmit = function(_event){
        _v._$stop(_event);
        this._$dispatchEvent(
            'onsubmit',this._$data()
        );
    };
    
    _pro._$checkValidity = function(){
    	return this.__form._$checkValidity();
    };
    /**
     * 重置表单
     * @return {Void}
     */
    _pro._$reset = function(){
        this.__form._$reset();
    };
    /**
     * 取表单数据
     * @return {Void}
     */
    _pro._$data = function(){
        var _data = this.__form._$data();
        _u._$forIn(
            _data,function(_value,_key,_map){
                if (_u._$isString(_value)){
                    _map[_key] = _value.trim();
                }
            }
        );
        return _data;
    };
    
    return _p;
});
