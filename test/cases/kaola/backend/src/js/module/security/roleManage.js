/**
 * Created by zmm on 21/11/14.
 */
NEJ.define('{pro}module/security/roleManage.js', [
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{pro}widget/window/warningWin.js',
    'pro/widget/module'
], function () {
    var _p = NEJ.P('haitao.bw'),    // widget namespace
        _pro;                       // class prototype

    _p._$$RoleManage = NEJ.C();
    _pro = _p._$$RoleManage._$extend(NEJ.P('haitao.bw')._$$MModule);

    /**
     * 初始化，绑定事件
     * @private
     */
    _pro.__init = function () {
        this.__super();
        var _delList = nej.e._$getByClassName('J-roleTable', 'zdelbtn');
        nej.u._$forEach(_delList, function(_ele) {
            nej.v._$addEvent(_ele, 'click', this.__onDeleteRoleClick._$bind(this, _ele));
        }, this);
    };

    /**
     * 点击删除角色
     * @param _id  角色id
     * @private 对外接口。角色管理页面点击删除
     */
    _pro.__onDeleteRoleClick = function (_ele) {
        var _id = nej.e._$attr(_ele, 'data-id-value');
        //删除确认弹窗
        var _delDialog = haitao.bw._$$WarningWindow._$allocate({
            parent: document.body,
            content: '<p style="padding: 20px;">确认删除该角色？</p>',
            hideOnok: true,
            mask: 'w-winmask',
            onok: function(){
                nej.j._$haitaoDWR(
                    'BackendSecurityBean',
                    'deleteRole',
                    [_id],
                    function (_res) {
                        if (_res) {
                            alert('删除成功');
                            location.reload();
                        } else {
                            alert('删除失败:' + _res);
                        }
                    }
                )
            }
        });
        _delDialog._$show();

    };
    new _p._$$RoleManage();
});
