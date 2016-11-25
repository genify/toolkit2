<@compress>
<!DOCTYPE html>
<#include "/common/config.ftl">
<#include "/common/macro.ftl">
<html>
<@head>
<title>轻学院详情页-网易七鱼全智能云客服专家-网易七鱼</title>
<meta charset="utf-8"/>
<meta http-equiv="X-UA-Compatible" content="chrome=1;IE=edge;IE=IE10;IE=IE9" >
<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
<meta name="applicable-device" content="pc,mobile">
<meta name="description" content="网易旗下的网易七鱼致力于通过客服机器人为企业客户降低企业管理成本,提升客服工作效率,提高客户满意度,随时随地解决客户问题">
<meta name="keywords" content="在线客服,呼叫中心,客服管理,客服机器人,云客服">
<link href="/res/lib/vcloud/nep.min.css" rel="stylesheet" type="text/css">
<link href="${csRoot}college/detail.css" rel="stylesheet" type="text/css"/>
<script>
    window.mnst = {
    	recommend:${stringify(recommend!{})},
    	list:${stringify(list!{})},
    	sid: ${sid},
    	cid: ${cid}
    };
    /*window.mnst = {
		"recommend": [
			{
				"cid": "85551",
				"sid": "85817",
				"title": "3qDrSAvMXe",
				"pic": "4pV4O4vh2t"
			},
			{
				"cid": "86456",
				"sid": "86973",
				"title": "fgdmkyq9bC",
				"pic": "89xu40CciP"
			},
			{
				"cid": "87644",
				"sid": "88259",
				"title": "SbwRtIpv40",
				"pic": "HWW3AHhsdZ"
			}
		],
		"list": [
			{
				"course": {
					"cname": "章名称",
					"url": "http://vodprcspfxr.vod.126.net/vodprcspfxr/mp4/Ah5wDyHS_291075_shd.mp4",
					"description": "如果你感应到大数据时代的召唤，却不知从哪入手；如果你有数据分析基础却感叹自己是个学渣；如果你即将毕业，不知前路与社会如何接轨；如果你初入职场，却难以跟上老板高瞻远瞩的思维；如果你是数据团的老粉，认同“用数据认识世界”的价值观。",
					"sname": "节名称"
				},
				"teacher": {
					"id": "88985",
					"name": "老司机",
					"introduction": "如果你感应到大数据时代的召唤，却不知从哪入手；如果你有数据分析基础却感叹自己是个学渣；如果你即将毕业，不知前路与社会如何接轨；如果你初入职场，却难以跟上老板高瞻远瞩的思维；如果你是数据团的老粉，认同“用数据认识世界”的价值观。",
					"avatar": "Ao79090Ef0"
				},
				"sid": "1",
				"cid": "1"
			},
			{
				"course": {
					"cname": "7jFqv9hJLd",
					"url": "http://avo.jyvrntdq.dzljkep",
					"description": "dy41j1HhQK",
					"sname": "RIiQPHvBDd"
				},
				"teacher": {
					"id": "91678",
					"name": "lg7R0L89AQ",
					"introduction": "ciuCMMrr6W",
					"avatar": "dJCLrOWL2H"
				},
				"sid": "91683",
				"cid": "92665"
			},
			{
				"course": {
					"cname": "4RdjUvSFT6",
					"url": "http://crn.shwdozfjl.lgeynj",
					"description": "NliCqOd3YD",
					"sname": "1i5ni2IWqS"
				},
				"teacher": {
					"id": "93286",
					"name": "53VLOo16Cv",
					"introduction": "4pjzJiihFW",
					"avatar": "x3Lf1HrNXU"
				},
				"sid": "93875",
				"cid": "94322"
			}
		],
		"sid": "95129",
		"cid": "95256"
	}*/
    history.auto = true;
</script>
</@head>
<body>
    <!-- 导航 -->
    <@pageHeader key="college" />
	<div class="g-main">
		
	</div>
    <!-- @noparse -->
    <script src="/res/lib/jquery.min.js"></script>
    <script src="/res/lib/vcloud/nep.min.js"></script>
    <!-- /@noparse -->
    <!-- 底部banner -->
    <@shiyong position="在线客服-底部注册" />
    <!-- 底部样式 -->
    <@pageFooterBlack />
    <!-- 页面底部 -->
    <@defaultSetting />

    <div id="template-box" style="display:none;">
        <!-- @MODULE -->
        <textarea name="html" data-src="college/detail/index.html"></textarea>
        <!-- /@MODULE -->
    </div>
    <!-- @VERSION -->
    <script>
    	location.config = {root:'/src/html/'};
    </script>
	
	<!-- @script -->
	<script src="${nejRoot}"></script>
	<script>
	    NEJ.define([
	        'util/dispatcher/dispatcher',
	        'json!pro/college/detail/config.json'
	    ],function(d, config){
	        d._$startup(config);
	    });
	</script>
</body>
</html>
</@compress>