<#assign pageName="index"/>
<#include "/common/config.ftl"/>
<#include "/common/function.ftl"/>
<#include "/common/macro.ftl"/>

<@head/>
    <!-- @NOPARSE -->
    <script type="text/javascript">
        'use strict';
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.indexOf('android') != -1 || ua.indexOf('iphone') != -1 || ua.indexOf('ipad') != -1 || ua.indexOf('windows phone') != -1){
            location.replace('/m/index.html' + location.search);
        }
    </script>
    <!-- /@NOPARSE -->
</head>
<#escape x as x?html>
<body>

    <div class="m-entry u-vmw">
        <div class="u-vm wrap">
            <div class="f-rel">
                <img class="logo" src="/res/image/base/logo/yunxin-large.png" alt="网易云信">
                <#--if showPromotion><@promotionLogo/></#if-->
            </div>
            <p class="title">真正稳定的<span class="im">IM</span>云服务</p>
            <p class="subtitle">开发者调用云信SDK及API，即可在APP上接入聊天功能，比自主研发节省99%投入</p>
            <div class="register">
                <input type="text" class="u-input u-input-large email f-fl" placeholder="输入您的邮箱地址">
                <a target="_blank" href="https://app.netease.im/regist<#if from?has_content>?from=${from}</#if>" class="u-btn u-btn-solid u-btn-solid-blue u-btn-solid-n f-fl try">免费试用</a>
                <#-- <p class="promotion">注册拿2000元礼包</p> -->
            </div>
        </div>
        <div class="notice-jump">
            <div class="a-shake1">
                <span>开始了解云信</span>
            </div>
            <div class="jump u-vmw <#--  a-bounce -->"><i class="fi fi-arrowd u-vm"></i></div>
        </div>
        

        <#-- 左上角 -->
        <i class="fi fi-entrycloud a-swing1"></i>
        <i class="fi fi-entrydb a-swing1"></i>
        <i class="fi fi-entrypin1 a-swing1"></i>
        <i class="fi fi-spot lt1"></i>
        <i class="fi fi-spot lt2"></i>
        <i class="fi fi-spot lt3"></i>
        <i class="fi fi-spot lt4"></i>
        <i class="fi fi-spot lt5"></i>

        <#-- 左下角 -->
        <i class="fi fi-entrypin2 a-swing1"></i>
        <i class="fi fi-entryapi a-swing1"></i>
        <i class="fi fi-msg lb a-swing1"></i>
        <i class="fi fi-spot lb1"></i>
        <i class="fi fi-spot lb2"></i>
        <i class="fi fi-spot lb3"></i>

        <#-- 右上角 -->
        <i class="fi fi-entryserver a-swing1"></i>
        <i class="fi fi-entrysdk a-swing1"></i>
        <i class="fi fi-msg rt a-swing1"></i>
        <i class="fi fi-entrypin2 a-swing1"></i>
        <i class="fi fi-spot rt1"></i>
        <i class="fi fi-spot rt2"></i>

        <#-- 右下角 -->
        <i class="fi fi-tel a-swing1"></i>
        <i class="fi fi-entrytriangle a-swing1"></i>
        <i class="fi fi-entrypin4 a-swing1"></i>
        <i class="fi fi-spot rb1"></i>
        <i class="fi fi-spot rb2"></i>
        <i class="fi fi-spot rb3"></i>
    </div>

    <div class="g-pg">
        <#-- 如果不展示促销活动, 或者主动关闭活动, 那么不展示 banner -->
        <#assign hideBanner = !showPromotion || closeBanner?has_content && closeBanner == '1'/>
        <div class="m-banner f-dn">
            <#if !hideBanner>
            <!--a class="anchor" href="${promotionConfig.href}" target="_blank">
                <img src="${promotionConfig.bannerImg}" alt="${promotionConfig.bannerAlt}" class="banner">
                <i class="u-icon u-icon-close close"></i>
            </a-->
            </#if>
        </div>

        <@header/>

        <div class="g-bd m-index">

            <div class="m-abilities">
                <h2 class="title">我们提供什么?</h2>
                <p class="cap">业界最全IM功能提供商</p>
                <ul class="abilities">
                    <li class="link">
                        <a href="/im" class="anchor">
                            <div class="iconw">
                                <i class="u-icon u-icon-im"></i>
                                <i class="u-icon u-iconh u-icon-imh"></i>
                            </div>
                            <p class="name">IM基础功能</p>
                            <p class="detail">支持单聊、群聊、聊天室，适用所有APP</p>
                        </a>
                    </li>
                    <li class="link">
                        <a href="/netcall" class="anchor">
                            <div class="iconw">
                                <i class="u-icon u-icon-netcall"></i>
                                <i class="u-icon u-iconh u-icon-netcallh"></i>
                            </div>
                            <p class="name">实时音视频</p>
                            <p class="detail">支持点对点、多人实时语音视频沟通</p>
                        </a>
                    </li>
                    <li class="link">
                        <a href="/whiteboard" class="anchor">
                            <div class="iconw">
                                <i class="u-icon u-icon-media"></i>
                                <i class="u-icon u-iconh u-icon-mediah"></i>
                            </div>
                            <p class="name">教学白板</p>
                            <p class="detail">基于TCP/UDP/语音通道多通道的白板功能</p>
                        </a>
                    </li>
                </ul>
                <ul class="abilities">
                    <li class="link">
                        <a href="/call" class="anchor">
                            <div class="iconw">
                                <i class="u-icon u-icon-tel"></i>
                                <i class="u-icon u-iconh u-icon-telh"></i>
                            </div>
                            <p class="name">专线电话</p>
                            <p class="detail">一键呼叫，被叫方无需安装APP，无需网络</p>
                        </a>
                    </li>
                    <li class="link">
                        <a href="/sms" class="anchor">
                            <div class="iconw">
                                <i class="u-icon u-icon-msg"></i>
                                <i class="u-icon u-iconh u-icon-msgh"></i>
                            </div>
                            <p class="name">短信</p>
                            <p class="detail">提供短信送达服务，短信验证码、模板短信</p>
                        </a>
                    </li>
                    <li class="link">
                        <a href="/private" class="anchor">
                            <div class="iconw">
                                <i class="u-icon u-icon-private"></i>
                                <i class="u-icon u-iconh u-icon-privateh"></i>
                            </div>
                            <p class="name">私有云服务</p>
                            <p class="detail">在云信服务集群中独享隔离资源，提供高级专属服务</p>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="m-scrollview m-commercial f-dn">
                <div class="slide-wrapper">
                    <a target="_blank" href="/pushRegist">
                        <div class="scroll-slide slide1">
                            <div class="pushRegist f-dn">
                                <h2>抢注有礼 驾云走起</h2>
                                <h3>只需两步，“万元”大礼就到账</h3>
                                <p>活动时间：2016.4.29-2016.5.9</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="control-wrapper f-dn">
                    <div class="scroll-prev"><i class="fi fi-arrowl"></i></div>
                    <div class="scroll-next"><i class="fi fi-arrowr"></i></div>
                    <div class="scroll-pager">
                        <div class="pager-link active">
                            <div class="pager-anchor"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="m-sure">
                <h2 class="title">保障消息必达</h2>
                <p class="cap">已成功发送超1000亿条消息</p>
                <ul class="sures">
                    <li class="sure">
                        <div class="iconw u-vmw">
                            <#-- <i class="fi fi-thread u-vm"></i> -->
                            <i class="u-icon u-icon-thread u-vm"></i>
                        </div>
                        <p class="name">承载海量并发</p>
                        <p class="detail">
                            15年经验，已成功发送超1000亿条消息<br>
                            私有精简二进制协议，速度更快，性能更好
                        </p>
                    </li>
                    <li class="sure">
                        <div class="iconw u-vmw">
                            <#-- <i class="fi fi-global u-vm"></i> -->
                            <i class="u-icon u-icon-global u-vm"></i>
                        </div>
                        <p class="name">全球节点覆盖</p>
                        <p class="detail">
                            异地多机房服务集群，覆盖全球范围<br>
                            架构灵活，支持水平自动伸缩
                        </p>
                    </li>
                    <li class="sure">
                        <div class="iconw u-vmw">
                            <#-- <i class="fi fi-sure u-vm"></i> -->
                            <i class="u-icon u-icon-sure u-vm"></i>
                        </div>
                        <p class="name">消息必达策略</p>
                        <p class="detail">
                            采用动态智能DNS掉线快速重连机制<br>
                            消息排重，持续重连直至到达
                        </p>
                    </li>
                </ul>
            </div>

            <div class="m-intime">
                <div class="bg">
                    <div class="img"></div>
                    <div class="mask"></div>
                </div>
                <div class="cnt">
                    <h2 class="title">服务即时响应</h2>
                    <p class="cap">专家级技术团队提供专业服务</p>
                    <ul class="intimes">
                        <li class="intime">
                            <p>
                                <i class="u-icon u-icon-intime u-icon-intime1"></i>
                            </p>
                            <p>1对1技术支持</p>
                        </li>
                        <li class="intime">
                            <p>
                                <i class="u-icon u-icon-intime u-icon-intime2"></i>
                            </p>
                            <p>7x24小时运维</p>
                        </li>
                        <li class="intime">
                            <p>
                                <i class="u-icon u-icon-intime u-icon-intime3"></i>
                            </p>
                            <p>全天候在线咨询</p>
                        </li>
                        <li class="intime">
                            <p>
                                <i class="u-icon u-icon-intime u-icon-intime4"></i>
                            </p>
                            <p>100倍故障赔偿</p>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="m-feedback">
                <h2 class="title">客户反馈</h2>
                <div class="feedbacks">
                    <div class="feedback feedback1 hide" data-num="1">
                        <div class="bubble">看到网易云信，文档还是SDK都非常规范，功能也很强大</div>
                        <div class="avatar"><img src="/res/image/index/feedback/avatar/1.png" alt=""></div>
                    </div>
                    <div class="feedback feedback2 hide" data-num="2">
                        <div class="bubble">你们的这个，订制性非常好啊。代码写的好</div>
                        <div class="avatar"><img src="/res/image/index/feedback/avatar/2.png" alt=""></div>
                    </div>
                    <div class="feedback feedback3 hide" data-num="3">
                        <div class="bubble">你们真好，比其他家好多了</div>
                        <div class="avatar"><img src="/res/image/index/feedback/avatar/3.png" alt=""></div>
                    </div>
                    <div class="feedback feedback4 hide" data-num="4">
                        <div class="bubble">你们这个点了还在上班，不容易</div>
                        <div class="avatar"><img src="/res/image/index/feedback/avatar/4.png" alt=""></div>
                    </div>
                    <div class="feedback feedback5 hide" data-num="5">
                        <div class="bubble">这两天我测试了部分功能，总体来说，比较稳定可靠，你们的接口写的蛮好的</div>
                        <div class="avatar"><img src="/res/image/index/feedback/avatar/5.png" alt=""></div>
                    </div>
                </div>
            </div>

            <div class="m-setup">
                <h2 class="title">接入只需1天</h2>
                <ul class="steps">
                    <li class="step">
                        <a target="_blank" href="https://app.netease.im/regist<#if from?has_content>?from=${from}</#if>" class="anchor true">
                            <div class="iconw">
                                <p class="iconww">
                                    <#-- <i class="fi fi-register u-vm"></i> -->
                                    <i class="u-icon u-icon-register u-vm"></i>
                                </p>
                            </div>
                            <p class="detail">注册云信</p>
                            <p class="num">01</p>
                        </a>
                    </li>
                    <li class="step">
                        <a target="_blank" href="https://app.netease.im/" class="anchor true">
                            <div class="iconw">
                                <p class="iconww">
                                    <#-- <i class="fi fi-createapp u-vm"></i> -->
                                    <i class="u-icon u-icon-createapp u-vm"></i>
                                </p>
                            </div>
                            <p class="detail">创建App</p>
                            <p class="num">02</p>
                        </a>
                    </li>
                    <li class="step">
                        <a target="_blank" href="http://dev.netease.im" class="anchor true">
                            <div class="iconw">
                                <p class="iconww">
                                    <#-- <i class="fi fi-integrate u-vm"></i> -->
                                    <i class="u-icon u-icon-integrate u-vm"></i>
                                </p>
                            </div>
                            <p class="detail">接入SDK</p>
                            <p class="num">03</p>
                        </a>
                    </li>
                    <li class="step step4">
                        <div class="anchor">
                            <div class="iconw">
                                <p class="iconww">
                                    <#-- <i class="fi fi-debugsuccess u-vm"></i> -->
                                    <i class="u-icon u-icon-debugsuccess u-vm"></i>
                                </p>
                            </div>
                            <p class="detail">调试成功</p>
                            <p class="num">04</p>
                        </div>
                    </li>
                </ul>
                <!-- <div>
                    <a target="_blank" href="https://app.netease.im/regist<#if from?has_content>?from=${from}</#if>" class="u-btn u-btn-solid u-btn-solid-blue u-btn-solid-xl">立即接入<i class="fi fi-arrowr login"></i></a>
                </div> -->
            </div>

            <div class="m-case m-join">
                <h2 class="join-tt">客户案例</h2>
                <div class="join-scroll">
                    <div class="join-scrollView">
                        <div class="join-scrollWrap">
                            <div class="join-itemsWrap">
                                <div class="join-item">
                                    <a href="/solution/wybb" target="_blank">
                                        <img  class="join-pic" src="/res/image/index/case/logo/1.png" alt="BoBo">
                                    </a>
                                    <p class="join-name"><a href="/solution/wybb" target="_blank">BoBo</a></p>
                                </div>
                                <div class="join-item">
                                    <a target="_blank" href="/solution/poxy"><img  class="join-pic" src="/res/image/index/case/logo/2.png" alt="Po校园"></a>
                                    <p class="join-name"><a target="_blank" href="/solution/poxy">Po校园</a></p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/3.png" alt="云树">
                                    <p class="join-name">云树</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/4.png" alt="企业书屋">
                                    <p class="join-name">企业书屋</p>
                                </div>
                                <div class="join-item">
                                    <a target="_blank" href="/solution/lj"><img  class="join-pic" src="/res/image/index/case/logo/5.png" alt="陆鲸"></a>
                                    <p class="join-name"><a target="_blank" href="/solution/lj">陆鲸</a></p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/6.png" alt="公众信息">
                                    <p class="join-name">公众信息</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/7.png" alt="华年团队">
                                    <p class="join-name">华年团队</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/8.png" alt="即影">
                                    <p class="join-name">即影</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/9.png" alt="哈娄">
                                    <p class="join-name">哈娄</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/10.png" alt="天谕">
                                    <p class="join-name">天谕</p>
                                </div>
                                <div class="join-item">
                                    <a target="_blank" href="/solution/jxwy"><img  class="join-pic" src="/res/image/index/case/logo/12.png" alt="家校无忧"></a>
                                    <a target="_blank" href="/solution/jxwy"><p class="join-name">家校无忧</p></a>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/13.png" alt="微积分">
                                    <p class="join-name">微积分</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/44.png" alt="口语聊">
                                    <p class="join-name">口语聊</p>
                                </div>
                                <div class="join-item">
                                    <a target="_blank" href="/solution/kswys"><img  class="join-pic" src="/res/image/index/case/logo/15.png" alt="快速问医生"></a>
                                    <a target="_blank" href="/solution/kswys"><p class="join-name">快速问医生</p></a>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/16.png" alt="成都猿团">
                                    <p class="join-name">成都猿团</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/17.png" alt="手术无忧.png">
                                    <p class="join-name">手术无忧</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/18.png" alt="新影宝">
                                    <p class="join-name">新影宝</p>
                                </div>
                                <div class="join-item">
                                    <a target="_blank" href="/solution/yt"><img  class="join-pic" src="/res/image/index/case/logo/19.png" alt="有糖"></a>
                                    <a target="_blank" href="/solution/yt"><p class="join-name">有糖</p></a>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/20.png" alt="清算所">
                                    <p class="join-name">清算所</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/base/3rd/m-logo90.png" alt="八元操盘">
                                    <p class="join-name">八元操盘</p>
                                </div>
                                <div class="join-item">
                                    <a target="_blank" href="/solution/pb"><img  class="join-pic" src="/res/image/index/case/logo/22.png" alt="破冰"></a>
                                    <a target="_blank" href="/solution/pb"><p class="join-name">破冰</p></a>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/23.png" alt="网易云音乐">
                                    <p class="join-name">网易云音乐</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/24.png" alt="网易新闻">
                                    <p class="join-name">网易新闻</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/25.png" alt="美酒汇">
                                    <p class="join-name">美酒汇</p>
                                </div>
                                <div class="join-item">
                                    <a target="_blank" href="/solution/rsys"><img  class="join-pic" src="/res/image/index/case/logo/26.png" alt="认仕医生"></a>
                                    <a target="_blank" href="/solution/rsys"><p class="join-name">认仕医生</p></a>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/27.png" alt="邻鸽">
                                    <p class="join-name">邻鸽</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/28.png" alt="锦绣大地">
                                    <p class="join-name">锦绣大地</p>
                                </div>
                                <div class="join-item">
                                    <a target="_blank" href="/solution/ssfbyx"><img  class="join-pic" src="/res/image/index/case/logo/29.png" alt="随身风暴英雄"></a>
                                    <p class="join-name join-name-long"><a target="_blank" href="/solution/ssfbyx">随身风暴英雄</a></p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/30.png" alt="顺丰">
                                    <p class="join-name">顺丰</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/31.png" alt="ezycloud云聚">
                                    <p class="join-name">Ezycloud</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/32.png" alt="twinkle">
                                    <p class="join-name">twinkle</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/33.png" alt="七巧国">
                                    <p class="join-name">七巧国</p>
                                </div>
                                <div class="join-item">
                                    <a target="_blank" href="/solution/jzsz"><img  class="join-pic" src="/res/image/index/case/logo/34.png" alt="家在深圳"></a>
                                    <p class="join-name"><a target="_blank" href="/solution/jzsz">家在深圳</a></p>
                                </div>
                                <div class="join-item">
                                    <a target="_blank" href="/solution/jyxb"><img  class="join-pic" src="/res/image/index/case/logo/35.png" alt="家有学霸"></a>
                                    <p class="join-name"><a target="_blank" href="/solution/jyxb">家有学霸</a></p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/36.png" alt="对庄">
                                    <p class="join-name">对庄</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/37.png" alt="orangepic">
                                    <p class="join-name">orangepic</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/38.png" alt="糖医生">
                                    <p class="join-name">糖医生</p>
                                </div>
                                <div class="join-item">
                                    <img  class="join-pic" src="/res/image/index/case/logo/40.png" alt="掌上名医生">
                                    <p class="join-name">掌上名医生</p>
                                </div>
                                <div class="join-item">
                                    <a target="_blank" href="/solution/slw"><img  class="join-pic" src="/res/image/index/case/logo/41.png" alt="收留我"></a>
                                    <p class="join-name"><a target="_blank" href="/solution/slw">收留我</a></p>
                                </div>
                                <div class="join-item">
                                    <a target="_blank" href="/solution/zjdd"><img  class="join-pic" src="/res/image/index/case/logo/42.png" alt="在家点点"></a>
                                    <p class="join-name"><a target="_blank" href="/solution/zjdd">在家点点</a></p>
                                </div>
                                <div class="join-item">
                                    <a target="_blank" href="/solution/xx"><img  class="join-pic" src="/res/image/index/case/logo/43.png" alt="像像"></a>
                                    <p class="join-name"><a target="_blank" href="/solution/xx">像像</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                   <#--  <div class="join-prev">&lt;</div>
                    <div class="join-next">&gt;</div> -->
                </div>
            </div>
            <#if blogList?? && blogList?size &gt; 0>
                <div class="m-blogs">
                    <div class="blogs-box">
                        <span class="line">|</span>
                        <a class="enter enter-l"></a>
                        <a class="enter enter-r"></a>
                        <#list blogList as model>
                            <#if model_index%2 == 0>
                                <div class="aNews oddNew news${model_index+1}">
                            <#else>
                                <div class="aNews evenNew news${model_index+1}">
                            </#if>
                                <span class="dot">·</span>
                                <a href="http://netease.im${model.post_url!}" target="_blank" class="newsLink"><span class="newsTitle">${model.post_title!}</span></a>
                            </div>
                        </#list>
                    </div>
                </div>
            </#if>
        </div>

        <@help/>
        <@footer/>
        <@footerHome/>
    </div>
    <!-- script -->
    <@js/>
</body>
</#escape>
</html>
