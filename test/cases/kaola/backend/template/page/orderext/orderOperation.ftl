<#include "../wrapper/import.ftl">
<@htmHead title="Order操作">
	<style>
		.w-dataform{margin:20px 0 0 50px;}
		.w-dataform .item{width:500px;margin:10px;}
		.w-dataform button{float:right;}
	</style>
</@htmHead>

<div class="w-dataform">
	<div class="item f-clearfix">
		<span>向电子海关推送订单</span>
		<input type="text" />
		<button class="w-btn w-btn-blue">推送订单确认</button>
	</div>
	<div class="item f-clearfix">
		<span>向电子海关推送运单</span>
		<input type="text" />
		<button class="w-btn w-btn-blue">推送运单库存不足</button>
	</div>
	<div class="item f-clearfix">
		<span>向电子海关推送个人物品申报单</span>
		<input type="text" />
		<button class="w-btn w-btn-blue">推送个人物品申报单</button>
	</div>
	<div class="item f-clearfix">
		<span>从EMS获取物流单号</span>
		<input type="text" />
		<button class="w-btn w-btn-blue">获取物流单号</button>
	</div>
	<div class="item f-clearfix">
		<span>向网仓/中外运推送订单</span>
		<input type="text" />
		<button class="w-btn w-btn-blue">推送订单</button>
	</div>
	<div class="item f-clearfix">
		<span>向网仓下达发货指令</span>
		<input type="text" />
		<button class="w-btn w-btn-blue">网仓发货</button>
	</div>
</div>

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/orderext/orderOperation.js"></script>
</body>
</html>