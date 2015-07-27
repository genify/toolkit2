/**
 * ====================================================
 * 确认框窗体逻辑实现文件
 *
 * @author hzjiangren@corp.netease.com
 * @author hzliuxinqi@corp.netease.com
 * ===================================================
 * */
define(['../window.js',
    'base/element',
    'base/event',
    'text!./import.products.css',
    'text!./import.products.html',
    'util/template/tpl',
    'util/form/form',
    'pro/base/request',
    'pro/base/util',
    'pro/base/config',
    'util/file/select',
    'util/ajax/xdr',
    'pro/components/notify/notify'
], function(Window, _e,_v,_css, _html,_e1,_t,request,_,config,_t1,_j,notify,_p, _o, _f, _r,_pro) {
	
	var _seed_css = _e._$pushCSSText(_css),
		_seed_html= _e1._$addNodeTemplate(_html);
	
    _p._$$ImportsProductsWindow = NEJ.C();
    _pro = _p._$$ImportsProductsWindow._$extend(Window);

    _pro.__reset = function(_options) {
    	_options.title= _options.title||'批量导入新品';
    	
        this.__super(_options);
        this.__importUrl = _options.importUrl;
        this.__templateNode.href = _options.importTplUrl;
        this.__formId = _t1._$bind(this.__uploadLbl,{
    		parent:this.__uploadLbl.parentNode,
    		name: 'file',
    		param:{storageId:_options.storageId,storageName:_options.storageName},
            multiple: false,
    		onchange:this.__onPackageUpload._$bind(this)})
    };

    _pro.__initXGui = function() {
        this.__seed_css = _seed_css;
        this.__seed_html = _seed_html
    };

    _pro.__initNode = function() {
        this.__super();
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__uploadLbl = _list[0];
        this.__templateNode = _list[1];
        this.__loadingNode = _list[2]
        this.__errorNode = _list[3];
        this.__linkNode = _list[4]
        this.__okBtn =  _list[5];
        this.__ccBtn = _list[6];
        _v._$addEvent(this.__okBtn,'click', this.__onOK._$bind(this));
        _v._$addEvent(this.__ccBtn,'click', this.__onCC._$bind(this));
    };
    _pro.__onPackageUpload = function(_event){
    	this.__form = _event.form;
    	_e._$addClassName(this.__errorNode,'f-dn');
    }
    
    /**
     * 点击"确定"按钮事件响应
     * */
    _pro.__onOK = function(_event) {
    	_v._$stop(_event);
    	if(!this.__form){
    		notify.show('请选择志入的文件文件');
    	}else{
	    	this.__form.action = this.__importUrl;
	    	_e._$delClassName(this.__loadingNode,'f-dn');
	    	_j._$upload(this.__form,{onload:function(_json){
	    		_e._$addClassName(this.__loadingNode,'f-dn');
	    		if(_json.code==200){
	    			this.__form = null;
	    			notify.show('导入成功！');
	    			var prdList;
	    			if(_json.data){
	    				prdList = _json.data.newSkuList||_json.data.list;
	    			}
	    			this._$dispatchEvent('onok',prdList);
		    		this.__unbindForm();
		    		this._$hide();
	    		} else if(_json.code==400){
	    			notify.show(_json.message);
	    		}else if(_json.code==500){
	    			notify.show('导入失败');
	    			_e._$delClassName(this.__errorNode,'f-dn');
	    			this.__linkNode.href = _json.data.resultUrl;
	    		}
	    	}._$bind(this),
	    	onerror:function(e){
	    		_e._$addClassName(this.__loadingNode,'f-dn');
	    		notify.show('上传出错');
	    	}})
    	}
        
    };
    
    _pro.__unbindForm = function(){
    	_t1._$unbind(this.__formId);
    }
    /**
     * 点击"取消"按钮事件响应
     * */
    _pro.__onCC = function(_event) {
    	_v._$stop(_event);
    	this.__unbindForm();
        this._$dispatchEvent('oncc');
        this._$hide();
    };
    
    return _p._$$ImportsProductsWindow;
});
