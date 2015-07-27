<#include "../wrapper/import.ftl">
<@htmHead title="入库审核详情">
    <link rel="stylesheet" type="text/css" href="${css_root}module/psinventory/ordermanage.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
<div class="g-bd">
	<div class="g-bdc">
		<div class="m-upside f-cb">
			<p>
				<span class="f-mr40">入库单号:1234556675443</span>
				<span class="f-mr40">相关单号:xxxxxxxxxxx</span>
			</p>
		</div>
		<div class="m-content">
			<p class="details">
				<span class="f-mr40">入库仓库：和达仓库（保税）</span>
				<span class="f-mr40">入库时间：2014-22-11 21:11:11</span>
				<span class="f-mr40">入库原因：盘盈入库</span>
				<span class="f-mr40">审核状态：未审核</span>
			</p>
			<table>
				<colgroup>
					<col width="12%"><col width="16%"><col width="10%"><col width="16%"><col width="16%"><col width="10%"><col width="10%"><col width="10%">
				</colgroup>
				<thead>
					<tr>
						<th title="商品ID">商品ID</th>
						<th title="入库单号">商品名称</th>
						<th title="仓库">跨境方式</th>
						<th title="入库时间">条形码</th>
						<th title="入库原因">SKU规格</th>
						<th title="入库数量">入库数量</th>
						<th title="审核状态">良品</th>
						<th title="相关单号">次品</th>
					</tr>
				</thead>
				<tbody class="list" style="border: 1px solid #000;">
					<tr>
						<th title="商品ID">123</th>
						<th title="入库单号">商品名称12</th>
						<th title="仓库">保税</th>
						<th title="入库时间">1234455</th>
						<th title="入库原因">SKU3</th>
						<th title="入库数量">23</th>
						<th title="审核状态">11</th>
						<th title="相关单号">2</th>
					</tr>
				</tbody>
			</table>
			<div id="checkBtn">
				<button>入库确认</button>
			</div>
			<div class="remark">
				<p><b>备注：</b><br>xxxxxxxxxxxxxxxxxx</p>
			</div>
		</div>
	</div>
</div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
<!-- @NOPARSE -->
<script>
	var _config = {id:0, search:'${search?default("")?js_string}'};
</script>
<!-- /@NOPARSE -->

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/psinventory/putindetails.js"></script>
</body>
</html>