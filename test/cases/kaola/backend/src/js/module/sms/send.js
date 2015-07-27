/**
 * 后台管理 登陆页面
 * Created by zmm on 12/11/14.
 */

NEJ.define([
	'base/klass', 
    'base/element',
    'base/event',
    'util/event',
    'pro/base/util',
    'pro/base/request',
    'pro/widget/module',
    'pro/widget/form',
    'pro/base/config'
], function(_k,_e, _v, _t,_,request,_t2,_t1,config,_p, _o, _f, _r,_pro) {
	var channals ={};

    _p._$$VersionModule = _k._$klass();
    _pro = _p._$$VersionModule._$extend(_t2._$$MModule);

    _pro.__init = function(_options){
		this.__super(_options);
		this.__btn = _e._$get('btn');
		this.__message = _e._$get('message');
		this.__phonestring = _e._$get('phonestring');
		this.__select = _e._$get('msgprop');
		_v._$addEvent(this.__btn,'click',this.__onSendMSM._$bind(this));
	};
    
	_pro.__onSendMSM = function(){
		if(!!this.__sending) {
			return;
		}
		var _content = this.__message.value,
			_phoneStr = this.__phonestring.value,
			_msgprop = this.__select.value;
		if(!_content || !_phoneStr) {
			alert('短信内容和电话号码必填');
			return;
		}
		var errortext = '';
		if(_msgprop == 1 && _content.length > 66){
			errortext = '行业短信已超过66字，该短信会被拆分，是否继续';
		}else if(_msgprop == 2 && _content.length > 58){
			errortext = '营销短信已超过58字，该短信会被拆分，是否继续';
		}

		if(!!errortext) {
			if(window.confirm(errortext)){
				if(window.confirm('确定要发送短信吗？【请操作人员注意避免重复点击】')){
					this.__sending = true;
					request(config.URLPERFIX+'/backend/message/short/send',{
			    		method:'post',
			    		data:{content:_content,phoneStr:_phoneStr,msgprop:_msgprop},
			    		onload:function(_json){
			    			if(!!_json && _json.code == 200) {
			    				alert('发送成功');
			    			} else {
			    				alert(_json.msg);
			    			}
			    			this.__sending = false;
			    		}._$bind(this)
			    	})
				}
			}

		} else {
			if(window.confirm('确定要发送短信吗？【请操作人员注意避免重复点击】')){
				this.__sending = true;
				request(config.URLPERFIX+'/backend/message/short/send',{
		    		method:'post',
		    		data:{content:_content,phoneStr:_phoneStr,msgprop:_msgprop},
		    		onload:function(_json){
		    			if(!!_json && _json.code == 200) {
		    				alert('发送成功');
		    			} else {
		    				alert(_json.msg);
		    			}
		    			this.__sending = false;
		    		}._$bind(this)
		    	})
			}
		}
		
    	
	};
    _p._$$VersionModule._$allocate();
});