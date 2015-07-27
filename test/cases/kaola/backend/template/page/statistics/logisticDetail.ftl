<#-- Created by lzf on 16/05/2015. -->
<#include "../wrapper/import.ftl">
<#assign ruleId=RequestParameters.ruleId?default("")/>
<#assign offset=RequestParameters.offset?default(0)?number/>
<#assign limit=RequestParameters.limit?default(30)?number/>
<@htmHead title="查看 - 物流时效设置">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/statistics/logisticRule.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-bird">查看</h2>
                    </div>
                    <div class="detail">
                        <div id="searchbox" class="f-rowgroup f-fr">
                            <a href="/backend/dw/period/duration/rule/export?ruleId=${ruleId}" class="w-btn w-btn-black">导 出</a>
                            <a href="/backend/dw/period/logisticRule" class="w-btn w-btn-black">返 回</a>
                        </div>
                        <table class="w-datatable">
                            <thead>
                                <tr> <th>序号</th> <th>始发城市</th> <th>目的省份</th> <th>目的城市</th> <th>时效（H）</th> </tr>
                            </thead>
                            <tbody>
                            <#if (detailList![])?size gt 0>
                                <#list detailList as item>
                                <tr>
                                    <td class="cmax1">${item_index+1}</td>
                                    <td class="cmax1">${item.sourceCity!''}</td>
                                    <td class="cmax1">${item.destProvince!''}</td>
                                    <td class="cmax1">${item.destCity!''}</td>
                                    <td class="cmax1">${item.duration!''}</td>
                                </tr>
                                </#list>
                            <#else>
                            <tr><td colspan="5">数据为空</td></tr>
                            </#if>
                            </tbody>
                        </table>
                        <@lpager2 totalSize=total limit=limit offset=offset url="/backend/dw/period/logisticRule/detail?ruleId=${ruleId!''}&limit=${limit}" />
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
</body>
</html>