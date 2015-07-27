<#include "../wrapper/import.ftl">
<@htmHead title="入库审核">
	<link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
    <link rel="stylesheet" type="text/css" href="${css_root}module/psinventory/ordermanage.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
<div class="g-bd">
	<div class="g-bdc">
		<div class="m-upside f-cb">
			<div class="item">
				<span>审核状态：</span>
				<select class="ztag" style="width:85px;">
					<option value="0">全部</option>
					<option value="1">未审核</option>
					<option value="2">已审核</option>
				</select>
				<span>采购单：</span>
				<input class="ztag" type="text"/>
				<span>入库时间：</span>
				<input type="text" class="ztag" readonly="readonly" />
				<i>——</i>
				<input type="text" class="ztag" readonly="readonly" />
				<a class="ztag" href="#">搜索</a>
			</div>
		</div>
		<div class="m-content">
			<table>
				<colgroup>
					<col width="5%"><col width="14%"><col width="13%"><col width="16%"><col width="12%"><col width="7%"><col width="8%"><col width="13%"><col width="12%">
				</colgroup>
				<thead>
					<tr>
						<th title="序号">序号</th>
						<th title="入库单号">入库单号</th>
						<th title="仓库">仓库</th>
						<th title="入库时间">入库时间</th>
						<th title="入库原因">入库原因</th>
						<th title="入库数量">入库数量</th>
						<th title="审核状态">审核状态</th>
						<th title="相关单号">相关单号</th>
						<th title="操作" class="last">操作</th>
					</tr>
				</thead>
			</table>
			<div class="ztag" style="overflow-y:scroll;">
				<table>
					<colgroup>
						<col width="5%"><col width="14%"><col width="13%"><col width="16%"><col width="12%"><col width="7%"><col width="8%"><col width="13%"><col width="12%"
					</colgroup>
					<tbody class="list ztag">
					</tbody>
				</table>
			</div>
			<div class="fixPag f-cb" style="bottom:0; right:0; padding:10px; background-color:#ddd;">
				<p style="float:left">总记录数：244	每页记录：20	总页数：13</p>
				<div id="bkpager" class="pager ztag" style="float:right;"></div>
			</div>
		</div>
	</div>
</div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
<div>

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/psinventory/putincheck.js"></script>
</body>
</html>