<#include "../wrapper/import.ftl">
<@htmHead title="进销存-入库单详情确认">
    <link rel="stylesheet" type="text/css" href="${css_root}module/psinventory/ordermanage.css">
</@htmHead>
<@topHeader />

<#assign status=stockIn.auditState.intValue()/>
<div class="g-body f-clearfix">
<div class="g-bd">
	<div class="g-bdc">
		<div class="m-upside f-cb">
			<p>
				<span class="f-mr40">入库单号:${stockIn.id?string}</span>
				<span class="f-mr40">相关单号:${stockIn.relatedId?default('')}</span>
			</p>
		</div>
		<div class="m-content w-table">
			<p class="details">
				<span class="f-mr40">入库仓库：${stockIn.storageName?default('')}</span>
				<span class="f-mr40">入库时间：${stockIn.time?number_to_date?string('yyyy-MM-dd HH:mm:ss')}</span>
				<span class="f-mr40">入库原因：${stockIn.stockInTypeName?default('')}入库</span>
			</p>
			<table>
				<colgroup>
					<col width="12%"><col width="16%"><col width="10%"><col width="16%"><col width="16%"><col width="10%"><col width="10%"><col width="10%">
				</colgroup>
				<thead>
					<tr>
						<th title="商品ID">商品ID</th>
						<th title="商品名称">商品名称</th>
						<th title="跨境方式">跨境方式</th>
						<th title="条形码">条形码</th>
						<th title="SKU规格">SKU规格</th>
						<th title="入库数量">入库数量</th>
						<th title="良品">良品</th>
						<th title="次品">次品</th>
					</tr>
				</thead>
				<tbody class="list hasborder" style="border: 1px solid #bbb;">
					<#list stockIn.details as detail>
					<tr>
						<td title="商品ID">${detail.inventory.goodsId}</td>
						<td title="商品名称">${detail.inventory.goodsName?default('')}</td>
						<td title="跨境方式">${detail.inventory.importTypeName?default('')}</td>
						<td title="条形码">${detail.inventory.barcode?default('')}</td>
						<td title="SKU规格">${detail.inventory.skuDesc?default('')}</td>
						<td title="入库数量">${detail.count?default(0)}</td>
						<td title="良品">${detail.goodCount?default(0)}</td>
						<td title="次品">${detail.badCount?default(0)}</td>
					</tr>
					</#list>
				</tbody>
			</table>
			<#if status == 0>
			<div style="margin-top:20px; text-align:center;">
				<button id="checkbtn" class="w-btn w-btn-blue">入库确认</button>
			</div>
            <div style="margin-top:20px; text-align:center;">
                <button id="reject_btn" class="w-btn w-btn-red">入库拒绝</button>
            </div>
			</#if>
			<div class="remark">
				<p><b>备注：</b><br>${stockIn.remark?default('')?html}</p>
			</div>
		</div>
	</div>
</div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
<!-- @NOPARSE -->
<script>
	var _config = {sockId : ${stockIn.id!""}};
</script>
<!-- /@NOPARSE -->

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/psinventory/auditcheck.js"></script>
</body>
</html>