<#-- 模拟数据，不用注释 -->
<#if !menu??><#include "../fakedata/product/manage_fakedata.ftl"></#if>
<#include "../../cnf/direct.ftl">
<#include "../../lib/macro.ftl">
<#include "../../lib/function.ftl">
<@htmHead title="网易商城后台管理系统"
    keywords=""
    description=""
    css=["module/calendar.css","module/product/manage.css"]
    js=[] 
    />
<@topHeader menuObj=menu curMenuId=menuId!0/>    
<div id="g-wrapper" class="f-clearfix">
	<@leftNav supplierList = supplierList/>
	<div id="g-contentbox" class="f-clearfix"><div id="g-contentwrap">
		<div id="g-toolbar">
			<#if supplierList?size gt 1 || specialPass??>
			<span id="g-operations">
			<#if supplierList?size gt 1>
				<a href="/goodsms/new.do" target="_blank" class="u-btn"><span>新建商品</span></a>
				<a href="/gift/edit.do" target="_blank" class="u-btn"><span>新建赠品</span></a>
				<a href="/trial/edit.do" target="_blank" class="u-btn"><span>新建试用商品</span></a>
			</#if>
				<span class="u-btn-group">
					<a class="u-btn" href="#Core.approve"><span>信息批准</span></a><a href="#Core.reject" class="u-btn2"><span>信息驳回</span></a><!--<a href="#Core.deleteData" class="u-btn2"><span>删除</span></a>-->
				</span>
				<a href="#Core.exportData" class="u-btn"><span>导出</span></a>
				<a href="#Core.upshelf" class="u-btn"><span>上架</span></a>
			</span>
			<#else>
				<h2>${supplierList[0].supplierName}</h2>
			</#if>
			<span id="g-searchbar">
				<#if supplierList?size == 1 >
					<span id="g-operations">
						<a href="/goodsms/new.do" target="_blank" class="u-btn"><span>新建商品</span></a>
						<a href="#Core.exportData" class="u-btn"><span>导出</span></a>
					</span>
				</#if>
				<select name="statusCond">
				<#list dropDownList as ops><option value='${ops.statusCond}'>${ops.showName}</option></#list>
				</select>
				<label>初建日期</label><span class="u-inputbox"><span><input name="fromDate" class="date" readonly="readonly" value=""/></span></span> - <span class="u-inputbox"><span><input name="toDate" class="date" readonly="readonly" value=""/></span></span>
				<label>关键词</label><span class="u-inputbox"><span><input name="key" class="keys" placeholder="商品名称品牌或编号" value=""/></span></span> <a href="#Core.search" class="u-btn"><span>搜索</span></a>
			</span>
		</div>
		<div id="g-datatable">
			<div id="g-tablehead">				
				<table class="datatable">
					<colgroup>
						<col width="8%"/>
						<col width="15%"/>
						<col width="15%"/>
						<col width="8%"/>
						<col width="7%"/>
						<col width="7%"/>
						<col width="7%"/>
						<col width="7%"/>
						<col width="7%"/>
						<col width="9%"/>
					</colgroup>
					<thead>
						<tr><th title="商品编号" style="text-align:left"><label for="checkAll"><input type="checkbox" id="checkAll"/></label>商品编号</th><th title="商品名称">商品名称</th><th title="供应商">供应商</th><th title="库仓">库仓</th><th title="SKU规格">SKU规格</th><th title="库存数量">库存数量</th><th title="供应商价格">供应商价格</th><th title="邮费">邮费</th><th title="商品状态">商品状态</th><th>类型</th><th title="操作" class="opTd">操作</th></tr>
					</thead>
				</table>				
			</div>
			<#-- <div id="u-scroll-mask">A</div> -->
			<div id="g-tablebody">
				<div id="u-tablebbody">
				<table class="datatable">
					<colgroup>
						<col width="8%"/>
						<col width="15%"/>
						<col width="15%"/>
						<col width="8%"/>
						<col width="7%"/>
						<col width="7%"/>
						<col width="7%"/>
						<col width="7%"/>
						<col width="7%"/>
						<col width="9%"/>
					</colgroup>
					<tbody><tr><td colspan="11" class="loadingTd">请稍候，数据加载中&hellip;</td></tr></tbody>
				</table>
				</div>
				<div id="u-tablebody-scroller"><b></b></div>
			</div>
			<div id="g-pager-wrapper"><div id="u-pager">&nbsp;</div></div>
		</div>
	</div></div>
</div>
<@htmFoot js=["module/product/manage.js"]/>