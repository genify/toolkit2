/**
 * 后台角色管理
 * Created by zmm on 17/11/14.
 */
NEJ.define('{pro}module/security/roleEdit.js', [
    '{lib}util/chain/chainable.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    'pro/widget/module'
], function () {
    var _p = NEJ.P('haitao.bw'),    // widget namespace
        _pro;                       // class prototype

    _p._$$RoleEdit = NEJ.C();
    _pro = _p._$$RoleEdit._$extend(NEJ.P('haitao.bw')._$$MModule);

    /**
     * 初始化，绑定事件
     * @private
     */
    _pro.__init = function () {
        this.__super();
        this.__roleForm = nej.e._$get('J-roleForm');

        var _this = this;
        nej.$('#J-roleResouceList .zp-chk')._$forEach(function(_chk) {
            nej.v._$addEvent(_chk, 'click', _this.__onSelectAllChildren._$bind(_this, _chk));
        });
        nej.v._$addEvent(this.__roleForm['submitbutton'], 'click', this.__onAddRoleClick._$bind(this));
        nej.v._$addEvent(this.__roleForm['updatebutton'], 'click', this.__onUpdateRoleClick._$bind(this));
    };
    /**
     * 资源列表 父级模块选中时 自动勾选模块子列表
     * @param _ele
     * @private
     */
    _pro.__onSelectAllChildren = function(_ele) {
        var _state = (_ele.checked == true);

        var _pEle = nej.$(_ele)._$parent('fieldset', true);
        if (_pEle.length == 0) return;
        var _eleList = nej.e._$getByClassName(_pEle[0], 'zchk');
        nej.u._$forEach(_eleList,function (_chk) {
            _chk.checked = _state;
        });

    };
    /**
     * 点击添加角色
     * @private
     */
    _pro.__onAddRoleClick = function() {
        var _param = {};
        _param.name = this.__roleForm['rolename'].value;
        _param.description = this.__roleForm['desc'].value;
        _param.resourceIds =  this.__getSelectedResourceList();
        nej.j._$haitaoDWR(
            'BackendSecurityBean',
            'addRole',
            [_param],
            function(_res) {
                if (_res == 1) {
                    alert("添加成功");
                    window.close();
                }else if (_res == -2) {
                    alert("添加失败：已存在相同名字的角色");
                }else {
                    alert("添加失败：" + _res);
                }
            }
        );
    };
    /**
     * 点击确认修改角色  发送dwr
     * @private
     */
    _pro.__onUpdateRoleClick = function () {
        var _param = {};
        _param.id = parseInt(this.__roleForm['roleid'].value);
        _param.name = this.__roleForm['rolename'].value;
        _param.description = this.__roleForm['desc'].value;
        _param.resourceIds = this.__getSelectedResourceList();
        nej.j._$haitaoDWR(
            'BackendSecurityBean',
            'updateRole',
            [_param],
            function(_res) {
                if (_res == 1) {
                    alert("修改成功");
                    window.close();
                }else if(_res == -98) {
                    alert("修改失败：已存在同样名字的角色");
                }else {
                    alert("修改失败：" + _res);
                }
            }
        );
    };
    /**
     * 获取选择的资源列表
     * @returns {string}
     * @private
     */
    _pro.__getSelectedResourceList = function() {
        var _resourceIdList='';
        var _chkList = nej.$('#J-roleResouceList .zchk:checked');

        nej.u._$forEach(_chkList, function(_ele){
            _resourceIdList += nej.e._$attr(_ele, 'data-id-value') +',';
        });
        return _resourceIdList;
    }

    new _p._$$RoleEdit();
});
