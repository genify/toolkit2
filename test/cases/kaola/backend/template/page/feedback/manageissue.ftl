<#include "../wrapper/import.ftl">
<@htmHead title="客诉类型管理">
    <link rel="stylesheet" type="text/css" href="${css_root}module/feedback/manageissue.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
<div class="g-bd">
	<div class="g-bdc">
		<div class="left">
			<div>
				<span class="w-btn w-btn-blue addbtn ztag">新增类型</span>
			</div>
			<div class="m-content w-table">
				<table>
					<colgroup>
						<col width="10%">
						<col width="30%">
						<col width="15%">
						<col width="30%">
						<col width="30%">
					</colgroup>
					<thead>
						<tr>
							<th title="序号">序号</th>
							<th title="问题类型">问题类型</th>
							<th title="操作人">操作人</th>
							<th title="创建时间">创建时间</th>
							<th title="操作">操作</th>
						</tr>
					</thead>
				</table>
				<div>
					<table>
						<colgroup>
							<col width="10%">
							<col width="30%">
							<col width="15%">
							<col width="30%">
							<col width="30%">
						</colgroup>
						<tbody class="list ztag">
						</tbody>
					</table>
				</div>
				<div class="m-fixPag f-cb">
					<div id="bkpager" class="pager ztag"></div>
				</div>
			</div>
		</div>
		<div class="right">
			<div>
				<span class="w-btn w-btn-blue addbtn ztag">新增子类型</span>
			</div>
			<div class="m-content w-table">
				<table>
					<colgroup>
						<col width="10%">
						<col width="30%">
						<col width="15%">
						<col width="30%">
						<col width="30%">
					</colgroup>
					<thead>
						<tr>
							<th title="序号">序号</th>
							<th title="问题类型">问题类型</th>
							<th title="操作人">操作人</th>
							<th title="创建时间">创建时间</th>
							<th title="操作">操作</th>
						</tr>
					</thead>
				</table>
				<div>
					<table>
						<colgroup>
							<col width="10%">
							<col width="30%">
							<col width="15%">
							<col width="30%">
							<col width="30%">
						</colgroup>
						<tbody class="list ztag">
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<!-- @NOPARSE -->
<script>
	var _config = {totalcount : ${totalCount!0}};
</script>
<!-- /@NOPARSE -->

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/feedback/manageissue.js"></script>

</body>
</html>