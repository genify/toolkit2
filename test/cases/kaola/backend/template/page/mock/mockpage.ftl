<#include "../wrapper/import.ftl">
<@htmHead title="MockPage">
	<style>
		.w-dataform{margin:20px 0 0 50px;}
		.w-dataform .item{width:750px;margin:10px;}
		.w-dataform button{float:right;}
	</style>
</@htmHead>

中外运测试仓库 stockId:7 wmsId:sinotrans<br>
下沙保税仓库 stockId:220038 wmsId:iscs<br>
宁波保税区测试仓库 stockId:11 wmsId:nb_eport

<div class="w-dataform">
	<div class="item f-clearfix">
		<span>输入订单号orderId</span>
		<input type="text" placeholder="orderId"/>
        <input type="text" placeholder="stockId"/>
        <input type="text" placeholder="wmsId"/>
		<button class="w-btn w-btn-blue">发货成功</button>
	</div>
	<div class="item f-clearfix">
		<span>输入订单号orderId</span>
        <input type="text" placeholder="orderId"/>
        <input type="text" placeholder="stockId"/>
        <input type="text" placeholder="wmsId"/>
		<button class="w-btn w-btn-red">库存不足</button>
	</div>
	<div class="item f-clearfix">
		<span>输入订单号orderId</span>
        <input type="text" placeholder="orderId"/>
        <input type="text" placeholder="stockId"/>
        <input type="text" placeholder="wmsId"/>
		<button class="w-btn w-btn-red">海关扣押</button>
	</div>
	<div class="item f-clearfix">
		<span>采购订单号purchaseId</span>
        <input type="text" placeholder="orderId"/>
        <input type="text" placeholder="stockId"/>
        <input type="text" placeholder="wmsId"/>
		<button class="w-btn w-btn-blue">采购成功</button>
	</div>
</div>

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/template/page/mock/mock.js"></script>
</body>
</html>