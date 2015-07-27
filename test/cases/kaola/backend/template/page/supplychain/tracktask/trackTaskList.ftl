<#-- Created by hale on 23/06/2015. -->
<#-- 跟单列表页：/backend/supplychain/tracktask/list -->

<#include "../../wrapper/import.ftl">
<@htmHead title="跟单任务">
    <link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
    <link rel="stylesheet" type="text/css" href="${css_root}module/tracktask/list.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-databox">
                <div class="head f-clearfix" id="tabbox">
                    <a href="javascript:void(0);" data-type="1" class="icf-window tab active first j-flag">跟单中任务(<span class="j-total">${totalRecords4Tracking!0}</span>)</a>
                    <a href="javascript:void(0);" data-type="0" class="icf-window tab j-flag">未跟单任务(<span class="j-total">${totalRecords4NoTracking!0}</span>)</a>
                    <a href="javascript:void(0);" data-type="2" class="icf-window tab j-flag">跟单完成任务(<span class="j-total">${totalRecords4TrackDone!0}</span>)</a>
                </div>
                <div class="detail">
                    <form id="searchForm" class="w-dataform f-cb f-rowgroup">
                        <a href="javascript:void(0);" class="w-btn w-btn-black btag j-flag">导出</a>
                        <div class=" f-fr">
                            <div class="group">
                                <label>供应商：</label>
                                <select name="supplierId">
                                	<option value="-1">全部</option>
                                    <#list supplierDetailList as item>
                                    <option value="${item.supplierId}">${item.name}</option>
                                    </#list>
                                </select>
                            </div>
                            <div class="group">
                                <label>入库仓库：</label>
                                <select name="warehouseId">
                                	<option value="-1">全部</option>
                                    <#list warehouseList as item>
                                    <option value="${item.warehouseId}">${item.warehouseName}</option>
                                    </#list>
                                </select>
                            </div>
                            <div class="group">
                                <select name="orderType">
                                    <#list orderTypeList as item>
                                    <option value="${item.orderType}">${item.auditOrPurchaseNo}</option>
                                    </#list>
                                </select>
                            </div>
                            <div class="group">
                                <input type="text" value="" name="auditOrPurchaseNo" />
                                <button href="javascript:void(0);" class="w-btn w-btn-black btag" name="submit">搜索</button>
                            </div>
                        </div>
                    </form>
                    <div id="listbox">

                    </div>
                </div>
            </div>
        </div>
    </div>
    <@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>

<@htmFoot />
<!-- @DEFINE -->
<!-- @DEFINE -->
<script type="text/javascript">
    var storages = ${stringify(warehouseList!'')},
        suppliers = ${stringify(supplierDetailList!'')},
        ordertypes = ${stringify(orderTypeList!'')};
</script>
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/tracktask/tracklist.js"></script>
</body>
</html>