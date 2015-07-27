/**
* 添加合同功能
*/
define(['base/klass',
        'base/event',
        'base/element',
        'base/util',
        'ui/base',
        'text!./contract.css',
        'text!./contract.html',
        'util/template/tpl',
        'util/template/jst',
        'pro/base/util',
        'pro/components/supplychain/contract/contract',
        'util/file/select',
        'util/ajax/xdr',
        'pro/base/request',
        'pro/components/notify/notify'
        ],
	function(_k,_v,_e,_ut,_i,_css,_html,_e1,_t2,_,ContractList,_e2,_j,request,notify,_p,_o,_f,_r,_pro){
	
		var _seed_css = _e._$pushCSSText(_css),
        	_seed_html= _e1._$addNodeTemplate(_html);
		
		_p._$$Contract = _k._$klass();
		_pro = _p._$$Contract._$extend(_i._$$Abstract);
    
		 _pro.__reset = function(_options){
	        this.__super(_options);
	        this.__relatedId = _options.relatedId;
	        this.__role = _options.role||'user';
	        this.__contractList = _options.contractList;
	        if(_options.auditStatus!=8){
	        	_e._$addClassName(this.__uploadAccess,'f-dn');
	        }
	        this.rglist = new ContractList({data:{list:this.__contractList,auditStatus:_options.auditStatus}});
	        this.rglist.$inject(this.__contractNode);
	        this.rglist.$on('removeContract',this.__onRemoveContract._$bind(this))
	    };
	    _pro.__initXGui = function(){
	    	this.__seed_html = _seed_html;
	    	this.__seed_css = _seed_css;
	    }
	    _pro.__initNode = function() {
	        this.__super();
	        var _list = _e._$getByClassName(this.__body,'j-flag');
	        this.__uploadAccess = _list[0];
	        this.__uploadBtn = _list[1];
	        this.__contractNode = _list[2];
	        var _id = _e2._$bind( this.__uploadBtn,{
                     multiple:false,
                     name: 'fileData',
                     parent:this.__body,
                     onchange:this.__onChange._$bind(this)
                 });
	        
	    };
	    
	    _pro.__onChange = function(_event){
	    	var _form = _event.form;
	    	_form.action = '/backend/upload';
	    	_j._$upload(_form,{onload:function(result){
	    		var _contract = {attachmentName:result.body.name,attachmentUrl:result.body.url,relatedId:this.__relatedId};
	    		this.__contractList.push(_contract);
	    		this.__uploadContract(_contract);
	    	}._$bind(this),
	    	onerror:function(e){
	    		notify.show('上传图片可能超过2M');
	    	}})
	    	//_e._$remove(_event.id);
	    }
	    _pro.__adminRequestUrlChange = function(_url){
			if(this.__role=='admin'){
				_url = _url.replace('\/myAudit\/','\/auditMng\/');
			}
			return _url;
		};
	    
	    _pro.__uploadContract = function(_contract){
	    	
	    	request(this.__adminRequestUrlChange('/backend/myAudit/uploadContract'),{
	    		data:_contract,
	    		headers:{auditId:this.__relatedId},
	    		method:'POST',
	    		type:'json',
	    		onload:function(_json){
	    			if(_json.code==200){
	    				notify.show('上传成功');
	    				location.reload();
	    	    		this.rglist.$update();
	    			} else{
	    				notify.show(_json.message);
	    			}
	    		}._$bind(this),
	    		onerror:function(){
	    			notify.show('上传失败');
	    		}
	    	})
	    }
	    _pro.__onRemoveContract = function(_index){
	    	var _contract = this.__contractList[_index];
	    	request('/backend/myAudit/deleteContract',{
	    		data:{auditId:this.__relatedId,attachId:_contract.id},
	    		headers:{auditId:this.__relatedId},
	    		type:'json',
	    		onload:function(_json){
	    			if(_json.code==200){
	    				notify.show('删除成功');
	    				this.__contractList.splice(_index,1);
	    	    		this.rglist.$update();
	    			} else{
	    				notify.show(_json.message);
	    			}
	    		}._$bind(this),
	    		onerror:function(){
	    			notify.show('删除失败');
	    		}
	    	})
	    }
	    
	    _pro._$data = function(){
	    	return this.__contractList;
	    };
	    return _p._$$Contract
	}
)