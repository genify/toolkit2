/**
 * 用户权限管理
 * Created by zmm on 17/11/14.
 */
NEJ.define('{pro}module/security/userManage.js', [
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{pro}widget/window/warningWin.js',
    '{pro}widget/animation.js',
    'pro/widget/module'
], function() {
    var _p = NEJ.P('haitao.bw'),    // widget namespace
        _pro;                       // class prototype

    _p._$$UserManage = NEJ.C();
    _pro = _p._$$UserManage._$extend(NEJ.P('haitao.bw')._$$MModule);

    /**
     * 初始化，绑定事件
     * @private
     */
    _pro.__init = function () {
        this.__super();
        this.__addUserBox = nej.e._$get('J-addUserBox');
        this.__userForm = nej.e._$get('J-userForm');

        var _addBoxHideBtn =  nej.e._$getByClassName(this.__addUserBox, 'js-minimize');
        if (_addBoxHideBtn.length > 0) {
            nej.v._$addEvent(_addBoxHideBtn[0], 'click', this.__onShowAddUserBox._$bind(this, _addBoxHideBtn[0], ''));
        }

        // 账户修改 事件
        var _updateBtnList = nej.e._$getByClassName('J-userTable', 'zupbtn');
        nej.u._$forEach(_updateBtnList, function (_element) {
            nej.v._$addEvent(_element, 'click', this.__onShowUpdateUserBox._$bind(this, true, _element));
        }, this);
        // 账户删除 事件
        var _delBtnList = nej.e._$getByClassName('J-userTable', 'zdelbtn');
        nej.u._$forEach(_delBtnList, function (_element) {
            nej.v._$addEvent(_element, 'click', this.__onDeleteUserClick._$bind(this, _element));
        }, this);

        // 新建用户 类型修改 事件
        var _typeList = nej.e._$getByClassName(this.__userForm,'zradio');
        nej.u._$forEach(_typeList, function (_element) {
            nej.v._$addEvent(_element, 'click', this.__onUserTypeChanged._$bind(this));
        }, this);
        // 新建用户
        nej.v._$addEvent(this.__userForm['submitbutton'], 'click', this.__onAddUserClick._$bind(this));

        this.__initUpdateBox();
        this.__onShowAddUserBox(null, false);
    };
    /**
     * 修改用户信息窗口 节点初始化
     * @private
     */
    _pro.__initUpdateBox = function() {
        this.__updateForm = nej.e._$get('J-updateForm');
        nej.v._$addEvent(this.__updateForm['canclepsw'], 'click', this.__showUpdatePassword._$bind(this, false));
        nej.v._$addEvent(this.__updateForm['updatepsw'], 'click', this.__showUpdatePassword._$bind(this, true));
        nej.v._$addEvent(this.__updateForm['resetpsw'], 'click', this.__onResetPwdClick._$bind(this));
        nej.v._$addEvent(this.__updateForm['updatebutton'], 'click', this.__onUpdateUserClick._$bind(this));
        nej.v._$addEvent(this.__updateForm['cancleupbutton'], 'click', this.__onShowUpdateUserBox._$bind(this, false, null));
    };
    /**
     * 修改用户信息窗口 节点重置
     * @private
     */
    _pro.__resetUpdateBox = function() {
        this.__showUpdatePassword(false);
        nej.e._$addClassName('J-updateErrorInfo', 'f-hide');
        var _roleListNode = nej.e._$getByClassName('J-updateRoleListBox', 'zchk');
        nej.u._$forEach(_roleListNode, function (_chk) {
            _chk.checked = false;
        });
    };
    /**
     * 修改用户信息窗口 显示用户密码
     * @param _show
     * @private
     */
    _pro.__showUpdatePassword = function(_show) {
        this.__updateForm['newpassword'].value = '';
        nej.e._$setStyle(this.__updateForm['newpassword'], 'display', _show ? '' : 'none');
        nej.e._$setStyle(this.__updateForm['canclepsw'], 'display', _show ? '' : 'none');
        nej.e._$setStyle(this.__updateForm['updatepsw'], 'display', _show ? 'none' : '');
        nej.e._$setStyle(this.__updateForm['resetpsw'], 'display', _show ? 'none' : '');
    };
    /**
     * 新建用户窗口
     * 用户type修改,控制界面显示  1：用户名密码，2：urs账号，3：corp账号
     * @private
     */
    _pro.__onUserTypeChanged = function () {
        var _pswBox = this.__userForm['password'].parentNode;
        if (this.__userForm['usertype'].value == '1') {
            //注册用户不需要填写密码,后台自动生成随机密码,并发邮件给用户.
            nej.e._$attr(_pswBox, 'style', 'display:none');
        } else {
            nej.e._$attr(_pswBox, 'style', 'display:none');
        }
    };
    /**
     * 添加用户窗口 点击显示和隐藏
     * @param _element  点击隐藏的button.js-minimize
     * @param _show     _element为空时，判断show
     * @private
     */
    _pro.__onShowAddUserBox = function(_element, _show) {
        var _this = this;
        if ((_element && nej.e._$hasClassName(this.__addUserBox, 'js-minus')) || !!_show) {
            NEJ.P('haitao.bwg')._$showToggle({
                show: true,
                element: nej.e._$getByClassName(_this.__addUserBox, 'detail')[0],
                onShowBeginFunc: function(){
                    nej.e._$delClassName(_this.__addUserBox, 'js-minus');
                }
            });
        } else {
            NEJ.P('haitao.bwg')._$showToggle({
                show: false,
                element: nej.e._$getByClassName(_this.__addUserBox, 'detail')[0],
                onHideEndFunc: function(){
                    nej.e._$addClassName(_this.__addUserBox, 'js-minus');
                }
            });
        }
    };
    /**
     * 点击修改用户信息 显示编辑窗口
     * @param _show     是否显示
     * @param _element  点击修改的button
     * @private
     */
    _pro.__onShowUpdateUserBox = function(_show, _element) {
        if (_show) {
            window.scrollTo(0,0);
            nej.e._$setStyle(this.__addUserBox, 'display', 'none');
            this.__resetUpdateBox();
            nej.e._$setStyle('J-updateUserBox', 'display', '');
            this.__updateForm['username'].value = nej.e._$attr(_element, 'data-name-value');
            this.__updateForm['userid'].value = nej.e._$attr(_element, 'data-id-value');
            this.__updateForm['newuserstate'].value = nej.e._$attr(_element, 'data-status-value');
            this.__updateForm['personname'].value = nej.e._$attr(_element, 'data-pname-value');
            this.__updateForm['resetpsw'].value = nej.e._$attr(_element, 'data-id-value');
            this.__updateForm['popo'].value = nej.e._$attr(_element, 'data-popo-value');
            this.__updateForm['phone'].value = nej.e._$attr(_element, 'data-phone-value');
            this.__updateForm['desc'].value = nej.e._$attr(_element, 'data-desc-value');
            var _roleIds = nej.e._$attr(_element, 'data-roles-value');
            var roleIdArray = _roleIds.split(',');
            var _roleListNode = nej.e._$getByClassName('J-updateRoleListBox', 'zchk');

            for (var i = 0; i < roleIdArray.length; i++) {
                nej.u._$forEach(_roleListNode, function (_chk) {
                    if (nej.e._$attr(_chk, 'data-id-value') == roleIdArray[i]) {
                        _chk.checked = true;
                    }
                });
            }
        } else {
            nej.e._$setStyle(this.__addUserBox, 'display', '');
            nej.e._$setStyle('J-updateUserBox', 'display', 'none');
        }
    };
    /**
     * 点击添加用户  发送dwr
     * @private
     */
    _pro.__onAddUserClick = function () {
        var _errorBox = nej.e._$get('J-errorInfo');
        if (this.__userForm['username'].value.trim().length == 0) {
            this.__userForm['username'].value = '';
            this.__userForm['username'].focus();
            _errorBox.innerHTML = '请输入用户名';
            nej.e._$delClassName(_errorBox, 'f-hide');
            return;
        }
        //添加新用户, 密码不需要做js校验.
        /*if (this.__userForm['password'].value.trim().length == 0) {
            this.__userForm['password'].value = '';
            this.__userForm['password'].focus();
            _errorBox.innerHTML = '请输入密码';
            nej.e._$delClassName(_errorBox, 'f-hide');
            return;
        }*/
        if (this.__userForm['phone'].value.length > 0) {
            var _res = /^1\d{10}$/g.test(this.__userForm['phone'].value);
            if (!_res) {
                _errorBox.innerHTML = '手机号格式有误';
                this.__userForm['phone'].focus();
                nej.e._$delClassName(_errorBox, 'f-hide');
                return;
            }
        }

        var _roleListNode = nej.e._$getByClassName('J-roleListBox', 'zchk');
        var _roleStr = '';
        nej.u._$forEach(_roleListNode, function (_chk) {
            if (_chk.checked) {
                _roleStr += nej.e._$attr(_chk, 'data-id-value') + ',';
            }
        });
        if (_roleStr=='') {
            _errorBox.innerHTML = '请选择至少一个角色';
            nej.e._$delClassName(_errorBox, 'f-hide');
            return;
        }
        _errorBox.innerHTML = '';
        nej.e._$addClassName(_errorBox, 'f-hide');
        var _param = {};
        _param.name = this.__userForm['username'].value;
        _param.password = this.__userForm['password'].value;
        _param.type = parseInt(this.__userForm['usertype'].value);
        _param.personName = this.__userForm['personname'].value;
        _param.popo = this.__userForm['popo'].value;
        _param.telphone = this.__userForm['phone'].value;
        _param.desc = this.__userForm['desc'].value;
        _param.roleIds = _roleStr;
        nej.j._$haitaoDWR(
            'BackendSecurityBean',
            'addUser',
            [_param],
            function(_res){
                if (_res == 1) {
                    alert("添加成功");
                    location.reload();
                } else if(_res == -4) {
                    alert('添加失败：部分角色不存在');
                } else if(_res == -6) {
                    alert('添加失败：此用户名已经存在，不能重复添加');
                } else {
                    alert("添加失败，错误码：" + _res);
                }
            }
        );
    };
    /**
     * 点击修改用户信息 发送dwr
     * @private
     */
    _pro.__onUpdateUserClick = function () {
        var _errorBox = nej.e._$get('J-updateErrorInfo');
        var _roleListNode = nej.e._$getByClassName('J-updateRoleListBox', 'zchk');
        var _roleStr = '';
        nej.u._$forEach(_roleListNode, function (_chk) {
            if (_chk.checked) {
                _roleStr += nej.e._$attr(_chk, 'data-id-value') + ',';
            }
        });
        if (_roleStr=='') {
            _errorBox.innerHTML = '请选择至少一个角色';
            nej.e._$delClassName(_errorBox, 'f-hide');
            return;
        }
        if (this.__updateForm['phone'].value.length > 0) {
            var _res = /^1\d{10}$/g.test(this.__updateForm['phone'].value);
            if (!_res) {
                _errorBox.innerHTML = '手机号格式有误';
                this.__updateForm['phone'].focus();
                nej.e._$delClassName(_errorBox, 'f-hide');
                return;
            }
        }

        nej.j._$haitaoDWR(
            'BackendSecurityBean',
            'updateUser',
            [parseInt(this.__updateForm['userid'].value),
                _roleStr,
                this.__updateForm['newpassword'].value.trim(),
                parseInt(this.__updateForm['newuserstate'].value),
                this.__updateForm['popo'].value,
                this.__updateForm['phone'].value,
                this.__updateForm['desc'].value,
                this.__updateForm['personname'].value
            ],
            function(_res){
                if (_res) {
                    alert('修改成功');
                    location.reload();
                } else {
                    alert('修改失败：' + _res);
                }
            })
    }
    /**
     * 点击删除用户  发送dwr
     * @param _element  点击删除的button
     * @private
     */
    _pro.__onDeleteUserClick = function (_element) {
        var _id = parseInt(nej.e._$attr(_element, 'data-id-value'));
        //删除确认弹窗
        var _delDialog = haitao.bw._$$WarningWindow._$allocate({
            parent: document.body,
            content: '<p style="padding: 20px;">确认删除该用户？</p>',
            hideOnok: true,
            mask: 'w-winmask',
            onok: function(){
                nej.j._$haitaoDWR(
                    'BackendSecurityBean',
                    'deleteUser',
                    [_id],
                    function (_res) {
                        if (_res) {
                            alert('删除成功');
                            location.reload();
                        } else {
                            alert('删除失败：' + _res);
                        }
                    }
                )
            }
        });
        _delDialog._$show();

    };

    /**
     * 点击删除用户  发送dwr
     * @param _element  点击删除的button
     * @private
     */
    _pro.__onResetPwdClick = function (element) {

        var _id = parseInt(this.__updateForm['resetpsw'].value);
        var username = this.__updateForm['username'].value;
        var text = "确认重置【" + username + "】的密码?"

        //删除确认弹窗
        var _resetPwdDialog = haitao.bw._$$WarningWindow._$allocate({
            parent: this.__updateForm,
            content: '<p style="padding: 20px;">'+ text + '</p>',
            hideOnok: true,
            mask: 'w-winmask',
            onok: function(){
                nej.j._$haitaoDWR(
                    'BackendSecurityBean',
                    'resetPassword4User',
                    [_id],
                    function (_res) {
                        if (_res) {
                            alert('密码重置成功!');
                            location.reload();
                        } else {
                            alert('密码重置失败：' + _res);
                        }
                    }
                )
            }
        });
        _resetPwdDialog._$show();

    };

    new _p._$$UserManage();
});