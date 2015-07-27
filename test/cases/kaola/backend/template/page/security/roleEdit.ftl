<#-- Created by zmm on 15/11/14. -->
<#-- 角色新建/编辑页面：/security/role/new[?roleId=xx] -->

<#include "../wrapper/import.ftl">
<@htmHead title="角色信息编辑">
    <link rel="stylesheet" type="text/css" href="${css_root}module/security/manage.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div id="J-editRoleBox" class="m-databox">
                    <div class="head">
                        <h2 class="js-head icf-pencil"><#if role??>修改角色信息<#else>添加角色</#if></h2>
                    </div>
                    <div class="detail">
                        <form id="J-roleForm" class="w-dataform" onsubmit="return false;">
                            <div class="group">
                                <label class="title">角色名称:</label>
                                <input type="text" placeholder="输入角色名" name="rolename" value="${(role.name)!''}" required />
                                <input type="hidden" name="roleid" value="${(role.id)!''}"/>
                            </div>
                            <div class="group">
                                <label class="title">角色描述:</label>
                                <textarea type="text" placeholder="输入点描述什么的把..." name="desc">${(role.description)!''}</textarea>
                            </div>
                            <div class="group">
                                <label class="title">分配资源:</label>
                                <input type="hidden" value="${(role.resourceIds)!''}">
                                <div id="J-roleResouceList">
                                <#if (role.resourceIds)??>
                                    <#assign resourceIdList=role.resourceIds?split(",") />
                                <#else >
                                    <#assign resourceIdList=[] />
                                </#if>

                                <#list allMenuList as menu>
                                    <fieldset>
                                        <legend><label class="operate-title"><input type="checkbox" class="zp-chk">&nbsp;${menu.title}</label></legend>
                                        <#-- 操作列表 -->
                                        <#if (menu.operations)?size gt 0 >
                                            <div class="operate-list">
                                                <span class="w-notify">操作</span>
                                                <#list menu.operations as resource>
                                                    <label><input type="checkbox" class="zchk"
                                                                  data-id-value="${resource.id}"
                                                        <#list resourceIdList as selectId><#if selectId==resource.id?c>checked</#if></#list>
                                                            >&nbsp;${resource.name}</label>
                                                </#list>
                                            </div>
                                        </#if>
                                        <#-- 子菜单列表 -->
                                        <#if (menu.subMenu)?size gt 0 >
                                            <div class="submenu-list">
                                                <span class="w-notify">子菜单</span>
                                                <#list menu.subMenu as subMenuItem>
                                                    <label><input type="checkbox" class="zchk"
                                                                  data-id-value="${subMenuItem.resource.id}"
                                                        <#list resourceIdList as selectId><#if selectId==subMenuItem.resource.id?c>checked</#if></#list>
                                                            >&nbsp;${subMenuItem.resource.name}</label>
                                                </#list>
                                            </div>
                                        </#if>
                                    </fieldset>
                                </#list>
                                </div>
                            </div>
                            <div class="group-col1">
                                <#if role??>
                                <button name="updatebutton" class="w-btn w-btn-black">确认修改</button>
                                <#else>
                                <button name="submitbutton" class="w-btn w-btn-black">添加角色</button>
                                </#if>
                            </div>
                        </form>
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
<script src="/backend/src/js/module/security/roleEdit.js"></script>
</body>
</html>