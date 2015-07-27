<#-- Created by zmm on 15/11/14. -->
<#-- 用户管理页面：/security/user -->

<#include "../wrapper/import.ftl">
<@htmHead title="用户管理">
    <link rel="stylesheet" type="text/css" href="${css_root}module/security/manage.css">
</@htmHead>
<@topHeader />
<div class="g-body f-clearfix">
    <div class="g-bd">
        <div class="g-bdc">
            <div class="m-main">
                <div id="J-addUserBox" class="m-databox js-minus">
                    <div class="head f-clearfix">
                        <h2 class="icf-keyboard">添加用户</h2>
                        <div class="icnbox">
                            <a href="javascript:void(0);" class="js-minimize w-btn w-btn-icn"></a>
                        </div>
                    </div>
                    <div class="detail">
                        <form id="J-userForm" class="w-dataform" onsubmit="return false;">
                            <div class="group">
                                <label class="title">用户类型</label>
                                <label><input class="zradio" type="radio" name="usertype" value="1" checked />&nbsp;用户名和密码</label>
                                <#--<label class="disabled"><input class="zradio" type="radio" name="usertype" value="2" disabled />&nbsp;urs账号</label>-->
                                <#--<label class="disabled"><input class="zradio" type="radio" name="usertype" value="3" disabled />&nbsp;corp账号</label>-->
                            </div>
                            <div class="group">
                                <label class="title">用户名:</label>
                                <input type="text" placeholder="输入用户名" name="username" required/>
                            </div>
                            <div class="group">
                                <label class="title" style="display:none">密码:</label>
                                <input type="text" placeholder="输入初始密码" name="password" style="display:none"/>
                            </div>
                            <div class="group">
                                <label class="title">姓名:</label>
                                <input type="text" placeholder="输入大名" name="personname" />
                            </div>
                            <div class="group">
                                <label class="title">popo账号:</label>
                                <input type="text" placeholder="输入popo账号" name="popo" class="popo-wd"/>
                            </div>
                            <div class="group">
                                <label class="title">手机号:</label>
                                <input type="text" placeholder="输入手机号" name="phone" class="popo-wd"/>
                            </div>
                            <div class="group">
                                <label class="title">描述:</label>
                                <textarea type="text" placeholder="输入点描述什么的把..." name="desc" class="popo-wd"></textarea>
                            </div>
                            <div class="group">
                                <label class="title">分配角色:</label>
                                <div id="J-roleListBox">
                                <#list roles as role>
                                    <label><input type="checkbox" class="zchk" data-id-value="${role.id}">&nbsp;${role.name}</label>
                                </#list>
                                </div>
                            </div>
                            <div class="group-col1">
                                <p id="J-errorInfo" class="errorInfo icf-bug f-hide"></p>
                                <button name="submitbutton" class="w-btn w-btn-black">添加用户</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div id="J-updateUserBox" class="m-databox update-user" style="display: none">
                    <div class="head">
                        <h2 class="icf-pencil">修改用户信息</h2>
                    </div>
                    <div class="detail">
                        <form id="J-updateForm" class="w-dataform" onsubmit="return false;">
                            <div class="group">
                                <label class="title">用户名:</label>
                                <input type="text" placeholder="输入用户名" name="username" disabled />
                                <input type="text" name="userid" style="display:none;" disabled />
                            </div>
                            <div class="group">
                                <label class="title">密码:</label>
                                <input type="text" placeholder="输入新密码" name="newpassword" style="display:none" />
                                <button name="canclepsw" class="w-btn w-btn-black" style="display:none">取消修改</button>
                                <button name="updatepsw" class="w-btn w-btn-white">修改密码</button>
                                <button name="resetpsw" class="w-btn w-btn-white">重置密码</button>
                            </div>
                            <div class="group">
                                <label class="title">账号状态:</label>
                                <label><input type="radio" name="newuserstate" value="1" />&nbsp;正常</label>
                                <label><input type="radio" name="newuserstate" value="2" />&nbsp;禁用</label>
                            </div>
                            <div class="group">
                                <label class="title">姓名:</label>
                                <input type="text" placeholder="输入大名" name="personname" />
                            </div>
                            <div class="group">
                                <label class="title">popo账号:</label>
                                <input type="text" placeholder="输入popo账号" name="popo" class="popo-wd"/>
                            </div>
                            <div class="group">
                                <label class="title">手机号:</label>
                                <input type="text" placeholder="输入手机号" name="phone" class="popo-wd"/>
                            </div>
                            <div class="group">
                                <label class="title">描述:</label>
                                <textarea type="text" placeholder="输入点描述什么的把..." name="desc" class="popo-wd"></textarea>
                            </div>
                            <div class="group">
                                <label class="title">分配角色:</label>
                                <div id="J-updateRoleListBox">
                                <#if roles??>
                                <#list roles as role>
                                    <label><input type="checkbox" class="zchk" data-id-value="${role.id}">&nbsp;${role.name}</label>
                                </#list>
                                <#else>
                                    <label>角色列表为空。请先创建角色</label>
                                </#if>
                                </div>
                            </div>
                            <div class="group-col1">
                                <p id="J-updateErrorInfo" class="errorInfo icf-bug f-hide">请选择至少一个角色</p>
                                <button name="updatebutton" class="w-btn w-btn-black">确认修改</button>
                                <button name="cancleupbutton" class="w-btn w-btn-white">取消修改</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="m-databox">
                    <div class="head">
                        <h2 class="icf-bird">用户列表</h2>
                    </div>
                    <div class="detail">
                        <table id="J-userTable" class="w-datatable">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>账号</th>
                                    <th>状态</th>
                                    <th>角色</th>
                                    <#-- 联系方式：大名，手机号，popo-->
                                    <th>账号信息</th>
                                    <th>描述</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <#if users??>
                                <#list users as user>
                                <tr>
                                    <td>${user.id}</td>
                                    <td>${user.name}</td>
                                    <td><#if user.status==1>正常<#elseif user.status==2>禁用<#else>${user.status}..未知状态</#if></td>
                                    <td class="cmax1">
                                        <#if user.roleIds?has_content>
                                       	 	<#list user.roleIds?split(",") as roleId>
                                            	<#list roles as role><#if roleId==role.id?c>${role.name}, </#if></#list>
                                        	</#list>
                                        </#if>
                                    </td>
                                    <td class="cmax1">${(user.personName)!'无名氏'}<br/>${(user.telphone)!''}<br/>${(user.popo)!''}</td>
                                    <td class="cmax1">${(user.desc)!''}</td>
                                    <td>
                                        <button type="button" data-id-value="${user.id}" data-name-value="${user.name}" data-roles-value="${user.roleIds!''}" data-status-value="${user.status}" data-pname-value="${(user.personName)!''}" data-popo-value="${(user.popo)!''}" data-phone-value="${(user.telphone)!''}" data-desc-value="${(user.desc)!''}" class="w-btn w-btn-blue icf-pencil zupbtn">修改</button>
                                        <button type="button" data-id-value="${user.id}" class="w-btn w-btn-red icf-minus zdelbtn">删除</button>
                                    </td>
                                </tr>
                                </#list>
                                <#else>
                                <tr colspan=5><td>用户列表为空</td></tr>
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
<script src="/backend/src/js/module/security/userManage.js"></script>
</body>
</html>