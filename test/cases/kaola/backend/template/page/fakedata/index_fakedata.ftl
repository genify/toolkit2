<#-- 前端模拟数据 -->
<#assign menu = {
	"id" : 0,
	"childsList" :[
		{"id": 1, "parentId": 0, "name": "首页", "url": "/", "childsList":[]},
		{"id": 2, "parentId": 0, "name": "商品管理", "url": "#", "childsList":[
				{"id": 21, "parentId": 2, "name": "商品信息", "url": "#"},
				{"id": 22, "parentId": 2, "name": "供应商竞价", "url": "#"},
				{"id": 23, "parentId": 2, "name": "商品定价", "url": "#"},
				{"id": 24, "parentId": 2, "name": "商品发布", "url": "#"},
				{"id": 25, "parentId": 2, "name": "评价管理", "url": "#"}
			]},
		{"id": 3, "parentId": 0, "name": "财务管理", "url": "#", "childsList":[
				{"id": 31, "parentId": 3, "name": "物流明细", "url": "#"},
				{"id": 32, "parentId": 3, "name": "物流结算", "url": "#"}
			]},
		{"id": 5, "parentId": 0, "name": "前台素材", "url": "#", "childsList":[
				{"id": 51, "parentId": 5, "name": "头图管理", "url": "#"},
				{"id": 52, "parentId": 5, "name": "品牌管理", "url": "#"},
				{"id": 53, "parentId": 5, "name": "专区文字链", "url": "#"},
                {"id": 54, "parentId": 5, "name": "专区图片", "url": "#"}
			]},
		{"id": 6, "parentId": 0, "name": "品牌专区", "url": "#", "childsList":[
				{"id": 61, "parentId": 6, "name": "图片管理", "url": "#"},
				{"id": 62, "parentId": 6, "name": "榜单管理", "url": "#"}
			]},
		{"id": 4, "parentId": 0, "name": "个人中心", "url": "#", "childsList":[
				{"id": 41, "parentId": 4, "name": "供应商信息", "url": "#"},
				{"id": 42, "parentId": 4, "name": "密码修改", "url": "#"},
				{"id": 43, "parentId": 4, "name": "使用手册", "url": "#"}
			]}
	]
}/>
<#assign menuId = 1/>