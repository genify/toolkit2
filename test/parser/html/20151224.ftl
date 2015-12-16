<#assign t20151226=1451059200000>

<#escape x as x?html>
    <@compress>
    <!DOCTYPE html>
    <html>
    <head>
        <#include "../../wrap/common.ftl">
        <#assign  links=["http://www.xiupin.com/activity/show?pageId=6029","http://www.xiupin.com/activity/show?pageId=6030","http://www.xiupin.com/activity/show?pageId=6031","http://www.xiupin.com/activity/show?pageId=6032"] />
        <#assign stagesLink=["http://www.xiupin.com/activity/show?pageId=6033",
        "http://www.xiupin.com/activity/show?pageId=6034",
        "http://www.xiupin.com/activity/show?pageId=6035",
        "http://www.xiupin.com/activity/show?pageId=6036",
        "http://www.xiupin.com/activity/show?pageId=6037",
        "http://www.xiupin.com/activity/show?pageId=6038",
        "http://www.xiupin.com/activity/show?pageId=6039"]>
        <#--<#include "./datamacro.ftl">-->
        <title>圣诞节</title>
        <meta charset="utf-8"/>
        <@css/>
        <link rel="stylesheet" href="/src/css/page/activity/activity/20151224.css">
    </head>
    <body>
    <div class="g-hd">
        <@topbar/>
        <@navigator />
    </div>
        <@module>
        <#--头1，大牌2，其他3-->
        <div class="g-activity" id="gactivity">
            <div <#if isLastDay>class="m-toparea2"<#else>class="m-toparea"</#if>>
                <div class="g-bd ct-wrap">
                    <img src="http://ystore.nos.netease.com/235e2029b02bd01260871d6bcb2d83ae.gif" class="m-sock-p" id="sockgift">
                    <div id="countdown" class="countdown"></div>
                    <a class="link link-1" href="javascript:void(0)">

                    </a>
                    <#list links as link>
                    <#if link_index gt 0>
                        <a class="link link-${link_index+1}" href="${link}" target="_blank">

                        </a>
                    </#if>
                    </#list>
                </div>

            </div><!-- Global Fashion -->


            <#--大牌区块-->
            <#macro bp  blist nd=0>
                <#list blist as p>
                    <#if p_index % 5 == nd>
                    <div class="m-product m-product${p_index+1}">
                        <a  href="/search/sycProduct?brandIdArray=${p.brandId}" target="_blank">
                            <img class="u-loading-1 m-zoom" data-src="http://paopao.nosdn.127.net/${p.thumb}?imageView&thumbnail=210y340&quality=90&enlarge=1" alt=""/>
                        </a>
                    </div>
                    </#if>
                </#list>
            </#macro>
            <#list data as item>
                <#if item_index == 0>
                    <div class="m-area1" id="a1">
                    <div class="g-bd">
                        <div class="m-dapai">
                            <div class="m-product-box">
                                    <@bp item.brdList 0 />
                            </div>
                            <div class="m-product-box">
                                    <@bp item.brdList 1 />
                            </div>
                            <div class="m-product-box">
                                <@bp item.brdList 2 />
                            </div>
                            <div class="m-product-box">
                                <@bp item.brdList 3 />
                            </div>
                            <div class="m-product-box">
                                <@bp item.brdList 4 />
                            </div>
                        </div>

                    </div>
                    </div>
                </#if>
            </#list>




            <#list data as item>
            <#if item_index gt 0 >
                <div class="m-area${item_index+1}" id="a${item_index+1}">
                    <div class="g-bd">
                    <div class="area-title"></div>
                    <div class="g-middle">
                        <div class="area-content f-cb">
                            <a href="http://www.xiupin.com/activity/show?pageId=603${item_index+1}" target="_blank" data-ganame="" data-gapoint="" data-gapage="" data-login="0">
                                <img data-src="http://paopao.nosdn.127.net/${item.title_img}?imageView&thumbnail=430y316&quality=90&enlarge=1"  class="u-loading-1 m-zoom" alt="">
                            </a>
                            <#if item.brdList??>
                                <#list item.brdList as list>
                                        <a href="/search/sycProduct?brandIdArray=${list.brandId}&fromPost=normalbrand-${list.brandId}" target="_blank" data-ganame="" data-gapoint="" data-gapage="" data-login="0">
                                            <img data-src="http://paopao.nosdn.127.net/${list.thumb}?imageView&thumbnail=210y316&quality=90&enlarge=1"  class="u-loading-1 m-zoom" alt="">
                                        </a>
                                </#list>
                            </#if>
                        </div>
                    </div>
                    </div>
                </div><!-- 百变女装 -->
            </#if>

            </#list>
            <div class="m-area11">
                <div class="area-title"></div>
                <div class="g-middle">
                    <div class="area-content f-cb">
                        <a href="http://www.163.com/taidu/2015?utm_source=xiupin&utm_medium=pc&utm_campaign=taidu" target="_blank" data-ganame="" data-gapoint="" data-gapage="" data-login="0">
                            <img data-src="/res/images/activity/20151224/bottom_news.jpg" src="/res/images/activity/20151224/bottom_news.jpg" class="u-loading-1" alt="">
                        </a>
                        <a href="http://www.huihui.cn/deals/30641556?keyfrom=xiupin151207" target="_blank" data-ganame="" data-gapoint="" data-gapage="" data-login="0">
                            <img data-src="/res/images/activity/20151224/bottom_huihui.jpg" src="/res/images/activity/20151224/bottom_huihui.jpg" class="u-loading-1" alt="">
                        </a>
                        <a href="http://music.163.com/" target="_blank" data-ganame="" data-gapoint="" data-gapage="" data-login="0">
                            <img data-src="/res/images/activity/20151224/bottom_music.jpg" src="/res/images/activity/20151224/bottom_music.jpg" class="u-loading-1" alt="">
                        </a>
                        <a href="http://yuedu.163.com/" target="_blank" data-ganame="" data-gapoint="" data-gapage="" data-login="0">
                            <img data-src="/res/images/activity/20151224/bottom_read.jpg" src="/res/images/activity/20151224/bottom_huihui.jpg" class="u-loading-1" alt="">
                        </a>
                        <a href="http://u.163.com/6s?from=xiupin" target="_blank" data-ganame="" data-gapoint="" data-gapage="" data-login="0">
                            <img data-src="/res/images/activity/20151224/bottom_mail.jpg" src="/res/images/activity/20151224/bottom_mail.jpg" class="u-loading-1" alt="">
                        </a>
                        <a href="http://trip.163.com/huoche/activity/pc/index.html?from=tgxiupin" target="_blank" data-ganame="" data-gapoint="" data-gapage="" data-login="0">
                            <img data-src="/res/images/activity/20151224/bottom_ticket.jpg" src="/res/images/activity/20151224/bottom_ticket.jpg" class="u-loading-1" alt="">
                        </a>
                    </div>
                </div>
            </div><!-- 时尚联盟 -->
            </div>


            <div class="sidebar-container" id="sidebar-container">
                <div class="m-rightbanner j-spy" id="j-spy">
                    <div class="inner-nav">
                        <ul class="f-cb">
                            <li style="height: 31px; line-height: 31px;" data-target="a1"><a href="http://www.xiupin.com/activity/show?pageId=6029" target="_blank"></a></li>
                            <li style="height: 31px; line-height: 31px;" data-target="a1"><a href="#a1"></a></li>
                            <li style="height: 39px; line-height: 39px;" data-target="a2"><a href="#a2"></a></li>
                            <li style="height: 35px; line-height: 35px;" data-target="a3"><a href="#a3"></a></li>
                            <li style="height: 36px; line-height: 36px;" data-target="a4"><a href="#a4"></a></li>
                            <li style="height: 35px; line-height: 35px;" data-target="a5"><a href="#a5"></a></li>
                            <li style="height: 38px; line-height: 38px;" data-target="a6"><a href="#a6"></a></li>
                            <li style="height: 35px; line-height: 35px;" data-target="a7"><a href="#a7"></a></li>
                            <li style="height: 38px; line-height: 38px;" data-target="a8"><a href="#a8"></a></li>
                            <li style="height: 35px; line-height: 35px;" data-target="a9"><a href="#a9"></a></li>
                            <li style="height: 34px; line-height: 34px;" data-target="a10"><a href="#a10"></a></li>
                        </ul>
                    </div>
                 </div>
            </div><!-- 右侧导航 -->
        <div id="bnav"></div>
        </@module>
        <@footer noPadding=true/>


        <script type="text/javascript">
                <#noescape>
                var deadline=${t20151226};
                </#noescape>
        </script>



    <div class="m-modal j-box f-dn" id="j-box">
        <img src="/res/images/activity/20151224/rulebox.jpg" />
    </div>

    <script src="${jspro}page/activity/20151224/jquery-1.7.1.min.js"></script>
    <script src="${jspro}page/activity/20151224/jquery.snow.js"></script>
    <#noparse>
        <!-- @SCRIPT -->
    </#noparse>
    <script src="${jslib}define.js?${jscnf}"></script>
    <script src="${jspro}page/activity/20151224/20151224.js"></script>

    </body>
    </html>
    </@compress>
</#escape>
