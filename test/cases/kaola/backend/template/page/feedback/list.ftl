<#include "../wrapper/import.ftl">
<@htmHead title="客诉问题管理">
    <link rel="stylesheet" type="text/css" href="${css_root}module/feedback/feedback.css">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
<div class="g-bd">
	<div class="g-bdc">
	<div class="m-nav">
		<button class="w-btn w-btn-blue ztag">新增客诉问题</button>
	</div>
	<div class="m-search w-dataform f-clearfix">
		<h3>客诉问题查询</h3>
        <div class="group">
            <label class="title">问题类型:</label>
            <select style="width:100px;">
				<option value="0">全部</option>
				<#list feedbackTypeList as feedbackType>
					<option value="${feedbackType.id}">${feedbackType.typeName}</option>
				</#list>
			</select>
        </div>
        <div class="group">
            <label class="title">子分类:</label>
            <select style="width:100px;">
				<option value="0">全部</option>
			</select>
        </div>
        <div class="group">
            <label class="title">优先级</label>
            <select>
				<option value="0">全部</option>
				<option value="1">高</option>
				<option value="2">中</option>
				<option value="3">低</option>
			</select>
        </div>
		<div class="group">
			<label class="title">处理状态</label>
			<select>
				<option value="0">全部</option>
				<option value="1">未处理</option>
				<option value="2">处理中</option>
				<option value="3">已处理</option>
				<option value="4">已完成</option>
				<option value="10">已删除</option>
			</select>
		</div>
		<div class="group">
			<label class="title">最后回复人</label>
			<select>
				<option value="">全部</option>
				<#list last_comment_user_id as lastcommentuser>
				<option value="${lastcommentuser?default('')}">${lastcommentuser?default('')}</option>
				</#list>
			</select>
		</div>
		<div class="group">
			<label class="title">手机号</label>
			<input type="text" />
		</div>
		<div class="group">
			<label class="title">账号</label>
			<input type="text" />
		</div>
		<div class="group">
			<label class="title">模糊查询</label>
			<input type="text" />
		</div>
		<div class="group">
			<label class="title">创建人</label>
			<select>
				<option value="">全部</option>
				<#list creaters as creater>
				<option value="${creater?default('')}">${creater?default('')}</option>
				</#list>
			</select>
		</div>
		<div class="group">
			<label class="title">订单编号</label>
			<input type="text" />
		</div>
		<div class="group">
			<label class="title">客诉时间</label>
			<div class="timerange">
				<input type="text" class="ztag"/>
				<i>——</i>
				<input type="text" class="ztag"/>
			</div>
		</div>
		<div class="group">
			<button class="w-btn w-btn-blue ztag">查询</button>
		</div>
	</div>
	<div class="m-content w-table">
		<table>
			<colgroup>
				<col width="7%"><col width="8%"><col width="10%"><col width="11%"><col width="12%"><col width="12%"><col width="8%"><col width="8%"><col width="10%"><col width="14%">
			</colgroup>
			<thead>
				<tr>
					<th title="序号">序号</th><th title="优先级">优先级</th><th title="手机号">手机号</th><th title="账号">账号</th><th title="问题类型">问题类型</th><th title="子分类">子分类</th><th title="处理状态">处理状态</th><th title="创建人">创建人</th><th title="客诉时间">客诉时间</th><th title="操作">操作</th>
				</tr>
			</thead>
		</table>
		<div>
			<table>
			<colgroup>
				<col width="7%"><col width="8%"><col width="10%"><col width="11%"><col width="12%"><col width="12%"><col width="8%"><col width="8%"><col width="10%"><col width="14%">
			</colgroup>
			<tbody id="bklist" class="list">
			</tbody>
		</table>
		</div>
	</div>
	<div class="m-fixPag f-clearfix">
		<div id="bkpager" class="pager"></div>
	</div>
</div>
</div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<div class="m-layer ltag" style="display:none;">
	<div class="bg" style=""></div>
	<div class="cnt ltag">
		<div class="box w-dataform f-clearfix">
			<h3>新增客诉问题</h3>
			<div class="wrap f-cb">
				<div class="group">
					<label class="title">问题类型</label>
					<select style="width:100px;">
						<#list feedbackTypeList as feedbackType>
							<option value="${feedbackType.id}">${feedbackType.typeName}</option>
						</#list>
					</select>
				</div>
				<div class="group">
		            <label class="title">子分类:</label>
		            <select style="width:100px;">
						<option value="0">全部</option>
					</select>
		        </div>
				<div class="group">
					<label class="title">优先级</label>
		            <select>
						<option value="1">高</option>
						<option value="2" selected>中</option>
						<option value="3">低</option>
					</select>
				</div>
				<div class="group">
					<label class="title"><span style="color:#FD3737">*</span>手机号</label>
					<input type="text" />
				</div>
			</div>
			<div class="wrap f-clearfix">
				<div class="group">
					<label class="title">订单编号</label>
					<input type="text" />
				</div>
				<div class="group">
					<label class="title"><span style="color:#FD3737">*</span>账号</label>
					<input type="text" />
				</div>
				<div class="group">
					<label class="title">电子邮件</label>
					<input type="text" />
				</div>
			</div>
			<div class="txt" style="width:860px;">
				<p>客户问题描述</p>
				<textarea style="width:788px; height:200px; word-break:break-all;" class="ltag"></textarea>
			</div>
			<div class="btnbox">
				<button class="w-btn w-btn-blue ltag">保存</button>
				<button class="w-btn w-btn-blue ltag">取消</button>
			</div>
			<input class="ltag" type="hidden" />
		</div>
	</div>
</div>
<!-- @NOPARSE -->
<script>
	var _typeList = {};
	<#list feedbackTypeList as feedbackType>
	_typeList[${feedbackType.id}] = {};
	_typeList[${feedbackType.id}].typeName = '${feedbackType.typeName}';
	_typeList[${feedbackType.id}].subTypeArry = {};
	
	<#if feedbackType.feedbackSecondTypeList?size gt 0>
	<#list feedbackType.feedbackSecondTypeList as feedbackSecondType>
	_typeList[${feedbackType.id}].subTypeArry[${feedbackSecondType.id}] = '${feedbackSecondType.typeName!''}';
	</#list>
	</#if>
	</#list>
	var _config = {};
</script>
<!-- /@NOPARSE -->
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/feedback/list.js"></script>
</body>
</html>
