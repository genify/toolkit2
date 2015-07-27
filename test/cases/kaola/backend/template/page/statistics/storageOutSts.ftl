<#-- Created by yqj on 27/01/2015. -->
<#-- 商品库存明细表：/backend/version -->

<#include "../wrapper/import.ftl">
<@htmHead title="仓库发货">
	<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/statistics/holiday.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div class="m-databox">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">仓库发货情况查询</h2>
                    </div>
                    <div class="detail">
                    	<form id="searchForm">
                        		<div class="f-rowgroup f-rowgroup-10">
                        			<div class="col">
		                        		<label>跨镜方式:</label>
		                        		<select name="importType">
		                        			<option value="">全部</option>
		                        			<#list importTypeList as item>
		                        				<option value="${item.index}">${item.value}</option>
		                        			</#list>
		                        		</select>
	                        		</div>
	                        		<div class="col">
		                        		<label>发货仓库:</label>
		                        		<select name="warehouseId">
		                        			<option value="">全部</option>
		                        			<#list warehouseList as item>
		                        				<option value="${item.warehouseId}">${item.warehouseName}</option>
		                        			</#list>
		                        		</select>
	                        		</div>
	                        		<div class="col">
		                        		<label>支付时间:</label>
		                        		<input type="text" name="startTime" class="j-datepick">
		                        	</div>
	                        		<div class="col">
		                        		<label class=" ">~</label>
		                        		<input type="text" name="endTime" class="j-datepick">
	                        		</div>
	                        		<div class="col">
		                        		<button  name="submit" class="w-btn w-btn-black btag">查询</button>
                        				<button  name="exportData" class="w-btn w-btn-black btag" id="exportData">导出</button>
	                        		</div>
                        		</div>
                        	</form>
                        	<div id="list">
                        	
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
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/statistics/storageOutSts.js"></script>
</body>
</html>