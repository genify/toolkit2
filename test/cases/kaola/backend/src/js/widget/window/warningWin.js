/**
 * Created by zmm on 21/11/14.
 * 确认/警告弹窗
 */
NEJ.define([
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}ui/layer/window.js'
], function () {
    var _p = NEJ.P('haitao.bw'),    // widget namespace
        _pro;                       // class prototype

    _p._$$WarningWindow = NEJ.C();
    _pro = _p._$$WarningWindow._$extend(nej.ui._$$Window);

    /**
     *
     * @param _options  配置参数
     * @property    parent      父节点
     * @property    mask        bool:是否添加蒙层，String:添加蒙层的class样式
     * @property    title       text/html/null:为空时不显示标题
     * @property    draggable   bool:是否可拖动位置
     * @property    content     text/html:弹窗内容
     * @property    onlyclosebtn   bool:是否在footer上只显示关闭按钮
     * @property    hideOnok    bool:点击确定按钮时 是否隐藏弹窗
     * @private
     */
    _pro.__reset = function(_options) {
        this.__super(_options);
        if (!!_options.title) {
            this.__title.innerHTML = _options.title;
        } else {
            nej.e._$setStyle(this.__title, 'display', 'none');
        }

        this.__content.innerHTML = _options.content;
        //设置是否在点击OK时自动隐藏，如果设置为true,那么需要手工在onok事件中隐藏对话
        this.__hideOnok = !!_options.hideOnok;
        if (!!_options.onlyclosebtn) {
            nej.e._$remove(this.__okBtn);
            this.__ccBtn.value = "关闭"
        }
    };

    /**
     * 初始化自定义html及css内容
     * @private
     */
    _pro.__initXGui = function() {
        this.__super();

        this.__seed_html = nej.e._$addNodeTemplate('<div class="w-winmodule">\
            <div class="header ztag"></div>\
            <div class="content ztag">\
            </div>\
            <div class="footer">\
                <input type="button" value="确定" class="w-btn w-btn-blue ztag">\
                <input type="button" value="取消" class="w-btn w-btn-white ztag">\
            </div></div>');

    };
    /**
     * 初始化节点信息 添加节点事件
     * @private
     */
    _pro.__initNode = function() {
        nej.ui._$$Layer._$supro.__initNode.call(this);

        var _nodeList = nej.e._$getByClassName(this.__body, 'ztag'), i=0;
        this.__dopt.mbar = this.__title = _nodeList[i++];
        this.__content = _nodeList[i++];
        this.__okBtn = _nodeList[i++];
        this.__ccBtn = _nodeList[i++];
        this.__dopt.body = this.__body;
        nej.v._$addEvent(this.__okBtn, 'click', this.__onOK._$bind(this));
        nej.v._$addEvent(this.__ccBtn, 'click', this.__onCC._$bind(this));
    };

    /**
     * 点击"确定"按钮事件响应
     * */
    _pro.__onOK = function(_event) {
        if (this.__hideOnok) {
            this._$hide();
        };
        this._$dispatchEvent('onok', this.__body);
    };

    /**
     * 点击"取消"按钮事件响应
     * */
    _pro.__onCC = function(_event) {
        this._$hide();
        this._$dispatchEvent('oncc', this.__body);
    };

    _pro._$getBody = function() {
        return this.__body;
    };


});
