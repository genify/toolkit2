/**
 * 公用动画效果
 * Created by zmm on 28/11/14.
 */
NEJ.define([
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}util/animation/linear.js'
], function () {
    var _p = NEJ.P('haitao.bwg');    // widget namespace

    /**
     * 内容显示与隐藏 伸缩效果
     * @param _options
     *        element   隐藏的内容块节点
     *        show      bool:显示/隐藏
     *        onShowBeginFunc func:显示动画开始时执行
     *        onHideEndFunc func:隐藏动画结束时执行
     * @private
     */
    _p._$showToggle = function(_options) {
        var _ele = _options.element;
        if (!!_options.show) {
            !!(_options.onShowBeginFunc) && _options.onShowBeginFunc();
            if (!_ele) {
                return;
            }
            nej.e._$setStyle(_ele, 'position', 'absolute');
            nej.e._$setStyle(_ele, 'opacity', 0);

            var _eleHeight = _ele.clientHeight;
            var _linear = nej.ut._$$AnimLinear._$allocate({
                from:{
                    offset: 0
                },
                to:{
                    offset: _eleHeight
                },
                duration:600,
                onupdate:function(_event){
                    nej.e._$setStyle(_ele, 'overflow', 'hidden');
                    nej.e._$setStyle(_ele, 'height', _event.offset + 'px');
                    nej.e._$setStyle(_ele, 'opacity', _event.offset*2/_eleHeight);
                    nej.e._$setStyle(_ele, 'position', 'relative');
                },
                onstop:function(_event){
                    this._$recycle();
                    nej.e._$attr(_ele, 'style', '');
                }
            });
            _linear._$play();
        } else {
            if (!_ele) {
                !!(_options.onHideEndFunc) && _options.onHideEndFunc();
                return;
            }
            var _eleHeight = _ele.clientHeight;
            var _linear = nej.ut._$$AnimLinear._$allocate({
                from:{
                    offset: _eleHeight
                },
                to:{
                    offset: 0
                },
                duration:600,
                onupdate:function(_event){
                    nej.e._$setStyle(_ele, 'overflow', 'hidden');
                    nej.e._$setStyle(_ele, 'height', _event.offset + 'px');
                    nej.e._$setStyle(_ele, 'opacity', _event.offset/_eleHeight);
                },
                onstop:function(_event){
                    this._$recycle();
                    !!(_options.onHideEndFunc) && _options.onHideEndFunc();
                    nej.e._$attr(_ele, 'style', '');
                }
            });
            _linear._$play();
        }
    }
});
