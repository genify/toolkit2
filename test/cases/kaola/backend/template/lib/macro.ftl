<#-- 公共宏定义 -->

<#-- 前端文件目录 以及 版本号 -->
<#assign contextPath= (rc.contextPath)!''/>
<#assign cdnFileVersion = versionId!"0"/>

<#-- 文档声明/head 支持对head内容项进行修改 -->
<#macro htmHead title="">
<!DOCTYPE HTML>
<html>
<head>
    <link rel="shortcut icon" href="/favicon.ico"/>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>${title}_网易海淘</title>
    <!-- @STYLE -->
    <link rel="stylesheet" type="text/css" href="${css_root}base.css">
	<link rel="stylesheet" type="text/css" href="${css_root}global.css">
	<link rel="stylesheet" type="text/css" href="${css_root}iconfont.css">
    <#nested>
</head>
<body>

</#macro>

<#-- 顶部导航 -->
<#macro topHeader >
<header class="g-header f-clearfix">
    <div class="logo">全球购</div>
    <div class="user-info">
        Hello,${(backend_userSecurityData.user.name)!''}
        <span class="sep">&nbsp;<a href="/backend/security/user/edit" class="w-btn w-btn-black">修改密码</a><span class="sep">&nbsp;<a href="/backend/logout" class="w-btn w-btn-white">退出</a></span>
    </div>
</header>
</#macro>

<#-- join列表 -->
<#function join arr sep=','>
    <#local str=''/>
    <#list arr as x>
        <#local str=str+x/>
        <#if x_has_next><#local str=str+sep/></#if>
    </#list>
    <#return str/>
</#function>

<#-- 左侧菜单------ -->
<#function getMenuState menuObj curMenuId>
    <#local menuList = menuObj.childsList![]/>
    <#local hit = false/>
    <#list menuList as subMenu>
        <#if subMenu.id == curMenuId>
            <#local hit = true/>
        </#if>
    </#list>
    <#return hit/>
</#function>

<#macro leftMenu menuObj=[] curMenuId=''>
<div class="g-sd" >
    <div id="J-sidebar" class="box">
    <#-- 输出一级菜单 -->
        <#list menuObj as menu>
        <div class="navs js-active">
            <h3 class="nav-header">${menu.title}</h3>
            <ul class="nav-pills">
                <#-- 输出二级菜单 -->
                <#local subMenuList=menu.subMenu/>
                <#list subMenuList as subMenu>
                    <#--<#if curMenuId==subMenu.url> class="js-selected"</#if>-->
                <li><a href="${subMenu.url}"<#if curMenuId==subMenu.url> class="selected"</#if>>${subMenu.title}</a></li>
                </#list>
            </ul>
        </div>
        </#list>
    </div>
</div>
</#macro>
<#-- end左侧菜单------ -->


<#-- 页面底部-- -->
<#macro htmFoot >
<div class="g-footer">
    <div class="info">网易公司版权所有&nbsp;&nbsp;&copy;1997-2014</div>
</div>

</#macro>
<#-- end页面底部--------------------------------- -->

<#--  翻页器---------------------------------------------------------- -->
<#--<@lpager total=10 index=3 url="http://test.163.com/s/topic/list/?type=test">-->

<#function supply url="">
    <#if url?contains("?")>
        <#return url + '&'/>
    <#else>
        <#return url + '?'/>
    </#if>
</#function>
<#function getRange total index>
    <#if total&lt;10>
        <#if total&lt;3><#return []/><#else><#return [2,total-1]/></#if>
    </#if>
    <#local start=index-3/>
    <#local end=index+3/>
    <#if start&lt;2>
        <#local end=end+2-start/>
        <#local start=2/>
    </#if>
    <#if end&gt;total-1>
        <#local start=start-(end-(total-1))/>
        <#local end=total-1/>
    </#if>
    <#return [start, end]/>
</#function>

