<#-- 物流、仓库报价单页面:{/backend/logisticFeeBid} -->
<#-- Created by zmm on 16/12/14. -->
<#include "../wrapper/import.ftl">
<@htmHead title="快递报价单设置">
<link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main f-clearfix">
                <div id="J-addLogisticBox" class="m-databox js-minus wd550">
                    <div class="head">
                        <h2 class="js-head icf-keyboard">添加报价单</h2>
                        <div class="icnbox">
                            <a href="javascript:void(0);" class="js-minimize w-btn w-btn-icn"></a>
                        </div>
                    </div>
                    <div class="detail w-dataform">
                        <div class="group">
                            <input type="hidden" name="id"/>
                            <label class="title">报价单：</label>
                            <input type="text" name="logistic" value="" disabled/>
                        </div>
                        <div class="group">
                            <label class="title">选择模板：</label>
                            <#if (templateList![])?size gt 0>
                                <select name="template" class="wd170">
                                    <#list templateList as tmp>
                                    <option value="${tmp.templateId}">${tmp.templateName}</option>
                                    </#list>
                                </select>
                            <#else><p class="">模板为空，重新刷新或联系哪位GG吧。 <i class="icf-pointer2"></i></p>
                            </#if>
                        </div>
                        <div class="group">
                            <label class="title">生效日期：</label>
                            <span class="u-inputbox"><span><input id="fromDate" class="date" readonly="readonly" value="" placeholder="输入开始日期"/></span></span>&nbsp;-&nbsp;
                            <span class="u-inputbox"><span><input id="toDate" class="date" readonly="readonly" value="" placeholder="输入截止日期"/></span></span>
                            <p style="margin: 5px 0 0 105px;">生效日期为当天 00:00:00</p>
                        </div>
                        <div class="group-col1">
                            <p id="J-errorInfo" class="errorInfo icf-bug f-hide"></p>
                            <button name="submitbutton" class="w-btn w-btn-black">添加模板</button>
                            <button name="updatebutton" class="w-btn w-btn-black" style="display:none">确认修改</button>
                            <button name="cancleupbutton" class="w-btn w-btn-white" style="display:none">取消修改</button>
                        </div>
                    </div>
                </div>
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-user2"><#if type==1>快递报价单列表<#elseif type==2>仓库报价单列表<#else>呵呵呵</#if></h2>
                    </div>
                    <div class="detail w-dataform">
                        <div class="group f-clearfix">
                            <label class="title"><#if type==1>物流公司<#elseif type==2>仓库<#else>呵呵呵</#if>：</label>
                            <#if (logisticFeeBidMap![])?size == 0>
                                <p class=""><#if type==1>物流公司<#elseif type==2>仓库<#else>呵呵呵</#if>列表为空，重新刷新或联系哪位GG吧。 <i class="icf-pointer2"></i></p>
                            <#else>
                                <select name="logisticSelect" class="wd300">
                                    <#list logisticFeeBidMap?keys as mapKey>
                                    <option value="${mapKey}">${mapKey}</option>
                                    </#list>
                                </select>
                            </#if>
                        </div>
                        <table id="J-logisticTable" class="w-datatable" data-type="${type}">
                            <thead>
                                <th>模板名称</th>
                                <th>开始时间</th>
                                <th>截止时间</th>
                                <th>操作</th>
                            </thead>
                            <#list logisticFeeBidMap?keys as mapKey>
                            <tbody id="fee-${mapKey}" style="display: none;">
                                <#list logisticFeeBidMap[mapKey] as mapValue>
                                <tr>
                                    <td>${mapValue.templateName}</td>
                                    <td>${mapValue.startTimeStr}</td>
                                    <td>${mapValue.endTimeStr}</td>
                                    <td>
                                        <button data-id="${mapValue.id}" data-tid="${mapValue.templateId}" data-fromdate="${mapValue.startTimeStr}" data-todate="${mapValue.endTimeStr}" class="w-btn w-btn-blue icf-pencil zupbtn">修改</button>
                                        <button data-id="${mapValue.id}" class="w-btn w-btn-red icf-minus zdelbtn">删除</button>
                                    </td>
                                </tr>
                                </#list>
                            </tbody>
                            </#list>
                        </table>
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
<script src="/backend/src/js/module/feetemplate/logisticFeeBid.js"></script>
</body>
</html>