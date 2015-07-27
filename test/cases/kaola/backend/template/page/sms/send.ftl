<#include "../wrapper/import.ftl">
<@htmHead title="发送短信">
    <style>
		.w-dataform{margin:20px 0 0 50px;}
		.w-dataform span{display: inline-block;margin: 5px 0 10px;}
	</style>
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
            	<div class="w-dataform">
					<div class="item f-clearfix">
						<span>选择通道：</span>
						<select id="msgprop">
							<option value="1">普通通道</option>
                            <option value="2">营销通道</option>
						</select>
						<br>
						<span>输入短信容</span><br>
						<textarea id="message" type="text" placeholder="短信内容"></textarea>
						<br><span>输入电话号码</span><br>
				        <textarea style="width:500px;height:200px;" id="phonestring" type="text" placeholder="电话号码列表以回车分隔"></textarea>
				        <br><br>
						<button id="btn" class="w-btn w-btn-blue">点击发送</button><b style="color:#f00;display:inline-block;margin-left:5px;">请不要重复点击导致短信发送多次，如有发送疑问请直接联系开发，确认后再操作</b>
					</div>
				</div>
            </div>
        </div>
    </div>
    <@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<@htmFoot />

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/sms/send.js"></script>
</body>
</html>