<#-- 翻页器 定义 -->
<#macro lpager total index=1 url="">
<div id="J-pagebox" class="w-paging f-clearfix">
    <#if total??&&total&gt;1>
        <a href="${supply(url)}page=${index-1}" class="zbtn zprv<#if index&lt;2> js-disabled</#if>">上一页</a>
        <a href="${supply(url)}page=1" class="zpgi<#if index==1> js-selected</#if>">1</a>
        <#local range=getRange(total,index)/>
        <#if range?size&gt;0>
            <#local start=range[0]/>
            <#local end = range[1]/>
            <#if start&gt;2><span class="zpgi">...</span></#if>
            <#list start..end as x>
                <a href="${supply(url)}page=${x}" class="zpgi<#if index==x> js-selected</#if>">${x}</a>
            </#list>
            <#if end&lt;total-1><span class="zpgi">...</span></#if>
        </#if>
        <a href="${supply(url)}page=${total}" class="zpgi<#if index==total> js-selected</#if>">${total}</a>
        <a href="${supply(url)}page=${index+1}" class="zbtn znxt<#if index==total> js-disabled</#if>">下一页</a>
    </#if>
</div>
</#macro>

<#--  end翻页器---------------------------------------------------------- -->

<#-- 翻页器2 定义 使用 offset limit totalSize展示数据-->
<#macro lpager2 totalSize limit offset=0 url="">
<#assign total=(totalSize/limit)?ceiling
         index=((offset+1)/limit)?ceiling />

<div id="J-pagebox" class="w-paging f-clearfix">
    <#if total??&&total&gt;1>
        <a href="${supply(url)}offset=${(index-2)*limit}" class="zbtn zprv<#if index&lt;2> js-disabled</#if>">上一页</a>
        <a href="${supply(url)}offset=0" class="zpgi<#if index==1> js-selected</#if>">1</a>
        <#local range=getRange(total,index)/>
        <#if range?size&gt;0>
            <#local start=range[0]/>
            <#local end = range[1]/>
            <#if start&gt;2><span class="zpgi">...</span></#if>
            <#list start..end as x>
                <a href="${supply(url)}offset=${(x-1)*limit}" class="zpgi<#if index==x> js-selected</#if>">${x}</a>
            </#list>
            <#if end&lt;total-1><span class="zpgi">...</span></#if>
        </#if>
        <a href="${supply(url)}offset=${(total-1)*limit}" class="zpgi<#if index==total> js-selected</#if>">${total}</a>
        <a href="${supply(url)}offset=${index*limit}" class="zbtn znxt<#if index==total> js-disabled</#if>">下一页</a>
    </#if>
</div>
</#macro>

<#--  end翻页器---------------------------------------------------------- -->



<#macro searchForm filters=[]>
	<form id="searchForm">
		<#list filters as row>
			<div class="row f-cb">
			<#list row as filter>
		 	<#local type = (filter.type)!"TEXT">
			<#switch type>
				<#case "TEXT">
					<div class="group">
                        <#if filter.label??>
						<label class=" ">${filter.label}:</label>
                        </#if>
                        <#if filter.mustNum??>
                        <input type="text" name="${filter.name}" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
                        <#else>
						<input type="text" name="${filter.name}" />
                        </#if>
					</div>
					<#break>
				<#case "SELECT">
					<div class="group">
                        <#if filter.label??>
						<label class=" ">${filter.label}:</label>
                        </#if>
						<select name="${filter.name}">
						<#if (filter.values)??>
						<#list filter.values as item>
							<#if item?is_string>
							<option value="${item}">${item}</option>
							<#else>
							<option value="${item.value}">${item.text}</option>
							</#if>
						</#list>
						</#if>
						</select>
					</div>
					<#break>
				<#case "DATE">
					<div class="group">
					  <span class="m-date">
						<input type="text"  data-type="date" class="j-datepick" name="${filter.name}" placeholder="${filter.label}">
					  </span>
					</div>
					<#break>
				<#case "LABEL">
					<div class="group"><label>${filter.label}</label></div>
					<#break>
				<#case "BUTTON">
					<div class="group">
						<button  name="${filter.name}" class="w-btn w-btn-black btag">${filter.value}</button>
					</div>
					<#break>
				</#switch>
			</#list>
			</div>
		</#list>
		</form>
</#macro>
