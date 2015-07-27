<#-- Created by yqj on 27/01/2015. -->
<#-- 商品库存明细表：/backend/version -->

<#include "../../wrapper/import.ftl">
<@htmHead title="到货计划表">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/supplychain/supplychain.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">到货计划表</h2>
                    </div>
                    <div class="detail">
                        <div id="searchbox" class="w-dataform f-clearfix">
                        	<form id="searchForm">
                        		<div class="f-rowgroup">
                        			<div class="col"><button id="refresh" class="w-btn w-btn-black btag">刷新</button></div>
                        			<div class="col col-span2">
                        				新建时间：<span class="w-datepick"><input type="text" readonly=true class="j-datepick" name="start"></span>
                        			</div>
                        			<div class="col col-span2">
                        				到：<span class="w-datepick"><input type="text" readonly=true class="j-datepick" name="end"></span>
                        			</div>
                        			<div class="col col-span4">入库仓库：
                        				<select name="storageId">
                        					<option value="">全部</option>
                        					<#list warehouseList as item>
                        						<option value="${item.warehouseId!''}">${item.warehouseName!''}</option>
                        					</#list>
                        				</select>
                        				<button  name="submit" class="w-btn w-btn-black btag">搜索</button>
                        			</div>
                    			</div>
                        	</form>
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
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/statistics/arrivalplan.js"></script>
</body>
</html>