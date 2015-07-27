NEJ.define(['{lib}util/list/module.pager.js', '{lib}ui/pager/pager.js', '{lib}util/page/page.js'], 
function(){
	var _p = NEJ.P('haitao.bw'),
		_pro,
		_propg,
		_prop;
	
	_p._$$NoNumList = NEJ.C();
	_pro = _p._$$NoNumList._$extend(nej.ut._$$ListModulePG);
	
    _pro.__doSyncPager = function(_index,_total){
        if (!!this.__pager){
            // limit page total
            if ((this.__popt||_o).limit>0){
                _total = Math.min(
                    _total,this.__popt.limit
                );
            }
            // check pager index and total
            var _index2 = this.__pager._$getIndex(),
                _total2 = this.__pager._$getTotal();
//            if (_index2>_total||_total!=_total2){
//                this.__pager._$recycle();
//                delete this.__pager;
//                this.__doChangePage({
//                    last:_index2,
//                    index:Math.min(_index,_total)
//                });
//                return !0;
//            }
        }else{
            // check pager instance
            this.__popt.index = _index;
            this.__popt.total = _total;
            this.__pager = this.__pkls._$allocate(this.__popt);
            this.__pager._$setEvent('onchange',this.__doChangePage._$bind(this));
            nej.u._$forEach(
                this.__pbid,function(_parent){
                    this.__pager._$bind(_parent);
                },this
            );
        }
    };
    /**
     * 切换分页器的显示状态
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__doSwitchPagerShow
     * @return {Void}
     */
    _pro.__doSwitchPagerShow = function(_display){
        if (!!this.__popt.fixed) return;
        nej.e._$setStyle(this.__popt.parent,'display','');
        this._$dispatchEvent('onafterpagershow');
    };
    
	_p._$$NoNumPager = NEJ.C();
	_propg = _p._$$NoNumPager._$extend(nej.ui._$$Pager);
	
	_propg.__reset = function(_options){
        _options.number = parseInt(_options.number)||9;
        nej.ui._$$Pager._$supro.__reset.call(this, _options);
        
        this.__page = _p._$$Page._$allocate(this.__popt);
    };
    
    _propg.__initXGui = (function(){
    	var _seed_css = nej.e._$pushCSSText('.#<uispace>{margin-top:6px; font-size:14px;}\
	    			.#<uispace> a{margin:0 2px;padding:2px 8px;margin-left:20px;color:#333;border:1px solid #aaa;text-decoration:none;}\
	    			.#<uispace> .js-disabled{cursor:default;}\
	    			.#<uispace> .js-selected{cursor:default;background-color:#bbb;}');
    	return function(){
    		this.__seed_css = _seed_css;
    	}
    })();
    
    _p._$$Page = NEJ.C();
    _prop = _p._$$Page._$extend(nej.ut._$$Page);
    
	/**
     * 触发点击事件
     * 
     * @protected
     * @method module:util/page/base._$$PageAbstract#__onClick
     * @param  {Event}  arg0 - 事件对象
     * @param  {Number} arg1 - 页码标记
     * @return {Void}
     */
    _prop.__onClick = function(_event,_flag){
        nej.v._$stopDefault(_event);
        // check state
        var _element = nej.v._$getElement(_event),
            _selected = nej.e._$hasClassName(
                this.__getSelectNode(_element
            ),this.__selected),
            _disabled = nej.e._$hasClassName(_element,this.__disabled);
        // update index
        var _index = _element.innerText;
        switch(_flag){
            // previous or next
            case  1:
            case -1:
                _index = this.__index+_flag;
                break;
            case -2:
                _index = 1;
            break;
        }
        if(_index <= 0) {
        	return;
        }
        this._$setIndex(_index);
    };
    
    _prop._$setNextPageHide = function(_string) {
    	this.__nbtn.style.display = _string||"";
    };
    
    _prop._$setPrePageHide = function(_string) {
    	this.__pbtn.style.display = _string||"";
    };
    
    /**
     * 保存当前页码
     * 
     * @protected
     * @method module:util/page/base._$$PageAbstract#__doSaveIndex
     * @param  {Number}  arg0 - 页码
     * @return {Boolean}        是否保存成功
     */
    _prop.__doSaveIndex = function(_index){
        _index = parseInt(_index);
        if (isNaN(_index)||
            this.__total==null)
            return !1;
//        _index = Math.max(1,Math.min
//                (_index,this.__total));
        this.__last  = this.__index; 
        this.__index = _index;
        return !0;
    };
    
    /**
     * 设置节点的页码值
     * 
     * @protected
     * @method module:util/page/base._$$PageAbstract#__doSetNodeIndex
     * @param  {Node}   arg0 - 页码节点
     * @param  {Number} arg1 - 页码值
     * @return {Void}
     */
    _prop.__doSetNodeIndex = function(_node,_index){
        var _parent = this.__getSelectNode(_node);
        nej.e._$setStyle(_node,'display','none');	//所有的页码都隐藏，只出现前一页和后一页
    };
});