<#-- 海关对账:{/backend/reconcilition/customtax/index} -->
<#-- Created by zmm on 5/1/15. -->

<#include "../wrapper/import.ftl">
<@htmHead title="海关对账_分账对账">
<link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">海关对账数据查询</h2>
                    </div>
                    <div class="detail w-dataform">
                        <div class="group">
                            <label class="title">订单状态:</label>
                            <#assign state=state!0 />
                            <select name="state">
                                <option value="0" <#if state?int == 0>selected</#if>>全部&nbsp;&nbsp;</option>
                                <option value="1" <#if state?int == 1>selected</#if>>待发货</option>
                                <option value="2" <#if state?int == 2>selected</#if>>已发货</option>
                                <option value="3" <#if state?int == 3>selected</#if>>交易完成</option>
                                <option value="4" <#if state?int == 4>selected</#if>>交易失败</option>
                            </select>

                            <label class="title">跨境方式:</label>
                            <#assign import=import!-1 />
                            <select name="import">
                                <option value="-1" <#if import?int == -1>selected</#if>>全部&nbsp;&nbsp;</option>
                                <option value="0" <#if import?int == 0>selected</#if>>直邮</option>
                                <option value="1" <#if import?int == 1>selected</#if>>保税</option>
                            </select>

                            <label class="title">仓库:</label>
                            <select name="storage">
                                <option value="0" <#if storage == 0>selected</#if>>全部</option>
                            <#list storages![] as item>
                                <option value="${item.warehouseId}" <#if storage == item.warehouseId>selected</#if>>${item.warehouseName}</option>
                            </#list>
                            </select>

                            <label class="title">对比结果:</label>
                            <#assign result=result!0 />
                            <select name="result">
                                <option value="0" <#if result?int == 0>selected</#if>>全部&nbsp;&nbsp;</option>
                                <option value="1" <#if result?int == 1>selected</#if>>异常</option>
                                <option value="2" <#if result?int == 2>selected</#if>>正常</option>
                            </select>

                            <label class="title">支付时间:</label>
                            <span class="u-inputbox">
                                <span>
                                    <input id="J-starttime" name="starttime" class="date wd100" readonly="readonly" value="${starttime!""}" placeholder="开始日期"/>
                                </span>
                            </span>
                            &nbsp;-&nbsp;
                            <span class="u-inputbox">
                                <span>
                                    <input id="J-endtime" name="endtime" class="date wd100" readonly="readonly" value="${endtime!""}" placeholder="结束日期"/>
                                </span>
                            </span>
                        </div>
                        <div class="group-col1">
                            <button name="searchBtn" class="w-btn w-btn-black">查询订单</button>
                            <button name="exportBtn" class="w-btn w-btn-white">导出全部数据</button>
                        </div>
                    </div>
                </div>
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-bird">海关对账数据列表</h2>
                    </div>
                    <div class="detail">
                        <table class="w-datatable">
                            <thead>
                                <tr>
                                    <th>订单编号</th>
                                    <th>快递单号</th>
                                    <th>跨境方式</th>
                                    <th>仓库</th>
                                    <th>订单货款</th>
                                    <th>关税分账金额</th>
                                    <th>海关征收金额</th>
                                    <th>订单状态</th>
                                    <th>核对结果</th>
                                    <th>海关核放时间</th>
                                </tr>
                            </thead>
                            <tbody>
                            <#if (taxes![])?size gt 0>
                                <#list taxes as item>
                                <tr>
                                    <td>${item.orderNo!''}</td>
                                    <td>${item.expressNo!''}</td>
                                    <td>${item.importType!''}</td>
                                    <td><#if item.orderExt??>${item.orderExt.storageName!''}</#if></td>
                                    <td>${item.payTotalAmount!'0.0'}</td>
                                    <td>${item.customDevideAmount!'0.0'}</td>
                                    <td>${item.customCostAmount!'0.0'}</td>
                                    <td>${item.state!''}</td>
                                    <td>${item.result!''}</td>
                                    <td>${item.taxNoticeTime!''}</td>
                                </tr>
                                </#list>
                            <#else>
                            <tr><td colspan=9>数据为空</td></tr>
                            </#if>
                            </tbody>
                        </table>
                        <@lpager2 totalSize=total limit=limit offset=offset url="/backend/reconciliation/customstax/index?state=${state!''}&import=${import!''}&storage=${storage!''}&result=${result!''}&starttime=${starttime!''}&endtime=${endtime!''}" />
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
<script src="/backend/src/js/module/reconciliation/customs.js"></script>
</body>
</html>