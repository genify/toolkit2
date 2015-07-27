<#-- Created by yqj on 27/01/2015. -->
<#-- 商品库存明细表：/backend/version -->

<#include "../wrapper/import.ftl">
<@htmHead title="仓库发货">
	<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/statistics/warehouse.css">
</@htmHead>
<#assign storageList=[
    {"id":0,"name":"仓库1"},
    {"id":1,"name":"仓库2"},
    {"id":2,"name":"仓库3"},
    {"id":3,"name":"仓库4"}
]/>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-pointer">发货时效管理</h2>
                    </div>
                    <div class="detail">
                    	<div id="deliveryList">
                    		
                    	</div>
                    </div>

                    <div class="head f-clearfix">
                        <h2 class="icf-pointer">发货预警收件人管理</h2>
                    </div>
                    <div class="detail">
                        <div id="alarmRecieverList">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <@leftMenu menuObj=menuList curMenuId=requestUrl />
</div>
<@htmFoot />

<!-- @DEFINE -->
<script type="text/javascript">
    window.__storageList__ = ${stringify(storageList![])};
</script>
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/statistics/warehouse.js"></script>
</body>
</html>