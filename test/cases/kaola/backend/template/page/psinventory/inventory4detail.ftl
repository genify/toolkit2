<#-- Created by mating on 2015/03/27. -->

<#include "../wrapper/import.ftl">
<@htmHead title="商品库存明细">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/psinventory/inventory4detail.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">商品库存明细</h2>
                    </div>
                    <div class="detail">
                        <div id="searchbox" class="w-dataform f-clearfix">
                            <#assign storageDateValues=[{"text":"库存","value":1},{"text":"库存天期(7天)","value":2},{"text":"库存天期(30天)","value":3}] />
                            <@searchForm filters=[
                            	[{"label":"商品编号","type":"TEXT","name":"goodsId","mustNum":"1"},
                            	{"type":"SELECT","name":"type","values":storageDateValues},
                                {"type":"TEXT","name":"from","mustNum":"1"},
                            	{"label":"——","type":"LABEL"},
                                {"type":"TEXT","name":"to","mustNum":"1"},
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
<script src="/backend/src/js/module/psinventory/inventory4detail.js"></script>
</body>
</html>