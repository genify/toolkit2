<#-- Created by mating on 2015/05/11. -->

<#include "../wrapper/import.ftl">
<@htmHead title="订单监控">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/dw/storageMonitor.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">订单监控</h2>
                    </div>
                    <div class="detail">
                        <div id="searchbox" class="w-dataform f-clearfix">
                        	<#-- <#assign warehouseList = [{"warehouseId":"11111","warehouseName":"1号仓库"},{"warehouseId":"22222","warehouseName":"2号仓库"},{"warehouseId":"33333","warehouseName":"3号仓库"}] />
							<#assign importTypeList=[{"index":"0","value":"直邮"},{"index":"1","value":"保税"},{"index":"2","value":"海淘"}] /> -->
                            <a class="w-btn w-btn-black export" id="export">导出</a>
                        	<#assign importType=[{"text":"全部","value":""}] />
                        	<#list importTypeList as it>
								<#assign importType=importType+[{"text":it.value,"value":it.index}] />
                        	</#list>
                        	<#assign wareHouse=[{"text":"全部","value":""}] />
                        	<#list warehouseList as wh>
								<#assign wareHouse=wareHouse+[{"text":wh.warehouseName,"value":wh.warehouseId}] />
                        	</#list>
                            <#-- <#assign storageDateValues=[{"text":"库存","value":1},{"text":"库存天期(7天)","value":2},{"text":"库存天期(30天)","value":3}] /> -->
                            <@searchForm filters=[
                            	[{"label":"跨境方式","type":"SELECT","name":"importType","values":importType},
                            	{"label":"发货仓库","type":"SELECT","name":"storageId","values":wareHouse},
                            	<#-- {"label":"商品编号","type":"TEXT","name":"goodsId","mustNum":"1"}, -->
                            	<#-- {"type":"SELECT","name":"type","values":storageDateValues}, -->
                            	{"label":"支付日期","type":"LABEL"},
                                {"label":"起始日期","type":"DATE","name":"start"},
                            	{"label":"——","type":"LABEL"},
                                {"label":"结束日期","type":"DATE","name":"end"},
                            	{"type":"BUTTON","name":"submit","value":"查询"}]
                            ]/>
                        </div>
                        <div id="list"></div>
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
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/dw/storageMonitor.js"></script>
</body>
</html>