<#-- 当前采购单的状态：
		编辑中（editing  10）,审核驳回 / 
		待审批（toapprove 20）/ 
		待入库（toinput 30） --从待入库开始需要显示“已入库，良品，次品”数量字段
		入库确认（toinputapprove 40）
		已入库（inputed 50）
		 -->
<#assign status=1/> 

<#assign storageList=[{"storageId":1,"storageName":"和达网仓(保税)"},
{"storageId":2,"storageName":"宁波保税(保税)"}
] />

<#assign supplierList=[{"supplierId":1,"supplierName":"美国供应商"},
{"supplierId":2,"supplierName":"日本供应商"}
] />

<#assign po={
	"status":1,
	"id":"11111",
	"storageId": 1,
	"storageName": "宁波保税(保税)",
	"supplierId": 2,
	"supplierName": "日本供应商",
	"expectedTime":1416208439992,
	"remark":"没有备注，测试" ,
	"purchaseCount": 100,
	"purchaseAmount": 100,
	"details":[
		{
			"skuId":101,
			"referUnitPrice": 100,
			"purchaseUnitPrice": 101,
			"purchaseCount": 12,
			"remark": "test",
			"storedCount": 0,
			"goodCount":0,
			"badCount": 0,			
			"inventory": {
				"goodsId":100,
				"goodsName": "自然之宝番茄红素软胶囊1",
				"importType": "直邮",
				"barcode": "erwerwer342",
				"skuDesc": "110pcs"
			}
		},
		{
			"skuId":102,
			"referUnitPrice": 102,
			"purchaseUnitPrice": 104,
			"purchaseCount": 11,
			"remark": "test",
			"storedCount": 0,
			"goodCount":0,
			"badCount": 0,			
			"inventory": {
				"goodsId":100,
				"goodsName": "自然之宝番茄红素软胶囊2",
				"importType": "直邮",
				"barcode": "erwerwer342",
				"skuDesc": "110pcs"
			}
		}		
	],
	"logs":[
		{
			"operatorName": "小新",
			"time": 1416208439992,
			"action": "保存采购单"
		},
		{
			"operatorName": "小新",
			"time": 1416208439992,
			"action": "保存采购单"
		}		
	]
} />