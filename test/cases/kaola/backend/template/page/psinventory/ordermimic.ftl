<#include "../wrapper/import.ftl">
<@htmHead title="进销存管理页面">
    <link rel="stylesheet" type="text/css" href="${css_root}module/psinventory/ordermimic.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
<div class="g-bd ztag">
	<div class="g-bdc">
		<div class="m-upside f-clearfix">
			<#--<a class="w-btn w-btn-blue item" target="_blank" href="/backend/invoicing/order/create">新建采购单</a>-->
			<div class="item">
				<span>入库仓库：</span>
				<select class="ztag" style="width:110px;">
				<#list storageList as storage>
					<option value="${storage.storageId}">${storage.storageName?html}</option>
				</#list>
				</select>
			</div>
			<div class="item">
				<span>采购商：</span>
				<select class="ztag" style="width:110px;">
				<#list supplierList as supplier>
					<option value="${supplier.supplierId}">${supplier.supplierName?html}</option>
				</#list>
				</select>
			</div>
			<div class="item supplier">
				<span>币种：</span>
				<select class="ztag" style="width:110px;">
				<#list currencyList as currency>
					<option value="${currency.currencyId}">${currency.currencyName}</option>
				</#list>
				</select>
			</div>
			<div class="item">
				<span>处理状态：</span>
				<select class="ztag" style="width:100px;">
				<#list orderStatusList as orderStatus>
					<option value="${orderStatus.index?default(-1)}">${orderStatus.value?default('全部')}</option>
				</#list>
				</select>
			</div>
			<div class="item">
				<span>采购单号：</span>
				<input class="ztag" type="text" style="width:140px;" />
			</div>
			<div class="item">
				<span>合同编号：</span>
				<input class="ztag" type="text" style="width:140px;" />
				<a class="w-btn w-btn-blue ztag" href="#">搜索</a>
			</div>
		</div>
		<div class="m-content w-table">
			<table>
				<colgroup>
					<col width="14%"><col width="14%"><col width="12%"><col width="10%"><col width="8%"><col width="8%"><col width="7%"><col width="7%"><col width="7%"><col width="auto">
				</colgroup>
				<thead>
					<tr>
						<th title="采购单号">采购单号</th>
						<th title="预计入库时间">预计入库时间</th>
						<th title="入库仓库">入库仓库</th>
						<th title="采购商">采购商</th>
						<th title="合同编号">合同编号</th>
						<th title="币种">币种</th>
						<th title="采购金额">采购金额</th>
						<th title="采购数量">采购数量</th>
						<th title="处理状态">处理状态</th>
						<th title="操作" class="last">操作</th>
					</tr>
				</thead>
			</table>
			<div class="ztag">
				<table>
					<colgroup>
						<col width="14%"><col width="14%"><col width="12%"><col width="10%"><col width="8%"><col width="8%"><col width="7%"><col width="7%"><col width="7%"><col width="auto">
					</colgroup>
					<tbody class="list ztag">
					</tbody>
				</table>
			</div>
			<div class="m-fixPag f-clearfix">
				<div class="pageinfo ztag" style="display:none;">
					<input class="ztag" type="text" />
					<button class="w-btn w-btn-blue ztag">GO</button>
					<span class="ztag">当前第1页</span>
					<span>每页记录：20</span>
				</div>
				<div class="pager ztag"></div>
			</div>
		</div>
	</div>
</div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
<@htmFoot />
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/psinventory/ordermimic.js"></script>
</body>
</html>
