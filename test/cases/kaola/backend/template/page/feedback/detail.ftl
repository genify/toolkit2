<#include "../wrapper/import.ftl">
<@htmHead title="客诉问题管理">
    <link rel="stylesheet" type="text/css" href="${css_root}module/feedback/feedback.css">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
</@htmHead>
<@topHeader />
<#assign statustype = ['','未处理','处理中','已处理','已完成'] />
<#assign prioritytype = ['','高','中','低'] />
<div class="g-body f-clearfix">
<div class="g-bd">
	<div class="g-bdc">
	<div class="m-nav">
		<span class="w-btn w-btn-blue ztag">已处理此工单</span>
		<span class="w-btn w-btn-blue ztag">关闭此工单</span>
	</div>
	<div class="m-search m-search-1 f-clearfix">
		<div class="item">
			<span>客诉状态：</span>
			<span class="txt"><#if feedback.status == 10>已删除<#else>${statustype[feedback.status]}</#if></span>
		</div>
		<div class="item">
			<span>客诉时间：</span>
			<span class="txt">${feedback.createTime?number_to_date?string('yyyy-MM-dd HH:mm:ss')}</span>
		</div>
		<div class="item">
			<span>创建人：</span>
			<span class="txt">${feedback.createrName?default('')}</span>
		</div>
		<div class="item">
			<span>工单序号：</span>
			<span class="txt">${feedback.id?default('')}</span>
		</div>
		<div class="item" style="clear:left;">
			<span>问题类型：</span>
			<span class="txt">${type?default('')}</span>
		</div>
		<div class="item" style="clear:left;">
			<span>子分类：</span>
			<span class="txt">${second_type?default('')}</span>
		</div>
		<div class="item">
			<span>优先级：</span>
			<span class="txt">${prioritytype[feedback.priority]}</span>
		</div>
		<div class="item">
			<span>手机号：</span>
			<span class="txt">${feedback.mobilePhone?default('')}</span>
		</div>
		<div class="item" style="clear:left;">
			<span>订单编号：</span>
			<span class="txt">${feedback.orderId?default('')}</span>
		</div>
		<div class="item">
			<span>账号：</span>
			<span class="txt">${feedback.userAccount?default('')}</span>
		</div>
		<div class="item">
			<span>电子邮箱：</span>
			<span class="txt">${feedback.userEmail?default('')}</span>
		</div>
		<div class="item" style="clear:left;">
			<span>问题描述：</span>
			<p class="desc">${feedback.description?default('')}</p>
		</div>
	</div>
	<#if commentList??>
	<div class="m-replylist">
		<#list commentList as comment>
		<div class="item">
			<div class="info">
				<span class="user">回复人： ${comment.commentUserId?default('')}(${comment.commentUsername?default('')} ${comment.commentUserRole?default('')})</span>
				<span class="time">回复时间：${comment.commentTime?number_to_date?string('yyyy-MM-dd HH:mm:ss')}</span>
			</div>
			<p>
				${comment.content?default('')?string}
			</p>
		</div>
		</#list>
		<div class="replay">
			<div class="input">
				<textarea placeholder="最多2000个字" class="ztag"></textarea>
			</div>
			<input type="button" class="ztag" value="回复" />
		</div>
	</div>
	</#if>
</div>
</div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
</div>
<script>
	var _config = {feedbackId: ${feedback.id}};
</script>
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/feedback/detail.js"></script>
</body>
</html>
