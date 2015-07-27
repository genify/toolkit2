NEJ.define(['{lib}util/list/module.pager.js', 
			'{lib}ui/layer/window.js', '{lib}util/ajax/dwr.js',
			'{lib}ui/datepick/datepick.js','{lib}util/chain/chainable.js',
			'pro/widget/module'],
function(_pg, _w, _dwr, _dp, _q,_sys, _p){
	_p._$$Manage = NEJ.C();
	_v = NEJ.P('nej.v');
	_u = NEJ.P('nej.u');
	var _pro = _p._$$Manage._$extend(haitao.bw._$$MModule);
	_pro.__init = function(){
		//this.__super();
		//各异步数据获取地址
		this.config = {
			//获取商品列表
			listData : "/goodsms/list.do",
			//批准
			approve : "/goodsms/audit.do",
			//驳回
			reject : "/goodsms/reject.do",
			//删除
			deleteUrl : "/goodsms/delete.do",
			//导出
			exportUrl : "/goodsms/export.do",
			//设置为缺货
			setoutofstockUrl : "/goodsms/setoutofstock.do",
			//设置为有货
			setenoughstockUrl : "/goodsms/setenoughstock.do",
			//商品预览
			preview : "",
			//商品编辑
			edit : "",
			//商品下架
			off : "/goodsms/offShelf.do",
			// 获取竞品列表
			matchUrl : "/product/getCompetitiveProductList.do",
			// 匹配确认
			doMatchUrl : "/product/match.do",
			//上架商品
			up : "/goodsms/upshelf.do",
			//增加描述
			addDesc : "/goodsms/adddesc.do"
		};

		//开始初始化
		//初始化日历
		_q('.date')._$on('click',function(_event){
			_v._$stop(_event);
			var _input = _q(this);
			_input._$val('');  //打开前先清空
			var _datapick = _dp._$$DatePick._$allocate({
				parent: _input[0].parentNode,
				onchange: function(_value){
					_input[0].value = _u._$format(_value,'yyyyMMdd');
				}
			});
		});
	}

	new _p._$$Manage();
});