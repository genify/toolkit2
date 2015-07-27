<#include "../wrapper/import.ftl">
<@htmHead title="进销存-邮件订阅功能">
<link rel="stylesheet" type="text/css" href="${css_root}module/date.css" xmlns="http://www.w3.org/1999/html">
<link rel="stylesheet" type="text/css" href="${css_root}module/psinventory/ordermanage.css">
    <#if update == 'success'>
    <script type="text/javascript">
        alert("更新成功!");
    </script>
    </#if>
    <#if ((sendEmail?exists) && ( sendEmail == 'success')) >
    <script type="text/javascript">
        alert("邮件已发送,请稍后查看!");
    </script>
    </#if>
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <form action="/backend/invoicing/emailSubscribe/change" method="get">
                    <div class="m-databox">
                        <div class="head f-clearfix">
                            <h2 class="icf-pencil">订阅信息</h2>
                        </div>
                        <div class="detail">
                            <div class="group">
                                <label class="title">用户邮箱</label>
                                <input type="text" name="email" id="email" value="" style="min-width: 260px"/>
                                <label class="title">用户名称</label>
                                <label>
                                    <input type="text" name="userId" id="userId" value="" style="min-width: 260px"/>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="m-databox">
                        <div class="head f-clearfix">
                            <h2 class="icf-pencil">订阅内容</h2>
                        </div>
                        <div class="detail">
                            <div class="m-content w-table">

                                    <#list emailSubscribeStatusList as emailSubscribeStatus>
                                        <#assign checked = "">
                                        <#if emailSubscribeStatus.checked == 1><#assign checked = "checked"></#if>
                                        <label>
                                            <input type="checkbox" name="emailSubscribeType" value="${emailSubscribeStatus.type}" ${checked} />
                                        </label>
                                        ${emailSubscribeStatus.typeDesc}<br>
                                    </#list>
                                    <input type="submit" value="提交订阅"/>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-pencil">其他功能</h2>
                    </div>
                    <div class="detail">
                        <div class="m-content w-table">
                            <form action="/backend/invoicing/emailSubscribe/sendMail" method="get">
                                <input type="submit" name="sendEmail" value="立刻发送邮件"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
</body>
</html>
