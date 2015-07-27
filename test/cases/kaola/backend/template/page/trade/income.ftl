<#-- 收入查询:{/backend/income/getIncomeList?type=1&?startTime=&endTime=&limit=30?offset=0} -->
<#-- Created by zmm on 5/1/15. -->

<#include "../wrapper/import.ftl">
<@htmHead title="收入查询_财务对账">
<link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-bird">收入数据列表</h2>
                    </div>
                    <div class="detail">
                        <div class="w-dataform">
                            <div class="group">
                                <select id="type" class="wd100">
                                    <option value="1" <#if type?int == 1>selected</#if>>日报</option>
                                    <option value="2" <#if type?int == 2>selected</#if>>周报</option>
                                    <option value="3" <#if type?int == 3>selected</#if>>月报</option>
                                    <option value="4" <#if type?int == 4>selected</#if>>季报</option>
                                    <option value="5" <#if type?int == 5>selected</#if>>年报</option>
                                </select>

                                <label class="title">时间区间:</label>
                                <input id="starttime" type="text" value="${startTime!""}" class="wd100" placeholder="开始时间" readonly/>
                                &nbsp;-&nbsp;
                                <input id="endtime" type="text" value="${endTime!""}" class="wd100" placeholder="结束时间" readonly/>

                                <button id="searchBtn" class="w-btn w-btn-black" style="margin-left: 20px">搜索</button>
                            </div>

                        </div>
                        <table class="w-datatable">
                            <thead>
                            <tr>
                                <th>时间</th>
                                <th>收入金额</th>
                                <th>退款金额</th>
                            </tr>
                            </thead>
                            <tbody>
                            <#if (incomeList![])?size gt 0>
                                <#list incomeList as item>
                                <tr>
                                    <td>${item.showDay!''}</td>
                                    <td>${item.incomeAmount!'0.0'}</td>
                                    <td>${item.refundAmount!'0.0'}</td>
                                </tr>
                                </#list>
                            <#else>
                            <tr><td colspan=3>当前数据为空</td></tr>
                            </#if>
                            </tbody>
                        </table>
                        <@lpager2 totalSize=counts limit=limit offset=offset url="/backend/income/getIncomeList?type=${type!''}&startTime=${startTime!''}&endTime=${endTime!''}" />
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
<script src="/backend/src/js/module/reconciliation/income.js"></script>
</body>
</html>