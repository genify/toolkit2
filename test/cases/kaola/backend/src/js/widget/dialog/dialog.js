/**
 * ====================================================
 * 确认框窗体逻辑实现文件
 *
 * @author hzjiangren@corp.netease.com
 * @author hzliuxinqi@corp.netease.com
 * ===================================================
 * */
define('{pro}widget/dialog/dialog.js', ['{lib}ui/layer/window.js',
    '{lib}util/chain/chainable.js',
    '{lib}ui/mask/mask.js',
    'text!../../../css/module/dialog.css'
], function(_w, _q, _m, _css) {

    var _p = NEJ.P('haitao.bw'),
        _pro;

    _p._$$Dialog = NEJ.C();
    _pro = _p._$$Dialog._$extend(nej.ui._$$Window);

    _pro.__reset = function(_options) {
        if (!_options.mask) {
            _options.mask = _m._$$Mask._$allocate({
                parent: document.body,
                content: '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.1)"></div>'
            });
            _options.mask._$hide();
        }
        this.__super(_options);

        this.__title.innerHTML = _options.title;
        this.__content.innerHTML = _options.content;
        //设置是否在点击OK时自动隐藏，如果设置为true,那么需要手工在onok事件中隐藏对话
        this.__hideOnok = !!_options.hideOnok;
        //重置后，触发initContent事件，来初始化参数中的content内容
        this._$dispatchEvent('initContent', this.__body);
    };


    _pro.__initXGui = function() {
        this.__super();

        this.__cssId = nej.e._$pushCSSText(_css);
        nej.e._$dumpCSSText();
        this.__seed_html = nej.e._$addNodeTemplate('<div class="title">\
            </div>\
            <div class="content">\
            </div>\
            <div class="controls">\
                    <span class="f-warn alert-text"></span>\
                    <input type="button" value="确定" class="w-btn w-btn-blue ok">\
                <input type="button" value="取消" class="w-btn w-btn-blue cc">\
            </div>');

    };

    _pro.__initNode = function() {
        nej.ui._$$Layer._$supro.__initNode.call(this);

        this.__dopt.mbar = this.__title = _q('.title', this.__body)[0];
        this.__content = _q('.content', this.__body)[0];
        _q(this.__body)._$addClassName(this.__cssId);
        this.__controls = _q('.controls', this.__body)[0];
        this.__okBtn = _q('.ok', this.__controls);
        this.__ccBtn = _q('.cc', this.__controls);
        this.__dopt.body = this.__body;
        this.__okBtn._$on('click', this.__onOK._$bind(this));
        this.__ccBtn._$on('click', this.__onCC._$bind(this));
    };

    /**
     * 点击"确定"按钮事件响应
     * */
    _pro.__onOK = function(_event) {
        nej.v._$stop(_event);
        if (this.__hideOnok) {
            this._$hide();
        };
        this._$dispatchEvent('onok', this.__body);
    };

    /**
     * 点击"取消"按钮事件响应
     * */
    _pro.__onCC = function(_event) {
        nej.v._$stop(_event);
        this._$hide();
        this._$dispatchEvent('oncc', this.__body);
    };

    _pro._$getBody = function() {
        return this.__body;
    };


});
