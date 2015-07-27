<#-- 库存货值查询:{url} -->
<#-- Created by zmm on 14/1/15. -->

<#include "../wrapper/import.ftl">
<@htmHead title="库存货值_财务对账">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox" style="min-width: 1300px">
                    <div class="head">
                        <h2 class="icf-bird">库存货值数据列表</h2>
                    </div>
                    <div class="detail">
                        <div class="w-dataform">
                            <div class="group">
                                <label class="title">仓库:</label>
                                <select id="storage">
                                    <#assign storage=storage!0 />
                                    <option value="0" <#if storage == 0>selected</#if>>全部</option>
                                <#list storages![] as item>
                                    <option value="${item.warehouseId}" <#if storage == item.warehouseId>selected</#if>>${item.warehouseName}</option>
                                </#list>
                                </select>
                            </div>
                        </div>
                        <table class="w-datatable">
                            <thead>
                                <th class="cmax2">仓库</th>
                                <th class="cmax2">商品ID</th>
                                <th class="cmax3">商品名称</th>
                                <th>SKU规格</th>
                                <th>库存</th>
                                <th>良品</th>
                                <th>次品</th>
                                <th>良品货值</th>
                                <th>次品货值</th>
                                <th>货值总计</th>
                            </thead>
                            <tbody>
                            <#if (dataList![])?size gt 0>
                                <#list dataList as item>
                                <tr>
                                    <td rowspan="" class="cmax2">${item.aa!''}</td>
                                    <@orderrow data=item/>
                                    <td rowspan="">${item.aa!'0'}</td>
                                    <td rowspan="">${item.aa!'0'}</td>
                                    <td rowspan="">${item.aa!'0'}</td>
                                </tr>
                                <#list goodsList![] as gitem>
                                <tr>
                                    <@goodsrow gdata=gitem/>
                                </tr>
                                <#list skuList![] as sitem>
                                <tr>
                                    <@skurow sdata=sitem/>
                                </tr>
                                </#list>
                                </#list>
                                </#list>
                            <#else>
                            <tr><td colspan=5>当前数据为空</td></tr>
                            </#if>
                            </tbody>
                        </table>
                    </div>
                </div>
            <#--<@lpager2 totalSize=count limit=limit offset=offset url="/backend/?storage=${storage!''}" />-->
            </div>
        </div>
    </div>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<#macro goodsrow gdata={}>
    <td rowspan="" class="cmax2">${data.aa!''}</td>
    <td rowspan="" class="cmax3">${data.aa!''}<br/>${data.aa!''}</td>
    <td rowspan="">${data.aa!''}</td>
    <@skurow sdata=gdata/>
</#macro>

<#macro skurow sdata={}>
    <td>${data.aa!''}</td>
    <td>${data.aa!''}</td>
    <td>${data.aa!''}</td>
    <td>${data.aa!''}</td>
</#macro>
<@htmFoot />
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script type="text/javascript">
    NEJ.define([
        'pro/widget/module'
    ],function(_s){
        var _element = nej.e._$get('storage');
        nej.v._$addEvent(_element, 'change', function(){
            var val = _element.value;
            window.location.href = '/backend/balance/getBalanceList?storage='+val;
        })
    });
</body>
</html>