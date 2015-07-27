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
    'text!./create.version.css',
    'text!./create.version.html',
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
	
    _p._$$CreatVersionWindow = NEJ.C();
    _pro = _p._$$CreatVersionWindow._$extend(Window);

    _pro.__reset = function(_options) {
    	_options.title='新建版本更新';
        this.__super(_options);
        this.__webForm = _t._$$WebForm._$allocate({
        	form:this.__form
        });
        this.__onTypeChange();
    };
    _pro.__destroy = function(_options) {
        this.__super(_options);
        if(this.__webFrom){
        	this.__webForm._$recycle();
        }
    };

    _pro.__initXGui = function() {
        this.__seed_css = _seed_css;
        this.__seed_html = _seed_html
    };

    _pro.__initNode = function() {
        this.__super();
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__form = _list[0];
        this.__oldVersionNode = _list[1];
        this.__packageUrlIpt = _list[2];
        this.__packageUrlUpload = _list[3];
        this.__okBtn =  _list[4];
        this.__ccBtn = _list[5];
        _t1._$bind(this.__packageUrlUpload,{
        		parent:this.__packageUrlUpload.parentNode,
        		name: 'fileData',
                multiple: false,
                param:{contentType:'application/vnd.android.package-archive'},
        		onchange:this.__onPackageUpload._$bind(this)})
        _v._$addEvent(this.__okBtn,'click', this.__onOK._$bind(this));
        _v._$addEvent(this.__ccBtn,'click', this.__onCC._$bind(this));
        _v._$addEvent(this.__form.type,'change',this.__onTypeChange._$bind(this))
        _v._$addEvent(this.__form.forceUpdate,'change',this.__onForceUpdateChange._$bind(this))
    };
    _pro.__onPackageUpload = function(_event){
    	var _form = _event.form;
    	_form.action = '/backend/upload';
    	_j._$upload(_form,{onload:function(result){
    		this.__form['url'].value =  result.body.url;
    		this.__form['packageSize'].value =  result.body.size;
    	}._$bind(this),
    	onerror:function(e){
    		notify.show('上传图片可能超过2M');
    	}})
    }
    
    _pro.__onTypeChange = function(){
    	var _type = this.__form.type.value;
    	request(config.URLPERFIX+'/backend/app/version/clientInfo',{
    		data:{type:_type},
    		onload:function(_json){
    			this.__oldVerisonList = _json.body.versionList;
    			this.__channalList = [{id:'',name:'ALL'}];
    			_r.push.apply(this.__channalList,_json.body.chanels);
    			
    			_.initSelect(this.__form.channal,this.__channalList,'id','name');
    			_.initSelect(this.__form.oldVersion,this.__oldVerisonList,'versionCode','versionCode');
    		}._$bind(this)
    	})
    }
    _pro.__onForceUpdateChange = function(){
    	var _type = this.__form.forceUpdate.value;
    	if(_type==2){
    		_e._$addClassName(this.__oldVersionNode,'f-dn');
    	} else{
    		_e._$delClassName(this.__oldVersionNode,'f-dn');
    	}
    }
    /**
     * 点击"确定"按钮事件响应
     * */
    _pro.__onOK = function(_event) {
    	_v._$stop(_event);
    	if(this.__webForm._$checkValidity()){
    		var _data = this.__webForm._$data();
    		_data.channal = _data.channal.join(',');
    		request(config.URLPERFIX+'/backend/app/version/create',{
    			data:_data,
    			onload:function(_json){
    				if(_json.code==200){
    					var version = _json.body.version;
    					this._$dispatchEvent('onok',version);
    					this._$hide();
    				}
    			}._$bind(this)
    		})
    	}
        
    };

    /**
     * 点击"取消"按钮事件响应
     * */
    _pro.__onCC = function(_event) {
    	_v._$stop(_event);
        this._$dispatchEvent('oncc');
        this._$hide();
    };
    
    return _p._$$CreatVersionWindow;
});
