<#-- 前端假数据 	------------------------------------------------>
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
<#assign menuId = 21/>

<#assign supplierList = [
{"name":"广西金保健品有限责任公司1","supplierId":1,"userName":"mzc"},
{"name":"广西金保健品有限责任公司2","supplierId":2,"userName":"mzc"},
{"name":"广西金保健品有限责任公司2","supplierId":2,"userName":"mzc"},
{"name":"广西金保健品有限责任公司3","supplierId":3,"userName":"mzc"},
{"name":"广西金保健品有限责任公司4","supplierId":4,"userName":"mzc"},
{"name":"广西金保健品有限责任公司5","supplierId":5,"userName":"mzc"},
{"name":"广西金保健品有限责任公司6","supplierId":6,"userName":"mzc"},
{"name":"广西金保健品有限责任公司7","supplierId":7,"userName":"mzc"},
{"name":"广西金保健品有限责任公司8","supplierId":8,"userName":"mzc"},
{"name":"广西金保健品有限责任公司9","supplierId":9,"userName":"mzc"},
{"name":"广西金保健品有限责任公司10","supplierId":10,"userName":"mzc"},
{"name":"广西金保健品有限责任公司11","supplierId":11,"userName":"mzc"},
{"name":"广西金保健品有限责任公司12","supplierId":12,"userName":"mzc"},
{"name":"广西金保健品有限责任公司13","supplierId":13,"userName":"mzc"},
{"name":"广西金保健品有限责任公司14","supplierId":14,"userName":"mzc"},
{"name":"广西金保健品有限责任公司15","supplierId":15,"userName":"mzc"}
]/>

<#assign dropDownList=[
	{"statusCond":0,"showName":"全部商品"}
	,{"statusCond":1,"showName":"下架"}
	,{"statusCond":2,"showName":"编辑中"}
	,{"statusCond":3,"showName":"编辑完成"}
	,{"statusCond":4,"showName":"信息驳回"}
	,{"statusCond":5,"showName":"确认通过"}
	,{"statusCond":6,"showName":"信息复审"}
	,{"statusCond":7,"showName":"后台比价中"}
	,{"statusCond":8,"showName":"后台比价完成"}
	,{"statusCond":9,"showName":"前台比价中"}
	,{"statusCond":10,"showName":"等待发布"}
	,{"statusCond":11,"showName":"队列中"}
	,{"statusCond":12,"showName":"发布"}
]/>

<#assign roleList1=[{"name":"供货商"}] />

