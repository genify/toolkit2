<#-- Created by yqj on 27/01/2015. -->
<#-- 商品库存明细表：/backend/version -->

<#include "../wrapper/import.ftl">
<@htmHead title="供销分析及预售功能">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/dw/supplyAndMarketingPage.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">商品库存明细查询</h2>
                    </div>
                    <div class="detail">
                        <div id="searchbox" class="w-dataform f-clearfix">
                    		<label  name="submit" class="w-btn w-btn-black btag" id="importVolume">导入预估销量</label>
            				<label  name="exportData" class="w-btn w-btn-black btag" id="importPlan">导入到货计划</label>
            				<a  class="w-btn w-btn-black btag" id="export">导出</a>
                        </div>
                        <div id="result" class="m-result"></div>
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
<script src="/backend/src/js/module/dw/supplyAndMarketingPage.js"></script>
</body>
</html>