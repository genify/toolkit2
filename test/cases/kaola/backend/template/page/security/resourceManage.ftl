<#-- Created by zmm on 15/11/14. -->
<#-- 资源管理页面：/security/resource -->

<#include "../wrapper/import.ftl">
<@htmHead title="资源管理">
    <link rel="stylesheet" type="text/css" href="${css_root}module/security/manage.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <#-- 添加资源窗口 -->
                <a target="_blank" href="/backend/security/resource/import" class="w-btn w-btn-black import-btn">批量导入资源</a>
                <div id="J-addResourceBox" class="m-databox js-minus">
                    <div class="head">
                        <h2 class="js-head icf-keyboard">添加资源</h2>
                        <div class="icnbox">
                            <a href="javascript:void(0);" class="js-minimize w-btn w-btn-icn"></a>
                        </div>
                    </div>
                    <div class="detail">
                        <form id="J-resourceForm" class="w-dataform" onsubmit="return false;">
                            <div class="group">
                                <label class="title">显示顺序：</label>
                                <input type="number" placeholder="输入数字" name="sortnum" value="0" required/>
                            </div>
                            <div class="group">
                                <label class="title">资源名称：</label>
                                <input type="text" placeholder="输入资源名" name="resourcename" required/>
                                <input type="hidden" name="resourceid"/>
                            </div>
                            <div class="group">
                                <label class="title">类型：</label>
                                <label><input class="zradio" type="radio" name="resourcetype" value="2" checked/>&nbsp;页面</label>
                                <label><input class="zradio" type="radio" name="resourcetype" value="3"/>&nbsp;操作</label>
                                <label><input class="zradio" type="radio" name="resourcetype" value="1" />&nbsp;模块</label>
                            </div>
                            <div class="group">
                                <label class="title">模块：</label>
                                <select name="moduleId">
                                    <option value="0">选择模块</option>
                                    <#if modules??>
                                    <#list modules as module>
                                        <option value="${module.id}">${module.name}</option>
                                    </#list>
                                    </#if>
                                </select>
                            </div>
                            <div class="group">
                                <label class="title">对应的url：</label>
                                <input type="text" placeholder="输入url" name="url" class="url-wd"/>
                            </div>
                            <div class="group">
                                <label class="title">资源描述：</label>
                                <textarea type="text" placeholder="输入点描述什么的把..." name="desc"></textarea>
                            </div>
                            <div class="group-col1">
                                <p id="J-errorInfo" class="errorInfo icf-bug f-hide"></p>
                                <button name="submitbutton" class="w-btn w-btn-black">添加资源</button>
                                <button name="updatebutton" class="w-btn w-btn-black" style="display:none">确认修改</button>
                                <button name="cancleupbutton" class="w-btn w-btn-white" style="display:none">取消修改</button>
                            </div>
                        </form>
                    </div>
                </div>
                <#-- 资源列表 -->
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-user2">资源列表</h2>
                    </div>
                    <div id="J-resourceList" class="detail resource-list">
                    <#list allMenuList as menu>
                        <fieldset class="js-hide">
                            <legend><label>${menu.title}&nbsp;<input type="checkbox" title="显示或隐藏" class="zhide-chk" checked/><span>隐藏</span></label></legend>
                            <p class="module">
                                <span>显示顺序：<input type="text" value="${menu.resource.indexes}" disabled class="i-short"/></span>
                                <span>模块名称：<input type="text" value="${menu.resource.name}" disabled/></span>
                                <span>
                                    <button type="button" data-index-value="${menu.resource.indexes}" data-id-value="${menu.resource.id}" data-name-value="${menu.resource.name}" data-url-value="${(menu.resource.url)!''}" data-mid-value="${(menu.resource.moduleId)!'0'}" data-desc-value="${(menu.resource.description)!''}" data-type-value="${menu.resource.type}" class="w-btn w-btn-blue icf-pencil zupbtn">修改</button>
                                    <button type="button" data-id-value="${menu.resource.id}" class="w-btn w-btn-red icf-minus zdelbtn">删除</button>
                                </span>
                            </p>
                            <table class="w-datatable">
                                <thead>
                                    <tr>
                                        <th>显示顺序</th>
                                        <th>资源id</th>
                                        <th>资源名</th>
                                        <th>对应url</th>
                                        <th>描述</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <#if (menu.subMenu)?size gt 0>
                                    <tr><td colspan="6" class="menu">子菜单列表</td></tr>
                                    <#list menu.subMenu as submenu>
                                    <tr>
                                        <td>${submenu.resource.indexes}</td>
                                        <td>${submenu.resource.id}</td>
                                        <td>${submenu.resource.name}</td>
                                        <td class="cmax1">${submenu.resource.url}</td>
                                        <td>${(submenu.resource.description)!''}</td>
                                        <td>
                                            <button type="button" data-index-value="${submenu.resource.indexes}" data-id-value="${submenu.resource.id}" data-name-value="${submenu.resource.name}" data-url-value="${submenu.resource.url}" data-mid-value="${(submenu.resource.moduleId)!'0'}" data-desc-value="${(submenu.resource.description)!''}" data-type-value="${submenu.resource.type}" class="w-btn w-btn-blue icf-pencil zupbtn">修改</button>
                                            <button type="button" data-id-value="${submenu.resource.id}" class="w-btn w-btn-red icf-minus zdelbtn">删除</button>
                                        </td>
                                    </tr>
                                    </#list>
                                    </#if>
                                    <#if (menu.operations)?size gt 0>
                                    <tr><td colspan="6" class="oper">操作列表</td></tr>
                                    <#list menu.operations as resource>
                                    <tr>
                                        <td>${resource.indexes}</td>
                                        <td>${resource.id}</td>
                                        <td>${resource.name}</td>
                                        <td class="cmax1">${resource.url}</td>
                                        <td>${(resource.description)!''}</td>
                                        <td>
                                            <button type="button" data-index-value="${resource.indexes}" data-id-value="${resource.id}" data-name-value="${resource.name}" data-url-value="${resource.url}" data-mid-value="${(resource.moduleId)!'0'}" data-desc-value="${(resource.description)!''}" data-type-value="${resource.type}" class="w-btn w-btn-blue icf-pencil zupbtn">修改</button>
                                            <button type="button" data-id-value="${resource.id}" class="w-btn w-btn-red icf-minus zdelbtn">删除</button>
                                        </td>
                                    </tr>
                                    </#list>
                                    </#if>
                                </tbody>
                            </table>
                        </fieldset>
                    </#list>
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
<script src="/backend/src/js/module/security/resourceManage.js"></script>
</body>
</html>