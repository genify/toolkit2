/**
 * 时效管理 物流时效设置页面
 * Created by luzhongfang on 2015/05/16.
 */

NEJ.define([
	'base/klass', 
    'base/element',
    'base/event',
    'util/chain/NodeList',
    'pro/base/util',
    'pro/base/request',
    'pro/widget/module',
    'pro/base/config',
    'pro/components/dw/lanTouList',
    'pro/components/dw/tuoTouList',
    'pro/components/inventory4detail/mailUserList',
    'pro/components/modal/newLogisticRule/newLogisticRule',
    'pro/components/modal/newLogistics/newLogistics',
    'pro/components/modal/newMailUser/newMailUser'
], function(k,e, v, $,_,request,Mdl,config,LanTouList,TuoTouList,mailUserList,newRuleModal,newLogisModal,newMailUser,p,o,f,r,pro) {
	
    p._$$Module = k._$klass();
    pro = p._$$Module._$extend(Mdl._$$MModule);

    pro.__init = function(_options){
		this.__super(_options);
        // 揽投列表
        this.__ltList = new LanTouList({data:{}});
        this.__ltList.$inject(e._$get('list1'));
        // 妥投列表
        this.__ttList = new TuoTouList({data:{}});
        this.__ttList.$inject(e._$get('list2'));
        // 物流预警收件人列表,warningType用于区别是物流时效管理页还是补货周期设置
        this.__weList = new mailUserList({data:{warningType:3}});
        this.__weList.$inject(e._$get('list3'));

        this.__initEvent();
	};
    pro.__initEvent = function(){
        var modalArr = [newRuleModal,newLogisModal,newMailUser],
        listArr = [this.__ltList,this.__ttList,this.__weList],
        that = this,
        dataArr = [{type:1},{type:1},{type:1,data:{user:{warningType:3}}}];
        // 新增按钮事件绑定
        $('.j-addbtn')._$on({
            'click':function(evt){
                var addType = $(this)._$attr('data-addtype');
                var modal = new modalArr[addType](dataArr[addType]);
                modal.$on('confirm',function(){
                    listArr[addType].refresh();
                }._$bind(that));
            }
        });
    };
    

    p._$$Module._$allocate();
});