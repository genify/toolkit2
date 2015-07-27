<#-- Created by yqj on 27/01/2015. -->
<#-- 商品库存明细表：/backend/version -->

<#include "../wrapper/import.ftl">
<@htmHead title="版本管理">
    <link rel="stylesheet" type="text/css" href="${css_root}module/date.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/orderext/order.css">
	<link rel="stylesheet" type="text/css" href="${css_root}module/statistics/inventory4Detail.css">
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
                        	<form id="searchForm">
                        		<div class="f-rowgroup f-rowgroup-10">
                        			<div class="col">
		                        		<label>一级类目:</label>
		                        		<select name="firstCategoryId">
		                        			<option value="">全部</option>
		                        			<#list categoryTree as item>
		                        				<option value="${item.currentCategory.categoryId}">
		                        					${item.currentCategory.categoryName}
		                        				</option>
		                        			</#list>
		                        		</select>
	                        		</div>
	                        		<div class="col">
		                        		<label>二级类目:</label>
		                        		<select name="secondCategoryId">
		                        			<option value="">请选择</option>
		                        		</select>
	                        		</div>
	                        		<div class="col">
		                        		<label>三级类目:</label>
		                        		<select name="thirdCategoryId">
		                        			<option value="">请选择</option>
		                        		</select>
		                        	</div>
	                        		<div class="col">
		                        		<label class=" ">品牌:</label>
		                        		<select name="brandId">
		                        			<option value="">全部</option>
		                        			<#list brandList as item>
		                        				<option value="${item.brandId}">
		                        					${item.name}
		                        				</option>
		                        			</#list>
		                        		</select>
	                        		</div>
	                        		<div class="col">
		                        		<label class=" ">仓库:</label>
		                        		<select name="storageId">
		                        			<option value="">全部</option>
		                        			<#list warehouseList as item>
		                        				<option value="${item.warehouseId}">
		                        					${item.warehouseName}
		                        				</option>
		                        			</#list>
		                        		</select>
	                        		</div>
                        		</div>
                        		<div class="f-rowgroup">
                        			<div class="col col-span2">
                        				<label class=" ">商品编号:</label>
                        				<input type="text" class="" placeholder="输入商品编号" name="productId">
                        			</div>
                        			<div class="col col-span4">
                        				<select name="rangeField">
                        					<option value="doi7">库存天期（7天）</option>
                        					<option value="doi30">库存天期（30天）</option>
                        					<option value="storage ">库存</option>
                        					<option value="salesYesterday ">昨天销量</option>
                        				</select>
                        				<input type="text" class="w-itp" name="start" maxlength=8>--
                        				<input type="text" class="w-itp" name="end" maxlength=8>
                        			</div>
                        				
                        			<div class="col col-span2">
                        				<label>是否可预警：</label>
                        				<select name="isWarning">
                        					<option value="-1">全部</option>
                        					<option value="1">是</option>
                        					<option value="0">否</option>
                        				</select>
                        			</div>
                        			<div class="col col-span2">
                        				<button  name="submit" class="w-btn w-btn-black btag">查询</button>
                        				<button  name="exportData" class="w-btn w-btn-black btag">导出</button>
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
<script>
	var categoryTree = [<#list categoryTree as cat>
						{"id":${cat.currentCategory.categoryId},
						 "categoryName":'${cat.currentCategory.categoryName}',
						 "children":[
						  <#list cat.children as child>
						   {"id":${child.currentCategory.categoryId},
						   "categoryName":"${child.currentCategory.categoryName}",
						   "children":[
						     <#list child.children as c>
							     {"id":${c.currentCategory.categoryId},
							      "categoryName":'${c.currentCategory.categoryName}'
							     }<#if c_has_next>,</#if>
						     </#list>
						     ]}<#if child_has_next>,</#if>
						   </#list>]
						 }<#if cat_has_next>,</#if>
						 </#list>];
</script>
<!-- @DEFINE -->
<script src="${lib_root}define.js?pro=${pro_root}"></script>
<script src="/backend/src/js/module/statistics/inventory4Detail.js"></script>
</body>
</html>