NEJ.define(['{lib}util/chain/chainable.js', '{lib}util/cache/list.js',
    '{lib}util/template/jst.js', '{lib}base/util.js',
    '{lib}util/event.js',
    '{pro}widget/dialog/dialog.js',
    '{lib}util/ajax/dwr.js',
    '{pro}widget/calendar/calendar.js',
    'pro/widget/module'
], function(_q, _l, _j, _u) {
    var _p = NEJ.P('haitao.bm'),
        _v = NEJ.P('nej.v');

    _p._$$PurchaseManager = NEJ.C();
    var _pro = _p._$$PurchaseManager._$extend(haitao.bw._$$MModule);

    _pro.__init = function(_options){
        this.__super();

        // 站点path前缀
        this.__sitePath = '/backend/invoicing';

        //初始化日历
        this.__cal = haitao.bw._$$Calendar._$allocate({
            aftersettime:function(_input){
                _q(_input)._$trigger('change');
            }._$bind(this)
        });

        this.__poHeader = {
            ponumber: _q('.u-page-title'),
            //warehouse: _q('#po-warehouse'),
            //vendor: _q('#po-vendor'),
            //expectedTime: _q('#po-expectedtime'),
            //currencyType: _q('#po-currency'),
//            exchangeRate: _q('#po-exchangerate'),
//            contractNo: _q('#po-contractno'),
//            headerMemo: _q('#po-headermemo'),
//            goodsCount: _q('#goods-count'),
//            goodsAmount: _q('#goods-amount'),
            storageName: _q('#storageName'),
            orderStatus: _q('#orderStatus')
        };
        //所有的可操作按钮
        this.__allBtns = _q('.u-btn');

        //为仓库和供应商设置初始值
        //this.__poHeader.warehouse.length>0 ? this.__poHeader.warehouse._$attr('data-lastid', this.__poHeader.warehouse._$val()) : null;
        //this.__poHeader.vendor.length>0 ? this.__poHeader.vendor._$attr('data-lastid', this.__poHeader.vendor._$val()) : null;

        this.__regEvents();

        //PO修改状态标识        
        this.__STAT = {
            CLEAN: "C",
            DIRTY: "D"
        };
        this.__modifyState = this.__STAT.CLEAN;

        var g = NEJ.P('haitao.g');
        g.filterProducts = this.__filterProducts._$bind(this);
    };

    _pro.__regEvents = function(_options){
        var _today = _u._$format(new Date(), 'yyyy-MM-dd');
        //日历
        _q('.datepick')._$on('click',function(_event){
            this.__cal._$showCalendar(_event, _event.target, false, _today);
        }._$bind(this));
        //按钮事件
        _q('#saveBtn')._$on('click', this.__save._$bind(this) );
        _q('#submitBtn')._$on('click',this.__submit._$bind(this) );
        _q('#cancelBtn')._$on('click',this.__cancel._$bind(this) );     //hzjiangren 1-2014-12-15新增取消采购单
        _q('#addBtn')._$on('click',this.__add._$bind(this) );
        _q('#approveBtn')._$on('click',this.__approve._$bind(this) );
        _q('#rejectBtn')._$on('click',this.__reject._$bind(this) );
        _q('#confirmBtn')._$on('click',this.__confirm._$bind(this) );
        _q('#refuseBtn')._$on('click',this.__refuse._$bind(this) );
        _q('#mimicBtn')._$on('click',this.__mimic._$bind(this) );

        //可更改字段的修改事件
        //this.__poHeader.warehouse._$on('change', this.__criticChange._$bind(this));
        //this.__poHeader.vendor._$on('change', this.__criticChange._$bind(this));

        //this.__poHeader.expectedTime._$on('change', this.__normalChange._$bind(this));
        //this.__poHeader.expectedTime._$on('change', function(){
        //    //日历在更改后去除警告信息
        //    this.__poHeader.expectedTime._$delClassName('f-alert');
        //}._$bind(this));
        //this.__poHeader.currencyType._$on('change', function(){
        //    //币种在更改后去除警告信息
        //    this.__poHeader.currencyType._$delClassName('f-alert');
        //}._$bind(this));
        //this.__poHeader.contractNo._$on('change', function(){
        //    //合同编号在更改后去除警告信息
        //    this.__poHeader.contractNo._$delClassName('f-alert');
        //}._$bind(this));
        //
        //this.__poHeader.headerMemo._$on('change', this.__normalChange._$bind(this));

        _q('.poline-tab')._$on('change', 'input,textarea', this.__normalChange._$bind(this));

        _q('.poline-tab')._$on('keyup', '.poprice,.poqty',
            this.__controlFrequency(this.__updateStastics._$bind(this),200) );
        //删除按钮
        _q('.poline-tab')._$on('click', '.action-delete', this.__delPOLine._$bind(this));

        //修改合同编号和汇率
        _q('#edit-exchangerate')._$on('click', this.__eidtExchangeRate._$bind(this))
        _q('#edit-contractno')._$on('click', this.__eidtContractNo._$bind(this))

        //检测用户刷新或者关闭事件
        _q(window)._$on('beforeunload', this.__beforeExit._$bind(this));
    };

    //关键字段修改事件
    _pro.__criticChange = function(_event){
        var _tgt = _q(_event.target),
            _lastId = _tgt._$attr('data-lastid'),
            _currId = _tgt._$val();

        if ( _lastId == _currId ){
            return;
        }

        //若还没有添加商品行，允许更改 
        //若已经存在商品行了，必须提示用户确认，用户确认为“是”，则更改，否则直接撤销用户的更改
        if ( _q('.poline-tab tr[data-goodsid]').length == 0  ||
            confirm('更改仓库或者采购商，将清空已选商品清单，是否继续？') ) {
            _tgt._$attr('data-lastid', _currId);
            _q('.poline-tab>tbody')._$html('');
            this.__modifyState = this.__STAT.DIRTY;
            //重置新增商品对话框，清空dialog 及缓存数据
            if (this.__addDialog)
                this.__addDialog._$recycle();
            this.__addDialog = null;
            this.__itemslist = null;
        }else{
            _tgt._$val( _lastId ); //撤销用户的更改
        }
    };

    _pro.__maxValueOverflow = function(_val){
        return Number(_val) > 100000000;
    };

    _pro.__eidtExchangeRate = function(_event) {
        var _html = '<div style="padding:30px 50px;font-size:12px;">汇率：<input type="text" class="exchange-text" /></div>',
            _id, _val;
        this.__editExchangeDialog = haitao.bw._$$Dialog._$allocate({
            parent: document.body,
            title: '修改汇率',
            align: 'middle middle',draggable: true,
            content: _html,
            hideOnok: false,
            onok: function(_dialogBody){
                _val = _q('.exchange-text', _dialogBody)._$val();
                if(!_val) {
                    alert('请输入汇率');
                    return;
                }
                if (!!isNaN(_val)) {
                    alert('请输入数字');
                    return;
                }
                
                if(Number(_val) <= 0) {
                	alert('请输入大于0的数字');
                	return;
                }
                _q('.ok,.cc', _dialogBody)._$attr('disabled','disabled');

                id = Number(this.__poHeader.ponumber._$attr('data-ponumber'));
                nej.j._$haitaoDWR('InvoicingBean', 'updateExchangeRate',
                    [id, parseInt(Number(_val)*1000000)/1000000], function(_data){
                        if(!_data) {
                            alert('修改失败，请重试');
                            _q('.ok', _dialogBody)[0].removeAttribute('disabled');
                            _q('.cc', _dialogBody)[0].removeAttribute('disabled');
                        } else {
                            alert('修改成功，刷新页面');
                            this.__editExchangeDialog._$hide();
                            location.reload();
                        }
                    }._$bind(this));
            }._$bind(this)
        });
        this.__editExchangeDialog._$show();
    };

    _pro.__eidtContractNo = function(_event) {
        var _html = '<div style="padding:30px 50px;font-size:12px;">合同编号：<input type="text" class="contract-text" /></div>',
            _id, _val;
        this.__editContractDialog = haitao.bw._$$Dialog._$allocate({
            parent: document.body,
            title: '修改合同编号',
            align: 'middle middle',draggable: true,
            content: _html,
            hideOnok: false,
            onok: function(_dialogBody){
                _val = _q('.contract-text', _dialogBody)._$val();
                if(!_val) {
                    alert('请输入合同编号');
                    return;
                }
                _q('.ok,.cc', _dialogBody)._$attr('disabled','disabled');

                id = Number(this.__poHeader.ponumber._$attr('data-ponumber'));
                nej.j._$haitaoDWR('InvoicingBean', 'updateContractNo',
                    [id, _val], function(_data){
                        if(!_data) {
                            alert('修改失败，请重试');
                            _q('.ok', _dialogBody)[0].removeAttribute('disabled');
                            _q('.cc', _dialogBody)[0].removeAttribute('disabled');
                        } else {
                            alert('修改成功，刷新页面');
                            this.__editContractDialog._$hide();
                            location.reload();
                        }
                    }._$bind(this));

            }._$bind(this)
        });
        this.__editContractDialog._$show();
    };

    //普通字段修改事件
    _pro.__normalChange = function(_event){
        this.__modifyState = this.__STAT.DIRTY;

        //检查采购数量,采购单价 用户输入是否正确，不正确则红色提醒
        var _val = _event.target.value;
        if (_event.target.className.indexOf('poqty-i')>=0){
            var reg = /^[1-9]\d*$/;
            if (!reg.test(_val) && _val !== '0'){
                alert('采购数量只能输入正整数或者0');
                _q(_event.target)._$addClassName('f-alert');
                _event.target.focus();
            }else{
                if (this.__maxValueOverflow(_val)) {
                    alert('采购数量不能超过1亿');
                    _q(_event.target)._$addClassName('f-alert');
                    _event.target.focus();
                }else{
                    _q(_event.target)._$delClassName('f-alert');
                }
            }
        }else if (_event.target.className.indexOf('poprice-i')>=0){
            var reg = /^([1-9]\d*|0)\.\d{1,2}$|^([1-9]\d*|0)$/;
            if (!reg.test(_val)){
                alert('采购单价需为最多2位小数的非负数');
                _q(_event.target)._$addClassName('f-alert');
                _event.target.focus();
            }else{
                if (this.__maxValueOverflow(_val)) {
                    alert('采购单价不能超过1亿');
                    _q(_event.target)._$addClassName('f-alert');
                    _event.target.focus();
                }else{
                    _q(_event.target)._$delClassName('f-alert');
                }
            }
        }
    };

    //影响PO总价，行总价，件数计算的事件处理
    //在添加、删除商品后，更新采购件数、采购金额的统计信息
    _pro.__updateStastics = function(_event){
        this.__poHeader.goodsAmount._$text(' ...');
        this.__poHeader.goodsCount._$text(' ...');
        //更新总价及计数
        var _rows = _q('.poline-tab tr[data-goodsid]'),
            _counter = {qty: 0, amt: 0};
        _rows._$forEach(function(_node){
            var _line = this.__getLineStatics(_node);
            if (!!_line){
                _counter.qty += _line.qty;
                _counter.amt += _line.price * _line.qty;
            }
        }._$bind(this) );

        this.__poHeader.goodsCount._$text( _counter.qty );
        this.__poHeader.goodsAmount._$text( _u._$fixed(_counter.amt, 2) );

        //更新行价格, 如果是删除按钮过来的事件，则不计算
        if (_event.target.className.indexOf('action-delete') >= 0){
            return;
        }

        var _row = _q(_event.target)._$parent('tr'),
            _line = this.__getLineStatics(_row);
        _row._$children('.lineamount', true)._$text( !!_line ? _u._$fixed(_line.qty * _line.price, 2) : '' );

    };

    //获取行价格及数量
    _pro.__getLineStatics = function(_node){
        var _poqty = _q(_node)._$children('.poqty-i', true)._$val();
        var _poprice = _q(_node)._$children('.poprice-i', true)._$val();
        if ( _poqty.length>0 && _poprice.length>0
            && Number(_poqty) >= 0 && Number(_poprice)>=0 ){
            return {qty:Number(_poqty) , price: Number(_poprice)};
        }else{
            return null;
        }
    };

    //PO行删除按钮点击
    _pro.__delPOLine = function(_event){
        _v._$stop(_event);
        //删除自身TR
        _q(_event.target)._$parent('tr')._$remove();

        this.__updateStastics(_event);

        this.__modifyState = this.__STAT.DIRTY;
    };

    //数据合法性检查, 通过返回true,否则为false
    _pro.__validateSavingData = function(){
        var _message = [];
        if (!this.__poHeader.expectedTime._$val()){
            _message.push('请填写入库时间');
            this.__alert(this.__poHeader.expectedTime);
        }
        if (this.__poHeader.currencyType._$val() < 0){
            _message.push('请填写币种');
            this.__alert(this.__poHeader.currencyType);
        }
        if (!this.__poHeader.contractNo._$val()){
            _message.push('请填写合同编号');
            this.__alert(this.__poHeader.contractNo);
        }
        var _lines = _q('.poline-tab tr[data-goodsid]');
        if ( _lines.length == 0 ){
            _message.push('请至少选择一个商品');
            this.__alert( _q('#addBtn') );
        }

        var _count = 0;
        _lines._$forEach(function(_node){
            var _poPricei = _q('.poprice-i', _node),
                _poQtyi   = _q('.poqty-i', _node),
                _poPrice = _poPricei._$val(),
                _poQty   = _poQtyi._$val(),
                reg;

            reg = /^([1-9]\d*|0)\.\d{1,2}$|^([1-9]\d*|0)$/;
            if ( _poPrice == '' || isNaN(Number(_poPrice)) || !reg.test(_poPrice) || this.__maxValueOverflow(_poPrice) ){
                _count==0 ? _message.push('请填写详细的入库信息') : null;
                _count++;
                this.__alert(_poPricei);
            }

            reg = /^[-]{0,1}[0-9]{1,}$/;
            if ( _poQty == '' || isNaN(Number(_poQty)) || !reg.test(_poQty) || this.__maxValueOverflow(_poQty) ){
                _count==0 ? _message.push('请填写详细的入库信息') : null;
                _count++;
                this.__alert(_poQtyi);
            }

        }._$bind(this));

        if (_message.length>0) {
            _q('#po-alert')._$text(_message.join(', '));
            return false;
        }else{
            _q('#po-alert')._$text('');
        };
        return true;
    };

    //保存动作
    _pro.__save = function(_event){
        this.__setBtnStatus('disable');
        if (!this.__validateSavingData()){
            this.__setBtnStatus('enable');
            return;
        };
        var _header = this.__buildPOHeader();
        var _lines = this.__buildFromPOLines();
        _header.details = _lines;
        var _method = 'createPurchaseOrder',
            _params = [_header];
        if (_header.id>0) {
            _method = 'savePurchaseOrder';
        } else {
            _params.push(0);
        };
        //保存动作开始
        nej.j._$haitaoDWR('InvoicingBean', _method,
            _params, function(_data){
                if (!_data) {
                    //出错处理
                    alert('保存失败，请重试');
                    this.__setBtnStatus('enable');
                    return;
                };

                //保存成功，修改状态转换, 更新po号, 更新操作记录
                this.__poHeader.ponumber._$attr('data-ponumber', _data.purchaseOrderId)._$text('采购单号： ' + _data.purchaseOrderId);
                _q('.m-action-history .logs')._$insert('<p class="detail">' + _data.operatorName
                    + ' 于 '+  _u._$format(new Date(_data.time), 'yyyy-MM-dd HH:mm:ss')
                    +' '+ _data.action + '；</p>'
                    , 'top');
                this.__modifyState = this.__STAT.CLEAN;
                _event.target.value = "√保存成功";
                setTimeout(function(){
                    _event.target.value = "保存";
                }, 1000);
                this.__setBtnStatus('enable');
            }._$bind(this), function(_err){
                //出错处理
                alert('保存失败，请重试');
                this.__setBtnStatus('enable');
            }._$bind(this));

    };

    //提交采购订单动作
    _pro.__submit = function(_event){
        this.__setBtnStatus('disable');
        //如果还没有保存，则提示保存
        if (this.__modifyState == this.__STAT.DIRTY  &&
            this.__poHeader.ponumber._$attr('data-ponumber') == '新建采购单' ){
            alert('新采购单还没有保存，请保存后再提交');
            this.__setBtnStatus('enable');
            return;
        }

        //提交动作 , 如果已经保存过一次了，那么后续更改后不需要点击保存，直接提交即可
        if (!this.__validateSavingData()){
            this.__setBtnStatus('enable');
            return;
        };

        //TODO 提交也要显示对话框， 
        //审核对话框，每次都新建
        if (this.__submitDialog){
            this.__submitDialog._$recycle();
            this.__submitDialog = null;
        }
        var _poNumber = this.__poHeader.ponumber._$attr('data-ponumber'),
            _ponumberObj = {poNumber: _poNumber };
        _j._$add('jst-submit');
        var _html = _j._$get('jst-submit', _ponumberObj);

        this.__submitDialog = haitao.bw._$$Dialog._$allocate({
            parent: document.body,
            title: '提示',
            align: 'middle middle',draggable: true,
            content: _html,
            hideOnok: false,
            onok: function(_dialogBody){
                _q('.alert-text', _dialogBody)._$text('');
                _q('.ok,.cc', _dialogBody)._$attr('disabled','disabled');

                var _header = this.__buildPOHeader();
                var _lines = this.__buildFromPOLines();
                _header.details = _lines;
                //提交动作开始
                nej.j._$haitaoDWR('InvoicingBean', 'commitPurchaseOrder',
                    [_header], function(_data){
                        if (!_data) {
                            //失败处理,显示提示信息
                            _q('.alert-text', _dialogBody)._$text('提交失败，请重试');
                            _q('.ok', _dialogBody)[0].removeAttribute('disabled');
                            _q('.cc', _dialogBody)[0].removeAttribute('disabled');
                            return;
                        };

                        //成功则跳转到采购单详情页面
                        this.__modifyState = this.__STAT.CLEAN;
                        location.href = this.__sitePath + '/order?id='+ encodeURIComponent(_poNumber);
                    }._$bind(this), function(_err){
                        //失败处理,显示提示信息
                        _q('.alert-text', _dialogBody)._$text('提交失败，请重试');
                        _q('.ok', _dialogBody)[0].removeAttribute('disabled');
                        _q('.cc', _dialogBody)[0].removeAttribute('disabled');
                    }._$bind(this));
            }._$bind(this)
        });
        this.__submitDialog._$show();
        this.__setBtnStatus('enable');
    };

    //取消采购单
    _pro.__cancel = function(_event) {
        var _html = '<div style="padding:30px 50px;font-size:12px;"><b>确定要取消：'+this.__poHeader.ponumber._$attr('data-ponumber')+'这笔采购单吗？</b><br>该采购单已经推送给仓库了</div>',
            _id, _val;
        this.__cancelDialog = haitao.bw._$$Dialog._$allocate({
            parent: document.body,
            title: '取消采购单',
            align: 'middle middle',draggable: true,
            content: _html,
            hideOnok: false,
            onok: function(_dialogBody){
                _q('.ok,.cc', _dialogBody)._$attr('disabled','disabled');

                id = Number(this.__poHeader.ponumber._$attr('data-ponumber'));
                nej.j._$haitaoDWR('InvoicingBean', 'cancelPurchaseOrder',
                    [id], function(_data){
                        if(!_data) {
                            //失败处理,显示提示信息
                            _q('.alert-text', _dialogBody)._$text('提交失败，请重试');
                            _q('.ok', _dialogBody)[0].removeAttribute('disabled');
                            _q('.cc', _dialogBody)[0].removeAttribute('disabled');
                        } else {
                            alert('修改成功，刷新页面');
                            this.__cancelDialog._$hide();
                            location.reload();
                        }
                    }._$bind(this));

            }._$bind(this)
        });
        this.__cancelDialog._$show();
    };

    //NEJ chainable $('html') bug处理
    _pro.__toDomNode = function(_html){
        var tb = document.createElement('table');
        tb.innerHTML = _html;
        return _q('tr',tb);
    };

    //添加商品动作
    _pro.__add = function(_event){
        this.__setBtnStatus('disable');
        _q(_event.target)._$delClassName('f-alert');

        var _warehouseId = Number(_q('#po-warehouse')._$val()),
            _supplierId = Number(_q('#po-vendor')._$val());
        if ( isNaN(_warehouseId) || isNaN(_supplierId) ) {
            alert("仓库或采购商选择错误");
            return;
        };
        var _options = {"warehouseId": _warehouseId,
            "supplierId":  _supplierId };
        var _eventHandler = {
            onok: function(_dialogBody){
                _q('.alert-text', _dialogBody)._$text(''); //重置状态
                //取得选中数据
                var _checkedSkus = _q('.item.sku>input:checked', _dialogBody);
                if (_checkedSkus && _checkedSkus.length > 0){
                    var _checkedData = this.__buildFromDialog(_checkedSkus);
                    var _newLinesHtml = this.__buildPOLineHtml(_checkedData);
                    var _nodes = this.__toDomNode(_newLinesHtml);
                    var _tb = _q('.poline-tab>tbody');
                    _nodes._$forEach(function(_node, index){
                        _tb._$insert(_node, 'append');
                    });
                    this.__addDialog._$hide();
                    this.__modifyState = this.__STAT.DIRTY;
                }else{
                    _q('.alert-text', _dialogBody)._$text('请至少选择一个商品');
                }
                //重置选择状态
                _q('.item>input:checked', _dialogBody)._$forEach(function(_node){
                    _node.checked = false;
                });
            }._$bind(this)
        }
        this.__getItemsListShow(_options, _eventHandler);
    };

    _pro.__buildFromDialog = function(_checkedSkus){
        var _checkedData = [];
        var _ignoredLines = 0;
        _checkedSkus._$forEach(function(_node){
            var _goodsId = _q(_node)._$parent('.itementry')._$attr('data-goodsid');
            var _skuId = _q(_node)._$attr('data-skuid');
            //如果PO行已经存在此产品，则不再重复增加
            if ( this.__ifExistInPOLine(_goodsId, _skuId ) ) {
                _ignoredLines++;
                return;
            };

            //从缓存中取出其他信息构建行对象       
            var _found = false;
            for (var i = this.__itemslist.items.length - 1; i >= 0; i--) {
                var _item = this.__itemslist.items[i];
                if (_item.goodsId.toString() == _goodsId){
                    for (var j = _item.skuList.length - 1; j >= 0; j--) {
                        var _sku = _item.skuList[j];
                        if (_sku.skuId == _skuId){
                            _checkedData.push({
                                goodsId: _goodsId,
                                goodsName: _item.goodsName,
                                importType: _item.importType,
                                barcode: _item.barcode,
                                skuId: _skuId,
                                skuDesc: _sku.skuDesc,
                                referUnitPrice: _sku.referUnitPrice
                            });
                            _found = true;
                            break;
                        }
                    };
                    break;
                }
            };
            _found ? null : alert("缓存数据错误，请刷新页面再重试添加");

        }._$bind(this));
        if (_ignoredLines > 0){
            alert(_ignoredLines + ' 个商品因为重复添加，已经忽略');
        }
        return _checkedData;
    };

    //检查同一个SKU 是否已经在PO行中存在
    _pro.__ifExistInPOLine = function(_goodsId, _skuId){
        var _line = _q('.poline-tab tr[data-goodsid="'+ _goodsId +'"][data-skuid="'+ _skuId +'"]');
        return _line.length>0 ? true : false;
    }

    //根据给出的数据+模板，渲染PO行表所需的HTML文本
    _pro.__buildPOLineHtml = function(_checkedData){
        if (!_checkedData || !_u._$isArray(_checkedData) || _checkedData.length == 0) {
            return '';
        }
        var _list = {lines: _checkedData};
        _j._$add('jst-new-poline');
        return _j._$get('jst-new-poline', _list);
    };


    //从DOM 构建PO头对象
    _pro.__buildPOHeader = function(){
        var _header = {}, _hobj = this.__poHeader;
        //_header.storageId = Number(_hobj.warehouse._$val());
        _header.storageName = _hobj.storageName._$text();
        //_header.supplierId  = Number(_hobj.vendor._$val());
        //_header.supplierName = _hobj.vendor._$children('option:selected')._$text();
        //_header.expectedTime = _u._$var2date( _hobj.expectedTime._$val() ).getTime();
//        _header.exchangeRate = parseInt(Number(_hobj.exchangeRate._$val())*1000000)/1000000;
//        _header.currencyValue = Number(_hobj.currencyType._$val());
//        _header.contractNo = _hobj.contractNo._$val();
//        _header.remark = _hobj.headerMemo._$val();
//        if (_hobj.ponumber._$attr('data-ponumber') == "新建采购单"){
//            _header.id = 0;
//        }else{
        _header.id = Number(_hobj.ponumber._$attr('data-ponumber'));
//        }
//        _header.orderStatus = _hobj.orderStatus._$text();
        return _header;
    }
    //从DOM 构建PO行对象
    _pro.__buildFromPOLines = function(){
        var _lines = [];
        var _lineNodes = _q('.poline-tab tr[data-goodsid]');
        _lineNodes._$forEach(function(_node,_index){
            var _skuId = _q(_node)._$attr('data-skuid'),
                //_remark = _q(_node)._$children('.linememo-i',true)._$val(),
                //_purchaseUnitPrice = Number(_q(_node)._$children('.poprice-i',true)._$val()),
                //_purchaseCount = Number( _q(_node)._$children('.poqty-i',true)._$val()),
                _goodQty = Number( _q(_node)._$children('.good-qty-i',true)._$val()),
                _badQty = Number( _q(_node)._$children('.bad-qty-i',true)._$val());

            _lines.push({
                skuId: _skuId,
                //purchaseUnitPrice: _purchaseUnitPrice,
                //purchaseCount: _purchaseCount,
                //remark: _remark,
                goodCount: _goodQty,
                badCount: _badQty
            });
        });
        return _lines;
    }


    //审核通过动作
    _pro.__approve = function(_event){
        this.__setBtnStatus('disable');
        //审核对话框，每次都新建
        if (this.__approveDialog){
            this.__approveDialog._$recycle();
            this.__approveDialog = null;
        }
        var _ponumber = {poNumber: this.__poHeader.ponumber._$attr('data-ponumber') };
        _j._$add('jst-approve');
        var _html = _j._$get('jst-approve', _ponumber);

        this.__approveDialog = haitao.bw._$$Dialog._$allocate({
            parent: document.body,
            title: '提示',
            align: 'middle middle',draggable: true,
            content: _html,
            hideOnok: false,
            onok: function(_dialogBody){
                //approve action
                _q('.alert-text', _dialogBody)._$text('');
                _q('.ok,.cc', _dialogBody)._$attr('disabled','disabled');

                var _poNumber = Number(this.__poHeader.ponumber._$attr('data-ponumber'));
                nej.j._$haitaoDWR('InvoicingBean', 'auditPurchaseOrder', [_poNumber], function(_data){
                    if (!_data) {
                        //出错处理
                        _q('.alert-text', _dialogBody)._$text('审核失败，请重试');
                        _q('.ok', _dialogBody)[0].removeAttribute('disabled');
                        _q('.cc', _dialogBody)[0].removeAttribute('disabled');
                        return;
                    };

                    //采购单审核通过后，需要将后台的最新状态取回
                    this.__modifyState = this.__STAT.CLEAN;
                    window.location.reload(true);
                }._$bind(this), function(_err){
                    //出错处理
                    _q('.alert-text', _dialogBody)._$text('审核失败，请重试');
                    _q('.ok', _dialogBody)[0].removeAttribute('disabled');
                    _q('.cc', _dialogBody)[0].removeAttribute('disabled');
                }._$bind(this));
            }._$bind(this)
        });
        this.__approveDialog._$show();
        this.__setBtnStatus('enable');
    };
    //审核驳回动作    	
    _pro.__reject = function(_event){
        this.__setBtnStatus('disable');
        //驳回不需要确认
        var _poNumber = Number(this.__poHeader.ponumber._$attr('data-ponumber'));
        nej.j._$haitaoDWR('InvoicingBean', 'rejectPurchaseOrder', [_poNumber], function(_data){
            if (!_data) {
                alert('驳回失败，请重试');
                this.__setBtnStatus('enable');
                return;
            };
            window.location.reload(true);
        }._$bind(this), function(_err){
            alert('驳回失败，请重试');
            this.__setBtnStatus('enable');
        }._$bind(this));
    };

    //入库确认动作
    _pro.__confirm = function(_event){
        this.__setBtnStatus('disable');
        //入库确认对话框
        if (this.__confirmDialog){
            this.__confirmDialog._$recycle();
            this.__confirmDialog = null;
        }
        var _ponumber = {poNumber: this.__poHeader.ponumber._$attr('data-ponumber') };
        _j._$add('jst-confirm');
        if(!!document.getElementById('currencyname') && document.getElementById('currencyname').innerHTML.indexOf('人民币') >=0 ){
            _ponumber.isrmb = true;
        }
        var _html = _j._$get('jst-confirm', _ponumber);

        this.__confirmDialog = haitao.bw._$$Dialog._$allocate({
            parent: document.body,
            title: '提示',
            align: 'middle middle',draggable: true,
            content: _html,
            hideOnok: false,
            onok: function(_dialogBody){
            	var _exchangeNum = _q('.confirm-exchange', _dialogBody)._$val();
            	if(!_exchangeNum || isNaN(_exchangeNum)) {
            		alert('未输入汇率或者汇率输入不为数字');
            		return;
            	}
            	if(Number(_exchangeNum) <= 0) {
                	alert('请输入大于0的数字');
                	return;
                }
            	_exchangeNum = parseInt(Number(_exchangeNum)*1000000)/1000000;
                _q('.alert-text', _dialogBody)._$text('');
                _q('.ok,.cc', _dialogBody)._$attr('disabled','disabled');
                //confirm action
                var _poNumber = Number(this.__poHeader.ponumber._$attr('data-ponumber'));
                var _remark = _q('.confirm-memo', _dialogBody)._$val();
                nej.j._$haitaoDWR('InvoicingBean', 'stockInConfirmPurchaseOrder',
                    [_poNumber, _remark, _exchangeNum], function(_data){
                        if (!_data) {
                            _q('.alert-text', _dialogBody)._$text('提交失败，请重试');
                            _q('.ok', _dialogBody)[0].removeAttribute('disabled');
                            _q('.cc', _dialogBody)[0].removeAttribute('disabled');
                            return;
                        };
                        window.location.reload(true);
                    }._$bind(this), function(_err){
                        alert(_err.message);
                        _q('.alert-text', _dialogBody)._$text('提交失败，请重试');
                        _q('.ok', _dialogBody)[0].removeAttribute('disabled');
                        _q('.cc', _dialogBody)[0].removeAttribute('disabled');
                    }._$bind(this));
            }._$bind(this)
        });
        this.__confirmDialog._$show();
        this.__setBtnStatus('enable');
    };

    //入库拒绝动作
    _pro.__refuse = function(_event) {
        this.__setBtnStatus('disable');
        //入库拒绝对话框
        if (this.__refuseDialog){
            this.__refuseDialog._$recycle();
            this.__refuseDialog = null;
        }
        var _ponumber = {poNumber: this.__poHeader.ponumber._$attr('data-ponumber') };
        _j._$add('jst-refuse');
        var _html = _j._$get('jst-refuse', _ponumber);

        this.__refuseDialog = haitao.bw._$$Dialog._$allocate({
            parent: document.body,
            title: '提示',
            align: 'middle middle',draggable: true,
            content: _html,
            hideOnok: false,
            onok: function(_dialogBody){
                _q('.alert-text', _dialogBody)._$text('');
                _q('.ok,.cc', _dialogBody)._$attr('disabled','disabled');
                //confirm action
                var _poNumber = Number(this.__poHeader.ponumber._$attr('data-ponumber'));
                var _remark = _q('.confirm-memo', _dialogBody)._$val();
                nej.j._$haitaoDWR('InvoicingBean', 'refusePurchaseOrder',
                    [_poNumber, _remark], function(_data){
                        if (!_data) {
                            _q('.alert-text', _dialogBody)._$text('提交失败，请重试');
                            _q('.ok', _dialogBody)[0].removeAttribute('disabled');
                            _q('.cc', _dialogBody)[0].removeAttribute('disabled');
                            return;
                        };
                        window.location.reload(true);
                    }._$bind(this), function(_err){
                        alert(_err.message);
                        _q('.alert-text', _dialogBody)._$text('提交失败，请重试');
                        _q('.ok', _dialogBody)[0].removeAttribute('disabled');
                        _q('.cc', _dialogBody)[0].removeAttribute('disabled');
                    }._$bind(this));
            }._$bind(this)
        });
        this.__refuseDialog._$show();
        this.__setBtnStatus('enable');
    };

    // 虚拟入库
    _pro.__mimic = function(_event){
        var blankInput = 0;
        var badInput = 0;
        var goods = _q('.good-qty-i');
        goods._$forEach(function(node) {
            if (node.value === '') {
                blankInput++;
                _q(node)._$addClassName('f-alert');
            }
            var reg = /^[1-9]\d*$/;
            if (!reg.test(node.value) && node.value !== '0') {
                badInput++;
                _q(node)._$addClassName('f-alert');
            }
        });
        var bads = _q('.bad-qty-i');
        bads._$forEach(function(node) {
            if (node.value === '') {
                blankInput++;
                _q(node)._$addClassName('f-alert');
            }
            var reg = /^[1-9]\d*$/;
            if (!reg.test(node.value) && node.value !== '0') {
                badInput++;
                _q(node)._$addClassName('f-alert');
            }
        });
        if (blankInput > 0) {
            alert("还有入库数量未填写");
            return;
        }
        if (badInput > 0) {
            alert("还有入库数量填写错误");
            return;
        }

        this.__setBtnStatus('disable');
        //if (!this.__validateSavingData()){
        //    this.__setBtnStatus('enable');
        //    return;
        //}
        var _header = this.__buildPOHeader();
        var _lines = this.__buildFromPOLines();
        _header.details = _lines;
        var _method = 'mimicPurchaseOrder';

        //保存动作开始
        nej.j._$haitaoDWR('InvoicingBean', _method,
            [_header], function(_data){
                if (!_data) {
                    //出错处理
                    alert('失败，请重试');
                    this.__setBtnStatus('enable');
                    return;
                }

                //this.__poHeader.ponumber._$attr('data-ponumber', _data.purchaseOrderId)._$text('采购单号： ' + _data.purchaseOrderId);
                //_q('.m-action-history .logs')._$insert('<p class="detail">' + _data.operatorName
                //    + ' 于 '+  _u._$format(new Date(_data.time), 'yyyy-MM-dd HH:mm:ss')
                //    +' '+ _data.action + '；</p>'
                //    , 'top');
                //this.__modifyState = this.__STAT.CLEAN;
                //_event.target.value = "√保存成功";
                //setTimeout(function(){
                //    _event.target.value = "保存";
                //}, 1000);
                alert("成功，请前往采购单页面确认入库");
                this.__setBtnStatus('enable');
            }._$bind(this), function(_err){
                //出错处理
                alert('失败，请重试');
                alert(_err.message);
                this.__setBtnStatus('enable');
            }._$bind(this));
    };

    //显示商品选择对话框
    _pro.__showItemDialog = function(_itemslist, _evh){
        this.__itemslist = _itemslist;
        if (!_itemslist || !_u._$isArray(_itemslist.items) || _itemslist.items.length == 0){
            alert('无可选择的商品');
            return;
        }
        _j._$add('jst-itemlist');
        _j._$add('jst-ullist');
        var _html = _j._$get('jst-itemlist',_itemslist);

        //选择商品对话框
        this.__addDialog = haitao.bw._$$Dialog._$allocate({
            parent: document.body,
            title: '选择商品',
            align: 'middle middle',draggable: true,
            content: _html,
            hideOnok: false,
            onok: _evh.onok
        });
        //为对话框中的操作绑定事件
        var _dialogBody = this.__addDialog._$getBody();
        _q('.itemlist')._$on('click','.item.name>input', function(_event){
            var toStatus = _event.target.checked;
            var _list = _q('.item.sku>input', _event.target.parentNode.parentNode);
            _list._$forEach(function(_node, _index){
                _node.checked = toStatus;
            });
        });

        this.__addDialog._$show();
    };

    _pro.__filterProducts = function(_event) {
        if(!this.__addDialog) return;

        var _dialogBody = this.__addDialog._$getBody(), 
            _pName = _q('.pname', _dialogBody)._$val(),
            _pID = _q('.pid', _dialogBody)._$val();

        if(!_pName && !_pID){
            var _filterHTML = _j._$get('jst-ullist',this.__itemslist);
            _q('.itemlist', _dialogBody)[0].innerHTML = _filterHTML;
            return;
        }
        //开始生成新的lists
        var _filterLists = [], _item;
        for(var i=0,l=this.__itemslist.items.length; i<l; i++) {
            _item = this.__itemslist.items[i];
            if(_item.goodsName.indexOf(_pName) >= 0 && (!_pID || _item.goodsId == Number(_pID))) {
                _filterLists.push(_item);
            }
        }
        var _filterHTML = _j._$get('jst-ullist',{items:_filterLists});
        _q('.itemlist', _dialogBody)[0].innerHTML = _filterHTML;
    };

    //获取供选择的产品清单
    _pro.__getItemsListShow = function(_options, _evh) {
        //如果已经生成了，则直接显示
        //以第一次取回来的缓存数据为准，后续打开对话框时不再重新获取
        if (this.__addDialog)  {
            this.__addDialog._$show();
            this.__setBtnStatus('enable');
            return;
        }

        nej.j._$haitaoDWR('InvoicingBean',
            'getGoodsList',
            [_options.supplierId , _options.warehouseId],
            function(_data){
                if (!_data) {
                    alert('获取商品清单失败，请重试');
                    this.__setBtnStatus('enable');
                    return;
                };
                var _items = {items: _data};
                this.__showItemDialog(_items, _evh);
                this.__setBtnStatus('enable');
            }._$bind(this), function(_err){
                alert('获取商品清单失败，请重试');
                this.__setBtnStatus('enable');
            }._$bind(this));
    };

    //提醒用户需要注意的字段
    _pro.__alert = function(_node){
        if (!_node) { return; };
        _q(_node)._$delClassName('f-alert')._$addClassName('f-alert');
    };

    _pro.__controlFrequency = function(fn, ms) {
        ms = ms || 200;
        var th_timer;

        function f(_evt) {
            f.stop();
            th_timer = setTimeout(function(){
                fn.call(this,_evt);
            }, ms);
        }
        f.stop = function() {
            if (th_timer) {
                clearTimeout(th_timer);
                th_timer = 0;
            }
        }
        return f;
    };

    //没有保存，直接刷新或者跳到其他地址，提示用户
    _pro.__beforeExit = function(_event){
        if (this.__modifyState == this.__STAT.DIRTY){
            _event.returnValue = "有修改未保存，如果继续，将丢失未保存的内容，是否继续？";
        }
    }

    //修改操作按钮的可操作状态，防止用户重复点击, enable, disable
    _pro.__setBtnStatus = function(_status){
        if (_status == 'enable') {
            this.__allBtns._$forEach(function(_node){
                _node.removeAttribute('disabled');
            });
        }else{
            this.__allBtns._$attr('disabled','disabled');
        }

    }

    new _p._$$PurchaseManager();
});
