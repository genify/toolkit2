/**
 * 资源管理
 * Created by zmm on 17/11/14.
 */
NEJ.define('{pro}module/security/resourceManage.js',[
    '{lib}util/chain/chainable.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{pro}widget/window/warningWin.js',
    '{pro}widget/animation.js',
    'pro/widget/module'
], function () {
    var _p = NEJ.P('haitao.bw'),    // widget namespace
        _pro;                       // class prototype

    _p._$$ResourceManage = NEJ.C();
    _pro = _p._$$ResourceManage._$extend(NEJ.P('haitao.bw')._$$MModule);

    /**
     * 初始化，绑定事件
     * @private
     */
    _pro.__init = function () {
        this.__super();
        this.__addResourceBox = nej.e._$get('J-addResourceBox');
        this.__resourceForm = nej.e._$get('J-resourceForm');
        // add窗口最小化 事件
        var _addBoxHideBtn =  nej.e._$getByClassName(this.__addResourceBox, 'js-minimize');
        if (_addBoxHideBtn.length > 0) {
            nej.v._$addEvent(_addBoxHideBtn[0], 'click', this.__onShowAddResourceBox._$bind(this, _addBoxHideBtn[0], ''));
        }
        // 模块ID修改 事件
        var _typeList = nej.e._$getByClassName(this.__resourceForm,'zradio');
        nej.u._$forEach(_typeList, function (_element) {
            nej.v._$addEvent(_element, 'click', this.__onResourceTypeChanged._$bind(this));
        }, this);
        nej.v._$addEvent(this.__resourceForm['submitbutton'], 'click', this.__onAddResourceClick._$bind(this));
        nej.v._$addEvent(this.__resourceForm['updatebutton'], 'click', this.__onUpdateResourceClick._$bind(this));
        nej.v._$addEvent(this.__resourceForm['cancleupbutton'], 'click', this.__onCancleUpdateClick._$bind(this));

        // 资源修改 事件
        var _updateBtnList = nej.e._$getByClassName('J-resourceList', 'zupbtn');
        nej.u._$forEach(_updateBtnList, function (_element) {
            nej.v._$addEvent(_element, 'click', this.__onShowUpdateResourceBox._$bind(this, _element));
        }, this);
        // 资源删除 事件
        var _delBtnList = nej.e._$getByClassName('J-resourceList', 'zdelbtn');
        nej.u._$forEach(_delBtnList, function (_element) {
            nej.v._$addEvent(_element, 'click', this.__onDeleteResourceClick._$bind(this, _element));
        }, this);
        // 模块隐藏与显示
        var _hideChkList = nej.e._$getByClassName('J-resourceList', 'zhide-chk');
        nej.u._$forEach(_hideChkList, function(_element) {
            nej.v._$addEvent(_element, 'click', function(){
                var _pEle = nej.$(_element)._$parent('fieldset', true);
                if (_pEle.length == 0) return;
                if (_element.checked == true) {
                    nej.e._$addClassName(_pEle[0], 'js-hide');
                } else {
                    nej.e._$delClassName(_pEle[0], 'js-hide');
                }
            })
        })
    };
    /**
     * 资源类型 值修改时 控制模块ID的显示与隐藏
     * @private
     */
    _pro.__onResourceTypeChanged = function() {
        var _moduleIDBox = this.__resourceForm['moduleId'].parentNode;
        var _urlBox = this.__resourceForm['url'].parentNode;
        if (this.__resourceForm['resourcetype'].value == '1') {
            nej.e._$setStyle(_moduleIDBox, 'display', 'none');
            nej.e._$setStyle(_urlBox, 'display', 'none');
        } else {
            nej.e._$setStyle(_moduleIDBox, 'display', '');
            nej.e._$setStyle(_urlBox, 'display', '');
        }
    };
    /**
     * 添加窗口 点击显示和隐藏
     * @param _element  点击隐藏的button.js-minimize
     * @param _show     _element 不存在时，使用_show 字段判断是否显示
     * @private
     */
    _pro.__onShowAddResourceBox = function(_element, _show) {
        var _this = this;
        if (( !!_element && nej.e._$hasClassName(this.__addResourceBox, 'js-minus')) || _show) {
            nej.e._$delClassName(this.__addResourceBox, 'js-minus');
            NEJ.P('haitao.bwg')._$showToggle({
                show: true,
                element: nej.e._$getByClassName(_this.__addResourceBox, 'detail')[0],
                onShowBeginFunc: function(){
                    nej.e._$delClassName(_this.__addResourceBox, 'js-minus');
                }
            });
        } else {
            NEJ.P('haitao.bwg')._$showToggle({
                show: false,
                element: nej.e._$getByClassName(_this.__addResourceBox, 'detail')[0],
                onHideEndFunc: function(){
                    nej.e._$addClassName(_this.__addResourceBox, 'js-minus');
                }
            });
        }
    };
    /**
     * 点击添加资源 发送dwr
     * @private
     */
    _pro.__onAddResourceClick = function () {
        var _errorBox = nej.e._$get('J-errorInfo');
        var _param = {};
        _param.type = parseInt(this.__resourceForm['resourcetype'].value);
        _param.moduleId = parseInt(this.__resourceForm['moduleId'].value);
        _param.url = this.__resourceForm['url'].value;
        if (_param.type != 1 && _param.moduleId == 0) {
            _errorBox.innerHTML = '请选择一个模块';
            nej.e._$delClassName(_errorBox, 'f-hide');
            this.__resourceForm['moduleId'].focus();
            return;
        }
        if (_param.url.trim().length==0 && _param.type != 1) {
            _errorBox.innerHTML = '请输入url';
            nej.e._$delClassName(_errorBox, 'f-hide');
            this.__resourceForm['url'].focus();
            return;
        }
        _param.name = this.__resourceForm['resourcename'].value;
        _param.description = this.__resourceForm['desc'].value;
        _param.indexes = parseInt(this.__resourceForm['sortnum'].value);

        nej.j._$haitaoDWR(
            'BackendSecurityBean',
            'addBackendResource',
            [_param],
            function (_res) {
                if (_res == 1) {
                    alert("添加成功");
                    location.reload();
                } else {
                    alert("添加失败:" +_res);
                }
            }
        );
    };
    /**
     * 显示修改资源窗口
     * 在添加资源窗口上修改部分节点。
     * @param _element  点击修改的button节点，节点不存在则隐藏窗口
     * @private
     */
    _pro.__onShowUpdateResourceBox = function (_element) {
        var _show = false;
        if (!!_element) {
            _show = true;
            this.__onShowAddResourceBox(null, true);
        }
        var _headEle = nej.e._$getByClassName(this.__addResourceBox,'js-head');
        if (_headEle.length > 0) {
            _headEle[0].innerHTML = _show? "编辑资源信息" : "添加资源";
        }
        nej.e._$setStyle(this.__resourceForm['submitbutton'], 'display', _show? 'none': '');
        nej.e._$setStyle(this.__resourceForm['updatebutton'], 'display', _show? '' : 'none');
        nej.e._$setStyle(this.__resourceForm['cancleupbutton'], 'display', _show? '': 'none');

        if (_show) {
            window.scrollTo(0,0);
            this.__resourceForm['sortnum'].value = nej.e._$attr(_element, 'data-index-value');
            this.__resourceForm['resourceid'].value = nej.e._$attr(_element, 'data-id-value');
            this.__resourceForm['resourcename'].value = nej.e._$attr(_element, 'data-name-value');
            this.__resourceForm['url'].value = nej.e._$attr(_element, 'data-url-value');
            this.__resourceForm['moduleId'].value = nej.e._$attr(_element, 'data-mid-value');
            this.__resourceForm['resourcetype'].value = nej.e._$attr(_element, 'data-type-value');
            this.__resourceForm['desc'].value = nej.e._$attr(_element, 'data-desc-value');
        } else {
            this.__resourceForm['sortnum'].value = "0";
            this.__resourceForm['resourceid'].value = "";
            this.__resourceForm['resourcename'].value = "";
            this.__resourceForm['url'].value = "";
            this.__resourceForm['moduleId'].value = "0";
            this.__resourceForm['resourcetype'].value = "2";
            this.__resourceForm['desc'].value = "";
        }
        nej.e._$addClassName('J-errorInfo', 'f-hide');
        this.__onResourceTypeChanged();
    };
    /**
     * 取消修改资源
     * @private
     */
    _pro.__onCancleUpdateClick = function () {
        this.__onShowUpdateResourceBox('');
        this.__onShowAddResourceBox(null, false);
    };

    /**
     * 点击确认修改  发送dwr
     * @private
     */
    _pro.__onUpdateResourceClick = function () {
        var _errorBox = nej.e._$get('J-errorInfo');
        var _param = {};
        _param.type = parseInt(this.__resourceForm['resourcetype'].value);
        _param.moduleId = parseInt(this.__resourceForm['moduleId'].value);
        _param.url = this.__resourceForm['url'].value;
        if (_param.type != 1 && _param.moduleId == 0) {
            _errorBox.innerHTML = '请选择一个模块';
            nej.e._$delClassName(_errorBox, 'f-hide');
            return;
        }
        if (_param.url.trim().length==0 && _param.type != 1) {
            _errorBox.innerHTML = '请输入url';
            nej.e._$delClassName(_errorBox, 'f-hide');
            return;
        }

        _param.indexes = parseInt(this.__resourceForm['sortnum'].value);
        _param.id = this.__resourceForm['resourceid'].value;
        _param.name = this.__resourceForm['resourcename'].value;
        _param.description = this.__resourceForm['desc'].value;

        nej.j._$haitaoDWR(
            'BackendSecurityBean',
            'updateBackendResource',
            [_param],
            function(_res) {
                if (_res == 1) {
                    alert("修改成功");
                    location.reload();
                } else {
                    alert("修改失败：" + _res);
                }
            }
        );
    };
    /**
     * 点击删除资源 发送dwr
     * @private
     */
    _pro.__onDeleteResourceClick = function (_element) {
        var _id = parseInt(nej.e._$attr(_element, 'data-id-value'));
        //删除确认弹窗
        var _delDialog = haitao.bw._$$WarningWindow._$allocate({
            parent: document.body,
            content: '<p style="padding: 20px;">确认删除该资源？</p>',
            hideOnok: true,
            mask: 'w-winmask',
            onok: function(){
                nej.j._$haitaoDWR(
                    'BackendSecurityBean',
                    'deleteResource',
                    [_id],
                    function (_res) {
                        if (_res) {
                            alert('删除成功');
                            location.reload();
                        } else {
                            alert('删除失败');
                        }
                    }
                )
            }
        });
        _delDialog._$show();

    };

    new _p._$$ResourceManage();
});
