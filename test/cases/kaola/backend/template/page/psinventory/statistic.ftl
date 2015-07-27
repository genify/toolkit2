<#include "../wrapper/import.ftl">
<@htmHead title="进销存-库存统计">
	<link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
    <link rel="stylesheet" type="text/css" href="${css_root}module/psinventory/ordermanage.css">
    <style type="text/css">
    .m-content td{border:1px solid #bbb;word-break:break-all;}
    .m-content .skucodedit{color:blue;cursor:pointer;}
    </style>
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
<div class="g-bd">
	<div class="g-bdc">
		<div class="m-upside f-cb">
			<div class="item">
				<span>仓库：</span>
				<select class="ztag" style="width:85px;margin-right:50px;">
				<#list storageList as storage>
					<option value="${storage.storageId}">${storage.storageName?html}</option>
				</#list>
				</select>
				<span>跨境方式：</span>
				<select class="ztag" style="width:85px;margin-right:50px;">
				<#list importList as import>
					<option value="${import.importTypeId}">${import.importTypeName}</option>
				</#list>
				</select>
				<select class="ztag" style="width:85px;">
					<option value="2">商品ID</option>
					<option value="3">商品名称</option>
					<option value="4">商品条码</option>
				</select>
				<input class="ztag" type="text" />
				<a class="w-btn w-btn-blue ztag" href="#">搜索</a>
			</div>
            <button class="w-btn w-btn-blue ztag f-fr ">导出全部库存报表</button>
            <button class="w-btn w-btn-blue ztag f-fr m-mr">导出未销售商品库存报表</button>
            <button class="w-btn w-btn-blue ztag f-fr m-mr">上传Excel</button>
		</div>
		<div class="m-content w-table" style="min-width: 1300px">
			<table>
				<colgroup>
					<col width="4%">
					<col width="8%">
					<col width="7%">
					<col width="6%">
					<col width="auto">
					<col width="5%">
                    <col width="5%">
                    <#--<col width="5%">-->
					<col width="5%">
					<col width="5%">
					<col width="5%">
					<col width="5%">
					<col width="5%">
					<col width="5%">
                    <col width="5%">
                    <col width="5%">
                    <col width="5%">
					<col width="5%">
                    <col width="5.5%">
                    <col width="5.5%">
				</colgroup>
				<thead>
					<tr>
						<th title="商品ID">商品ID</th>
						<th title="商品名称">商品名称</th>
						<th title="商品条码">商品条码</th>
						<th title="所在仓库">所在仓库</th>
						<th title="跨境方式">跨境方式</th>
						<th title="SKU规格">SKU规格</th>
                        <th title="料号">料号</th>
                        <#--<th title="库存货值">库存货值</th>-->
                        <th title="前台库存">考拉前台库存</th>
						<th title="后台库存">考拉后台库存</th>
                        <th title="良品(后台)">考拉后台良品</th>
                        <th title="次品(后台)">考拉后台次品</th>
                        <th title="仓库库存">仓库库存</th>
						<th title="良品(仓库)">仓库良品</th>
						<th title="次品(仓库)">仓库次品</th>
                        <th title="仓库锁定库存">仓库锁定库存</th>
                        <th title="仓库可用库存">仓库可用库存</th>
                        <th title="累计出库(后台)">后台累计出库</th>
						<th title="重量">重量</th>
						<th title="成本">成本</th>
					</tr>
				</thead>
			</table>
			<div class="ztag">
				<table>
					<colgroup>
                        <col width="4%">
                        <col width="8%">
                        <col width="7%">
                        <col width="6%">
                        <col width="auto">
                        <col width="5%">
                        <col width="5%">
                        <#--<col width="5%">-->
                        <col width="5%">
                        <col width="5%">
                        <col width="5%">
                        <col width="5%">
                        <col width="5%">
                        <col width="5%">
                        <col width="5%">
                        <col width="5%">
                        <col width="5%">
                        <col width="5%">
                        <col width="5.5%">
                        <col width="5.5%">
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

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/psinventory/statistic.js"></script>

</body>
</html>