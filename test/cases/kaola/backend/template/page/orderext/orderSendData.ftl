<#include "../wrapper/import.ftl">
<@htmHead title="Order操作">
	<style>
		.w-dataform{margin:20px 0 0 50px;}
		.w-dataform button{display:block; }
		.w-dataform textarea{display:block; width:400px; height:150px; margin:20px 0;}
	</style>
</@htmHead>

<div class="w-dataform">
	<div class="item">
        <select class="ztag">
        <#list businessTypeList as businessType>
        	<option value="${businessType.value}">${businessType.index}</option>
        </#list>
        </select>
        <textarea class="ztag"></textarea>
        <button class="w-btn w-btn-blue ztag">发送</button>
    </div>
</div>

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/orderext/orderSendData.js"></script>
</body>
</html>