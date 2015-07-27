<#-- 采购金额统计:{url} -->
<#-- Created by zmm on 14/1/15. -->

<#include "../wrapper/import.ftl">
<@htmHead title="采购金额统计_财务对账">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox" style="min-width: 1300px">
                    <div class="head">
                        <h2 class="icf-bird">采购金额统计数据列表</h2>
                    </div>
                    <div class="detail">
                        <div class="w-dataform f-clearfix">
                            <div class="group f-fl">
                                <button class="w-btn w-btn-white" name="exportBtn">导出采购金额数据</button>
                            </div>
                            <div class="group f-fl">
                                <label class="title">仓库:</label>
                                <select name="storage">
                                <#list storageList![] as item>
                                    <option value="${item.storageId}">${item.storageName?html}</option>
                                </#list>
                                </select>
                            </div>
                            <div class="group f-fl" style="margin-right: 10px">
                                <label class="title">时间段:</label>
                                <select name="fromYear">
                                </select>
                                <span>年&nbsp;&nbsp;</span>
                                <select name="fromMonth">
                                <#list 1..12 as item>
                                    <option value="${item}" <#if (month!12)?int == item>selected</#if>>${item}</option>
                                </#list>
                                </select>
                                <span>月&nbsp;&nbsp;</span>
								<span>&nbsp;至&nbsp;</span>
                                <select name="toYear">
                                </select>
                                <span>年&nbsp;&nbsp;</span>
                                <select name="toMonth">
                                <#list 1..12 as item>
                                    <option value="${item}" <#if (month!12)?int == item>selected</#if>>${item}</option>
                                </#list>
                                </select>
                                <span>月&nbsp;&nbsp;</span>
                            </div>
                            <div class="group f-fr">
                                <a target="_blank" class="w-btn w-btn-black" href="/backend/invoicing/finance/export">导出库存货值差额</a>
                            </div>
                            <#--<div class="group f-fl">-->
                                <#--<button name="searchBtn" class="w-btn w-btn-black">搜索</button>-->
                            <#--</div>-->
                        </div>
                        <table class="w-datatable">
                            <thead>
                                <th class="cmax2">仓库</th>
                                <th class="cmax2">采购单</th>
                                <th class="cmax2">商品ID</th>
                                <th class="cmax3">商品名称及规格</th>
                                <th>跨境方式</th>
                                <th>实际入库数量</th>
                                <th>成本(元)</th>
                                <th>币种</th>
                                <th>汇率</th>
                                <th>采购合计</th>
                                <th>入库金额合计(元)</th>
                            </thead>
                            <tbody>
                            <#if (dataList![])?size gt 0>
                                <#list dataList as item>
                                <tr>
                                    <td rowspan="" class="cmax3">${item.aa!''}</td>
                                    <@orderrow data=item/>
                                    <td rowspan="">${item.aa!'0'}</td>
                                    <td rowspan="">${item.aa!'0'}</td>
                                </tr>
                                <#list orderList![] as oitem>
                                <tr>
                                    <@orderrow data=oitem/>
                                </tr>
                                <#list goodsList![] as gitem>
                                <tr>
                                    <@goodsrow gdata=gitem/>
                                </tr>
                                </#list>
                                </#list>
                                </#list>
                            <#else>
                            <tr><td colspan=11>嗯，不想显示数据 o(╯□╰)o， 直接点导出吧</td></tr>
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
<#macro orderrow data={}>
    <td rowspan="" class="cmax2">${data.aa!''}</td>
    <@goodsrow gdata=data />
    <td rowspan="">${data.aa!''}</td>
    <td rowspan="">${data.aa!''}</td>

</#macro>
<#macro goodsrow gdata={}>
    <td class="cmax2">${data.aa!''}</td>
    <td class="cmax3">${data.aa!''}<br/>${data.aa!''}</td>
    <td>${data.aa!''}</td>
    <td>${data.aa!''}</td>
    <td>${data.aa!''}</td>
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
        var _time = new Date();
        var _year = _time.getFullYear();
        var _month = _time.getMonth() + 1;
        var _yearHtml = '';
        for (var i = 2014; i <= _year; i++ ) {
            _yearHtml += '<option value="' + i + '" ' + (i==_year?'selected':'') + '>' + i + '</option>';
        }
        _q('select[name="fromMonth"] option[value='+ _month +']')._$attr('selected','selected');
        _q('select[name="fromYear"]')._$html(_yearHtml);
        _q('select[name="toMonth"] option[value='+ _month +']')._$attr('selected','selected');
        _q('select[name="toYear"]')._$html(_yearHtml);

        _q('button[name="exportBtn"]')._$on('click', function(){
            var _dialog = haitao.bw._$$WarningWindow._$allocate({
                parent: document.body,
                content: '<p style="padding: 20px;">正在导出结果，稍微等一下下~</p>',
                onlyclosebtn: true,
                mask: 'w-winmask'
            });
            _dialog._$show();

            var _para = {
                storageId: parseInt(_q('select[name="storage"]')._$val()),
                fromYear: parseInt(_q('select[name="fromYear"]')._$val()),
                fromMonth: parseInt(_q('select[name="fromMonth"]')._$val()),
                toYear: parseInt(_q('select[name="toYear"]')._$val()),
                toMonth: parseInt(_q('select[name="toMonth"]')._$val())
            };
            nej.j._$haitaoDWR(
                    'InvoicingBean',
                    'getPurchaseOrderFinanceByTime',
                    [_para.storageId, _para.fromYear, _para.fromMonth, _para.toYear, _para.toMonth],
                    function(_res) {
                        _dialog._$hide();
                        if (!!_res) {
                            var _dialog1 = haitao.bw._$$WarningWindow._$allocate({
                                parent: document.body,
                                content: '<p style="padding: 20px;">导出成功：<a href="' + _res + '" target="_blank">点击下载报表</a></p>',
                                onlyclosebtn: true,
                                mask: 'w-winmask'
                            });
                            _dialog1._$show();
                        } else {
                            alert("导出失败：" + _res);
                        }
                    }
            );
        });

        _q('button[name="searchBtn"]')._$on('click', function(){
            var _dialog = haitao.bw._$$WarningWindow._$allocate({
                parent: document.body,
                content: '<p style="padding: 20px;">正在查询结果，稍微等一下下~</p>',
                onlyclosebtn: true,
                mask: 'w-winmask'
            });
            _dialog._$show();
            window.location.href = "/backend/?fromYear="
                    + _q('select[name="fromYear"]')._$val()
                    + "&fromMonth=" + _q('select[name="fromMonth"]')._$val()
                    + "&storage=" + _q('select[name="storage"]')._$val()
                    + "&toYear=" + _q('select[name="toYear"]')._$val()
                    + "&toMonth=" + _q('select[name="toMonth"]')._$val();
        });
    });
</script>

</body>
</html>