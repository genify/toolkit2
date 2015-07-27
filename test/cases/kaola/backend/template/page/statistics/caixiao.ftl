<#-- 采销成本核对:{url} -->
<#-- Created by zmm on 14/1/15. -->

<#include "../wrapper/import.ftl">
<@htmHead title="采销成本核对_财务对账">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox" style="min-width: 1500px">
                    <div class="head">
                        <h2 class="icf-bird">采销成本数据列表</h2>
                    </div>
                    <div class="detail">
                        <div class="w-dataform f-clearfix">
                            <div class="group f-fl">
                                <button class="w-btn w-btn-white" name="exportBtn">导出</button>
                            </div>
                            <div class="group f-fl">
                                <label class="title">发货仓库:</label>
                                <select name="storage">
                                    <#assign storage=storage!0 />
                                    <option value="0" <#if storage == 0>selected</#if>>全部</option>
                                <#list storages![] as item>
                                    <option value="${item.warehouseId}" <#if storage == item.warehouseId>selected</#if>>${item.warehouseName}</option>
                                </#list>
                                </select>

                                <label class="title">跨境方式:</label>
                                <#assign import=import!0 />
                                <select name="import">
                                    <option value="-1" <#if import == -1>selected</#if>>全部</option>
                                    <option value="0" <#if import == 0>selected</#if>>直邮</option>
                                    <option value="1" <#if import == 1>selected</#if>>保税</option>
                                    <option value="2" <#if import == 2>selected</#if>>海淘</option>
                                </select>
                            </div>
                            <div class="group f-fl" style="margin-right: 10px">
                                <label class="title">时间:</label>
                                <select name="year">
                                <#list yearList![] as item>
                                    <option value="${item}" <#if year?int == item>selected</#if>>${item}</option>
                                </#list>
                                </select>
                                <span>年&nbsp;&nbsp;</span>
                                <select name="month">
                                <#list 1..12 as item>
                                    <option value="${item}" <#if (month!12)?int == item>selected</#if>>${item}</option>
                                </#list>
                                </select>
                                <span>月&nbsp;&nbsp;</span>

                                <label class="title">订单编号:</label>
                                <input type="text" name="orderid" value="${orderId!''}" placeholder="输入订单编号"/>
                            </div>
                            <div class="group f-fl">
                                <button name="searchBtn" class="w-btn w-btn-black">搜索</button>
                            </div>
                        </div>
                        <table class="w-datatable">
                            <tbody>
                            <tr>
                                <th colspan="5">商品</th>
                                <th colspan="4">入库</th>
                                <th colspan="7">出库库</th>
                                <th colspan="4">库存</th>
                            </tr>
                            <tr>
                                <th>商品ID</th>
                                <th>所在仓库</th>
                                <th>跨境方式</th>
                                <th>商品名称</th>
                                <th>SKU规格</th>

                                <th>采购数量</th>
                                <th>采购成本合计</th>
                                <th>盘盈数量</th>
                                <th>盘盈成本合计</th>

                                <th>销售数量</th>
                                <th>销售成本合计</th>
                                <th>收入合计</th>
                                <th>盘亏数量</th>
                                <th>盘亏成本合计</th>
                                <th>提货出库数量</th>
                                <th>提货出库成本合计</th>

                                <th>期初库存</th>
                                <th>期初货值</th>
                                <th>期末库存</th>
                                <th>期末货值</th>
                            </tr>
                            <#if (dataList![])?size gt 0>
                                <#list dataList as item>
                                <tr>
                                    <td rowspan="" class="cmax2">${item.aa!''}</td>
                                    <td rowspan="">${item.aa!''}</td>
                                    <td rowspan="" class="cmax3">${item.aa!''}</td>
                                    <td rowspan="" class="cmax2">${item.aa!''}</td>
                                    <@datarow data=item/>
                                </tr>
                                <#list orderList![] as oitem>
                                <tr>
                                    <@datarow data=oitem/>
                                </tr>
                                </#list>
                                </#list>
                            <#else>
                            <tr><td colspan=20>当前数据为空</td></tr>
                            </#if>
                            </tbody>
                        </table>
                    </div>
                </div>
            <#--<@lpager2 totalSize=count limit=limit offset=offset url="/backend/?storage=${storage!''}&import=${import!''}&year=${year!''}&month=${month!''}&order=${order!''}" />-->
            </div>
        </div>
    </div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
<#macro datarow data={}>
    <td>${data.aa!''}</td>
    <td>${data.aa!'0'}</td>
    <td>${data.aa!'0'}</td>
    <td>${data.aa!'0'}</td>
    <td>${data.aa!'0'}</td>

    <td>${data.aa!'0'}</td>
    <td>${data.aa!'0'}</td>
    <td>${data.aa!'0'}</td>
    <td>${data.aa!'0'}</td>
    <td>${data.aa!'0'}</td>
    <td>${data.aa!'0'}</td>
    <td>${data.aa!'0'}</td>

    <td>${data.aa!'0'}</td>
    <td>${data.aa!'0'}</td>
    <td>${data.aa!'0'}</td>
    <td>${data.aa!'0'}</td>
</#macro>

<@htmFoot />
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script type="text/javascript">
    NEJ.define([
        'pro/widget/module',
        '{lib}util/chain/chainable.js',
        '{pro}widget/window/warningWin.js'
    ],function(_sys,_q,_win){
        _q('button[name="exportBtn"]')._$on('click', function(){
            var _dialog = haitao.bw._$$WarningWindow._$allocate({
                parent: document.body,
                content: '<p style="padding: 20px;">正在导出结果，稍微等一下下~</p>',
                onlyclosebtn: true,
                mask: 'w-winmask'
            });
            _dialog._$show();
            window.location.href = "/backend/?export=true&year="
                    + _q('select[name="year"]')._$val()
                    + "&month=" + _q('select[name="month"]')._$val()
                    + "&orderId=" + _q('input[name="orderid"]')._$val()
                    + "storage=" + _q('select[name="storage"]')._$val()
                    + "import=" + _q('select[name="import"]')._$val();
        });
        _q('button[name="searchBtn"]')._$on('click', function(){
            var _dialog = haitao.bw._$$WarningWindow._$allocate({
                parent: document.body,
                content: '<p style="padding: 20px;">正在查询结果，稍微等一下下~</p>',
                onlyclosebtn: true,
                mask: 'w-winmask'
            });
            _dialog._$show();
            window.location.href = "/backend/?year="
                    + _q('select[name="year"]')._$val()
                    + "&month=" + _q('select[name="month"]')._$val()
                    + "&orderId=" + _q('input[name="orderid"]')._$val()
                    + "storage=" + _q('select[name="storage"]')._$val()
                    + "import=" + _q('select[name="import"]')._$val();
        });
    });
</script>

</body>
</html>