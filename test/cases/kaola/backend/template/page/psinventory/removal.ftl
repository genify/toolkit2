<#include "../wrapper/import.ftl">
<@htmHead title="进销存-出库记录">
	<link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
    <link rel="stylesheet" type="text/css" href="${css_root}module/psinventory/ordermanage.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
<div class="g-bd">
	<div class="g-bdc">
		<div class="m-upside f-cb">
			<div class="item">
				<span>出库原因：</span>
				<select class="ztag" style="width:85px;margin-right:50px;">
				<#list stockOutTypeList as stockOutType>
					<option value="${stockOutType.index}">${stockOutType.value}</option>
				</#list>
				</select>
				<span>出库时间：</span>
				<input type="text" class="ztag" readonly="readonly" />
				<i>——</i>
				<input type="text" class="ztag" readonly="readonly" />
				<a class="w-btn w-btn-blue ztag" href="#">搜索</a>
				<span id="total"></span>
			</div>
		</div>
		<div class="m-content w-table">
			<table>
				<colgroup>
					<col width="6%"><col width="15%"><col width="14%"><col width="17%"><col width="13%"><col width="8%"><col width="14%"><col width="13%">
				</colgroup>
				<thead>
					<tr>
						<th title="序号">序号</th>
						<th title="出库单号">出库单号</th>
						<th title="仓库">仓库</th>
						<th title="出库时间">出库时间</th>
						<th title="出库原因">出库原因</th>
						<th title="出库数量">出库数量</th>
						<th title="相关单号">相关单号</th>
						<th title="操作" class="last">操作</th>
					</tr>
				</thead>
			</table>
			<div class="ztag" style="overflow-y:scroll;">
				<table>
					<colgroup>
						<col width="6%"><col width="15%"><col width="14%"><col width="17%"><col width="13%"><col width="8%"><col width="14%"><col width="11.4%">
					</colgroup>
					<tbody class="list ztag">
					</tbody>
				</table>
			</div>
			<div class="fixPag f-cb" style="bottom:0; right:0; padding:10px; background-color:#ddd;">
				<div id="bkpager" class="pager ztag" style="float:right;"></div>
			</div>
		</div>
	</div>
</div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
<!-- @NOPARSE -->
<script>
	var _config = {type : 1};
</script>
<!-- /@NOPARSE -->

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/psinventory/removal.js"></script>
</body>
</html>