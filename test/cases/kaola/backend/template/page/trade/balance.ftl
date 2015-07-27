<#-- 月度余额:{/backend/balance/index} -->
<#-- Created by zmm on 5/1/15. -->

<#include "../wrapper/import.ftl">
<@htmHead title="月度余额_财务对账">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-bird">月度余额数据列表</h2>
                    </div>
                    <div class="detail">
                        <div class="w-dataform">
                            <div class="group">
                                <label class="title">时间:</label>
                                <#assign currentYear=year!2015 />
                                <select id="yearList" class="wd100">
                                <#list (yearList![]) as item>
                                    <option value="${item}" <#if item?int == currentYear>selected</#if>>${item}</option>
                                </#list>
                                </select>
                            </div>
                        </div>
                        <table class="w-datatable">
                            <thead>
                            <tr>
                                <th>月份</th>
                                <#--<th>支付宝月度余额</th>-->
                                <th>网易宝中间账户月度余额</th>
                                <th>HQG月度余额</th>
                                <th>关税账户月度余额</th>
                            </tr>
                            </thead>
                            <tbody>
                            <#if (balanceList![])?size gt 0>
                                <#list balanceList as item>
                                <tr>
                                    <td>${item.month!''}</td>
                                    <#--<td>${item.alipayBalance!'0.0'}</td>-->
                                    <td>${item.wybMiddleBalance!'0.0'}</td>
                                    <td>${item.wybHqgBalance!'0.0'}</td>
                                    <td>${item.wybCustomsTaxBalance!'0.0'}</td>
                                </tr>
                                </#list>
                            <#else>
                            <tr><td colspan=5>当前年份数据为空</td></tr>
                            </#if>
                            </tbody>
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
<script type="text/javascript">
    NEJ.define([
        'pro/widget/module'
    ],function(_s){
        var _element = nej.e._$get('yearList');
       nej.v._$addEvent(_element, 'change', function(){
           var year = _element.value;
           window.location.href = '/backend/balance/getBalanceList?year='+year;
       })
    });
</script>
</body>
</html>
