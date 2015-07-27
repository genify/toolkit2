NEJ.define('{pro}module/reconciliation/storage.js',['pro/widget/module','{lib}util/event.js', '{lib}util/list/module.pager.js', '{lib}util/cache/list.js', '{lib}util/ajax/dwr.js', '{pro}widget/dialog/dialog.js', '{pro}widget/toast/toast.js','{pro}widget/window/warningWin.js'],
function(){
	var _p = NEJ.P('haitao.bm'),
		_pro,
		_proItemStorage,
        _importHtml1 = '\
            <div style="width:400px;height:70px;">\
            <form enctype="multipart/form-data" class="itag" action="/backend/reconciliation/storage/upload" target="_blank" method="post">\
                <select class="itag" name="storageId" style="width:100px;">',
        _importHtml2 = '</select>\
                <input class="itag" name="file" type="file" />\
                <p class="itag" style="display:none;color:#f80000;"></p>\
            </form>\
            </div>\
        ',
		_tkey = nej.e._$addHtmlTemplate('\
			<td title="${item.storageId|default:""|escape}">${item.storageId|default:""|escape}</td>\
			<td title="${item.state|default:""}">${item.state|default:""}</td>\
			<td title="${item.analyseUserId|default:""}">${item.analyseUserId|default:""}</td>\
			<td title="${item.importtime|default:""}" class="createTime">${item.importtime|default:0}</td>\
			'),
		_tkey1 = nej.e._$addHtmlTemplate('\
				<a class="xtag" href="#" onclick="haitao.g.editType(1,${item.id},\'${item.typeName}\',${item.pid},\'${item.pTypeName}\',event)">编辑</a>\
			');
	
	_p._$$StorageRecon = NEJ.C();
	_pro = _p._$$StorageRecon._$extend(haitao.bw._$$MModule);
	
	_pro.__init = function() {
		this.__super();
		this.__setNode();
	};
			 	
 	_pro.__setNode = function() {
 		var _ntmp = nej.e._$getByClassName(document.body, 'ztag'), i=0;
 		this.__importData = _ntmp[i++];
 		this.__delItem = _ntmp[i++];
 		this.__selectType = _ntmp[i++];
 		this.__leftBox = _ntmp[i++];
 		this.__leftPager = _ntmp[i++];

        this.__detailsBtn = _ntmp[i++];     //导入详情按钮
        this.__logBtn = _ntmp[i++];         //导入日志按钮
        this.__detailOperate = _ntmp[i++];  //详情操作
        this.__handle = _ntmp[i++];         //处理该批次
        this.__export = _ntmp[i++];
        this.__refresh = _ntmp[i++];
        this.__matchState = _ntmp[i++];
        this.__detailWrap = _ntmp[i++];     //详情内容
        this.__rightBox = _ntmp[i++];
        this.__rightPager = _ntmp[i++];
        this.__logWrap = _ntmp[i++];            //日志内容展示
        this.__log = _ntmp[i++];
 		
 		nej.v._$addEvent(this.__importData, 'click', this.__onImportData._$bind(this));
 		nej.v._$addEvent(this.__delItem, 'click', this.__onDeleteItem._$bind(this));
        nej.v._$addEvent(this.__selectType, 'change', this.__onChangeType._$bind(this));

        nej.v._$addEvent(this.__detailsBtn, 'click', this.__onShowDetail._$bind(this, true));
        nej.v._$addEvent(this.__logBtn, 'click', this.__onShowDetail._$bind(this, false));
        nej.v._$addEvent(this.__handle, 'click', this.__onHandle._$bind(this));
        nej.v._$addEvent(this.__refresh, 'click', this.__onRefresh._$bind(this));
        nej.v._$addEvent(this.__matchState, 'change', this.__onRefresh._$bind(this));
        
        nej.v._$addEvent(this.__export, 'click', function(){
        	var _dialog = haitao.bw._$$WarningWindow._$allocate({
                parent: document.body,
                content: '<p style="padding: 20px;">正在生成导出数据，稍微等一下下~</p>',
                onlyclosebtn: true,
                mask: 'w-winmask'
            });
            _dialog._$show();
        }._$bind(this));

 		var _beginTime = '2014-01-01',
            _nowTime = nej.u._$format(new Date().getTime()+86400000, 'yyyy-MM-dd');
 		this.__lopts = {
 	 			limit: 20,		//这个页面的dwr请求没有翻页，所以这里暂时设置成500来获取所有的内容
 	 			parent: this.__leftBox,
 	 			pager: {parent: this.__leftPager},
 	 			item: {klass: _p._$$ItemStorage},
 	 			cache: {
 	 				key: 'express',
 	 				lkey: 'express',
 	 				beanName: 'StorageReconciliationBean',
 	 				funcName: 'listStorage',
 	 				clear: true,
 	 				klass: _p._$$CacheStorage,
                    total: 10,
                    param: [_beginTime, _nowTime, 0, 20, 0]
 	 			},
                onafterlistrender: this.__afterRenderMold._$bind(this)
 	 		};

        this.__dopts = {
            limit: 20,      //这个页面的dwr请求没有翻页，所以这里暂时设置成500来获取所有的内容
            parent: this.__rightBox,
            pager: {parent: this.__rightPager},
            item: {klass: _p._$$ItemStorageDetail},
            cache: {
                key: 'storage',
                lkey: 'storage',
                beanName: 'StorageReconciliationBean',
                funcName: 'listDetail',
                clear: true,
                klass: _p._$$CacheStorageDetail,
                total: 10,
                param: [0, 20, 0, 0]  //long id,int limit,int offset,int option
            }
        }
 		
 		var g = NEJ.P('haitao.g');
 		g.generateDetailMold = this.__generateDetailMold._$bind(this);

        this.__doSearch(this.__config.total,0);

        this.__toast = haitao.bw._$$Toast._$allocate({
            text : '',
            parent : document.body,
            hide : true
        });
        var _optionsHmtl = '';
        for(var i=0,l=this.__config.wareHouses.length; i<l; i++) {
            _optionsHmtl += '<option value="'+this.__config.wareHouses[i].id+'">'+this.__config.wareHouses[i].name+'</option>'
        }
        this.__importHTML = _importHtml1 + _optionsHmtl + _importHtml2;

 	};

    _pro.__afterRenderMold = function() {
        this.__selectMoldData = null;
        if(!!this.__detailListModule) {
            this.__detailListModule._$recycle();  //回收控件
            this.__detailListModule = null;
        }
        this.__export.href = '#';
    };

    _pro.__onImportData = function(_event) {
        if(!this.__importDialog) {
            this.__importDialog = haitao.bw._$$Dialog._$allocate({
                parent: document.body,
                title: '导入数据',
                align: 'middle middle',
                draggable: true,
                content: this.__importHTML,
                hideOnok: false,
                initContent: function() {

                },
                onok: function(_dialogBody){
                    var _elements = nej.e._$getByClassName(_dialogBody,'itag');
                    var _form = _elements[0],
                        _express = _elements[1],
                        _file = _elements[2],
                        _err = _elements[3];

                    if(!_file.value) {
                        _err.innerText = '请选择上传文件';
                        _err.style.display = '';
                        return;
                    }
                    
                    if(_file.value.indexOf('xls') < 0 && _file.value.indexOf('xlsx')) {
                    	_err.innerText = '请选择上传Excel文件';
                        _err.style.display = '';
                        return;
                    }
                    
                    _err.style.display = 'none';

                    _form.submit();
                    this.__importDialog._$hide();
                }._$bind(this)
            });
        }
        
        this.__importDialog._$show();
    };

    _pro.__onDeleteItem = function(_event) {
        if(!this.__selectMoldData) {
            alert('请选择删除条目');
            return;
        }

        if(!this.__deleteDialog) {
            _html = '<div style="width:350px;height:100px;padding:20px 0 0 80px;"><p><b>确定要删除这条记录吗？</b></p><p>删除之后不可还原</p><p class="err" style="display:none;"></p></div>'
            this.__deleteDialog = haitao.bw._$$Dialog._$allocate({
                parent: document.body,
                title: '提示',
                align: 'middle middle',
                draggable: true,
                content: _html,
                hideOnok: false,
                initContent: function() {

                },
                onok: function(_dialogBody){
                    if(this.__selectMoldData.storageState == 25) {
                        alert('该记录已处理，不能删除');
                        this.__deleteDialog._$hide();
                        return;
                    }

                    nej.j._$haitaoDWR('StorageReconciliationBean', 'delete', [this.__selectMoldData.id], function(_result){
                        if(_result && _result.code == 200) {
                            alert('处理成功，刷新页面！');
                            location.reload();
                        } else {
                            alert('删除失败，请重试！');
                        }
                    });
                }._$bind(this)
            });
        }
        
        this.__deleteDialog._$show();
    };

    _pro.__generateDetailMold = function(_data, _index) {
        this.__selectMoldData = _data;
        this.__matchState.value = 0;
        this.__export.href = '/backend/reconciliation/storage/export?reconciliationId='+_data.id;
        var _total = _data.analyseAllLineCount;

        if(_data.storageState != 10) {     //导入失败不在导入详情中显示
            this.__doDetailSearch(_total, 0);
        } else {
        	if (!!this.__detailListModule) {
                this.__detailListModule._$recycle();  //回收控件
                this.__detailListModule = null;
        	}
        }

        var _logString = '';
        _logString += '导入时间：'+nej.u._$format(_data.importTime, 'yyyy-MM-dd HH:mm:ss')+'<br>';
        _logString += '开始分析时间：'+nej.u._$format(_data.analyseStartTime, 'yyyy-MM-dd HH:mm:ss')+'<br>';
        if(_data.storageState == 5) {      //导入中
            _logString += "正在导入<br>"+"导入总条数："+_data.analyseAllLineCount+"<br>已匹配数："+_data.analyseMatchLineCount+"<br>已处理数："+_data.analyseHandledLineCount+"<br>未匹配数："+_data.analyseNotMatchLineCount;
        } else if(_data.storageState == 10) {      //导入失败
            _logString += "导入失败<br>"+"导入成功条数："+_data.analyseAllLineCount+"<br>导入失败条数："+_data.errors.length;
            var _errors = '<br><br>导入失败的单号:<br>', i=0, l=_data.errors.length;
            for(;i<l;i++){
            	_errors += _data.errors[i]+'<br>';
            }
            _logString += _errors;
        } else if(_data.storageState != 0) {      //导入成功
            _logString += "导入成功<br>"+"导入总条数："+_data.analyseAllLineCount+"<br>已匹配数："+_data.analyseMatchLineCount+"<br>已处理数："+_data.analyseHandledLineCount+"<br>未匹配数："+_data.analyseNotMatchLineCount;
        }

        this.__log.innerHTML = _logString;
    };

    _pro.__onChangeType = function(_event) {
        var _value = Number(this.__selectType.value), typeoptions = {};
        switch(_value) {
            case 0:
                typeoptions.total = this.__config.total;
                typeoptions.options = 0;
                break;
            case 2:
                typeoptions.total = this.__config.handledTotal;
                typeoptions.options = 1;
                break;
            case 1:
                typeoptions.total = this.__config.notHandledTotal;
                typeoptions.options = 2;
                break;
        }

        this.__doSearch(typeoptions.total, _value);
    };

    _pro.__doSearch = function(_total, _value) {
        this.__lopts.cache.total = _total;
        this.__lopts.cache.param[2] = _value;

        if (!!this.__listModule) {
            this.__listModule._$recycle();  //回收控件
            this.__listModule = nej.ut._$$ListModulePG._$allocate(this.__lopts);
        } else {
            this.__listModule = nej.ut._$$ListModulePG._$allocate(this.__lopts);
        }
        this.__cache = this.__listModule.__cache;
    };

    _pro.__onShowDetail = function(_type, _event) {
        if(!!_type) {
            nej.e._$addClassName(this.__detailsBtn, 'cur');
            nej.e._$delClassName(this.__logBtn, 'cur');
            this.__detailOperate.style.display = this.__detailWrap.style.display = '';
            this.__logWrap.style.display = 'none';
        } else {
            nej.e._$addClassName(this.__logBtn, 'cur');
            nej.e._$delClassName(this.__detailsBtn, 'cur');
            this.__detailOperate.style.display = this.__detailWrap.style.display = 'none';
            this.__logWrap.style.display = '';
        }
    };

    _pro.__onHandle = function(_event) {
        if(!this.__selectMoldData) {
            alert('请选择处理条目');
            return;
        }

        if(this.__selectMoldData.storageState == 25) {
            this.__toast.__showto('当前批次已处理，不能重新处理');
            return;
        }

        if(this.__selectMoldData.storageState == 10) {
            this.__toast.__showto('数据上传失败');
            return;
        }

        if(this.__selectMoldData.storageState != 15 && this.__selectMoldData.storageState != 20) {
            this.__toast.__showto('数据正在上传或正在处理，请稍后处理');
            return;
        }

        if(!this.__handleDialog) {
            _html = '<div style="width:350px;height:100px;padding:20px 0 0 80px;"><p><b>确定要要处理该批次吗？</b></p></div>'
            this.__handleDialog = haitao.bw._$$Dialog._$allocate({
                parent: document.body,
                title: '提示',
                align: 'middle middle',
                draggable: true,
                content: _html,
                hideOnok: false,
                onok: function(_dialogBody){
                    nej.j._$haitaoDWR('StorageReconciliationBean', 'handle', [this.__selectMoldData.id], function(_result){
                        if(!!_result && _result.code == 200) {
                            alert('处理成功，刷新页面！');
                            location.reload();
                        } else {
                            alert('处理失败，请重试！');
                        }
                    });
                }._$bind(this)
            });
        }
        
        this.__handleDialog._$show();
    };

    _pro.__onRefresh = function(_event) {
        if(!this.__selectMoldData) {
            return;
        }
        var _total = 0, _value = Number(this.__matchState.value);
        switch(_value) {
            case 0:
                _total = this.__selectMoldData.analyseAllLineCount;
//                this.__export.href = this.__selectMoldData.analyseAllExcelUrl;
                break;
            case 2:
                _total = this.__selectMoldData.analyseMatchLineCount;
//                this.__export.href = this.__selectMoldData.analyseMatchExcelUrl;
                break;
            case 3:
                _total = this.__selectMoldData.analyseHandledLineCount;
//                this.__export.href = this.__selectMoldData.analyseHandledExcelUrl;
                break;
            case 1:
                _total = this.__selectMoldData.analyseNotMatchLineCount;
//                this.__export.href = this.__selectMoldData.analyseNotMatchExcelUrl;
                break;
        }
        
//        if(this.__selectMoldData.storageState != 25) {
//        	this.__export.href = 'javascript:void(0)';
//        }
        this.__doDetailSearch(_total, _value)
    };

    _pro.__doDetailSearch = function(_total, _value) {
        this.__dopts.cache.total = _total;
        this.__dopts.cache.param[3] = _value || Number(this.__matchState.value);
        this.__dopts.cache.param[0] = this.__selectMoldData.id;

        if (!!this.__detailListModule) {
            this.__detailListModule._$recycle();  //回收控件
            this.__detailListModule = nej.ut._$$ListModulePG._$allocate(this.__dopts);
        } else {
            this.__detailListModule = nej.ut._$$ListModulePG._$allocate(this.__dopts);
        }
        this.__detailCache = this.__detailListModule.__cache;
    };

	_p._$$CacheStorage = NEJ.C();
 	_proCache = _p._$$CacheStorage._$extend(nej.ut._$$ListCache);
 	_proCache.__reset = function(_options) {
		this.__super(_options);
		
		if(!!_options.beanName){
			this.__beanName = _options.beanName;
			this.__funcName = _options.funcName;
			this.__param = _options.param || [];
			this._$addEvent('doloadlist', this.__dogetList._$bind(this));
		}
	};
	
	_proCache.__dogetList = function(_options) {
		var _callback = function(_data) {
	    	_options.onload(_data.result.list);
		}
		this.__param[this.__param.length- 1] = _options.offset;
		nej.j._$haitaoDWR(this.__beanName, this.__funcName, this.__param, _callback);
	};

    _p._$$CacheStorageDetail = NEJ.C();
    _proCacheDetail = _p._$$CacheStorageDetail._$extend(nej.ut._$$ListCache);
    _proCacheDetail.__reset = function(_options) {
        this.__super(_options);
        
        if(!!_options.beanName){
            this.__beanName = _options.beanName;
            this.__funcName = _options.funcName;
            this.__param = _options.param || [];
            this._$addEvent('doloadlist', this.__dogetList._$bind(this));
        }
    };
    
    _proCacheDetail.__dogetList = function(_options) {
        var _callback = function(_data) {
            _options.onload(_data.result.list);
        }
        this.__param[2] = _options.offset;
        nej.j._$haitaoDWR(this.__beanName, this.__funcName, this.__param, _callback);
    };
	
 	/**
 	 * 
 	 * */
 	_p._$$ItemStorage = NEJ.C();
 	_proItemStorage = _p._$$ItemStorage._$extend(nej.ui._$$ListItem);
 	
 	_proItemStorage.__init = function(_options){
 		this.__super();
 		var _ntmp = nej.e._$getByClassName(this.__body,'xtag'),i=0;
 		this.__expressCompany = _ntmp[i++];
 		this.__state = _ntmp[i++];
 		this.__operator = _ntmp[i++];
 		this.__importTime = _ntmp[i++];
 		
 		nej.v._$addEvent(this.__body, 'click', this.__generateDetailMold._$bind(this));
 	};
 	
 	_proItemStorage.__initNodeTemplate = function() {
 		this.__seed_html = nej.e._$addNodeTemplate('\
				<td class="xtag" title="仓库">expressid</td>\
				<td class="xtag" title="处理状态"></td>\
				<td class="xtag" title="操作人"></td>\
				<td class="xtag" title="导入时间"></td>');
 	};

 	_proItemStorage.__doRefresh = function(_data) {
        this.__body.className = '';

 		this.__expressCompany.innerText = _data.storageName;
 		this.__state.innerText = _data.handleState;
 		this.__operator.innerText = _data.userName;
 		this.__importTime.innerText = nej.u._$format(_data.importTime, 'yyyy-MM-dd HH:mm:ss');
 	};
 	
 	_proItemStorage.__generateDetailMold = function(_event){
 		var _activeElems = nej.e._$getByClassName(this.__body.parentNode, 'curtr');
 		for(var i=0,l=_activeElems.length; i<l; i++) {
 			_activeElems[i].className = '';
 		}

 		this.__body.className = 'curtr';
 		haitao.g.generateDetailMold(this.__data, this.__index);
 	};

    _p._$$ItemStorageDetail = NEJ.C();
    _proItemStorageDetail = _p._$$ItemStorageDetail._$extend(nej.ui._$$ListItem);
    
    _proItemStorageDetail.__init = function(_options){
        this.__super();
        var _ntmp = nej.e._$getByClassName(this.__body,'xtag'),i=0;
        this.__orderNo = _ntmp[i++];
        this.__expressNo = _ntmp[i++];
        this.__fare = _ntmp[i++];
        this.__importFare = _ntmp[i++];
        this.__fareMargin = _ntmp[i++];
        this.__weight = _ntmp[i++];
        this.__grossWeight = _ntmp[i++];
        this.__importWeight = _ntmp[i++];
        this.__weightMargin = _ntmp[i++];
        this.__state = _ntmp[i++];
    };
    
    _proItemStorageDetail.__initNodeTemplate = function() {
        this.__seed_html = nej.e._$addNodeTemplate('\
                <td class="xtag" title="订单编号"></td>\
                <td class="xtag" title="快递单号"></td>\
                <td class="xtag" title="运费"></td>\
                <td class="xtag" title="导入运费"></td>\
                <td class="xtag" title="仓费差额">expressid</td>\
                <td class="xtag" title="包裹重量"></td>\
                <td class="xtag" title="包裹毛重"></td>\
                <td class="xtag" title="导入重量"></td>\
                <td class="xtag" title="重量差额"></td>\
                <td class="xtag" title="匹配状态"></td>');
    };

    _proItemStorageDetail.__doRefresh = function(_data) {
        this.__orderNo.innerText = _data.orderNo;
        this.__expressNo.innerText = _data.expressNo;
        this.__fare.innerText = _data.fare;
        this.__importFare.innerText = _data.importFare;
        this.__fareMargin.innerText = _data.fareMargin;
        this.__weight.innerText = _data.weight;
        this.__grossWeight.innerText = _data.grossWeight;
        this.__importWeight.innerText = _data.importWeight;
        this.__weightMargin.innerText = _data.weightMargin;
        this.__state.innerText = _data.state;
    };
 	
 	new _p._$$StorageRecon();
	
});