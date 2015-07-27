<#-- Created by zmm on 15/11/14. -->
<#-- 角色管理页面：/security/role -->

<#include "../wrapper/import.ftl">
<@htmHead title="角色管理">
    <link rel="stylesheet" type="text/css" href="${css_root}module/security/manage.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">

    <div class="g-bd">
        <div class="g-bdc">
            <a target="_blank" href="/backend/security/role/new" class="w-btn w-btn-black add-role-btn" style="margin:15px;">添加角色</a>
            <div class="m-main">
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-user2">角色列表</h2>
                    </div>
                    <div class="detail">
                        <table id="J-roleTable" class="w-datatable">
                            <thead>
                                <tr>
                                    <th>角色id</th>
                                    <th>角色名字</th>
                                    <th>描述</th>
                                    <th>创建时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                            <#if roles?size==0>
                            <tr colspan="5"><td>列表为空</td></tr>
                            <#else >
                            <#list roles as role>
                            <tr>
                                <td>${role.id}</td>
                                <td>${role.name}</td>
                                <td>${(role.description)!''}</td>
                                <td>${((role.createTime)?number_to_datetime)?string("yyyy-MM-dd HH:mm:ss")}</td>
                                <td class="cmax1">
                                    <a target="_blank" href="/backend/security/role/new?roleId=${role.id}" class="w-btn w-btn-blue icf-pencil zupbtn">修改</a>
                                    <a href="javascript:void(0);" data-id-value="${role.id}" class="w-btn w-btn-red icf-minus zdelbtn">删除</a>
                                </td>
                            </tr>
                            </#list>
                            </#if>
                            </tbody>
                        </table>
                    <@lpager total=1 index=1 url="#" />
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
<script src="/backend/src/js/module/security/roleManage.js"></script>

</body>
</html>