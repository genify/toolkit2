// use addon to mock http request
module.exports = {
  // GET
  "GET /v1/posts/:id": function(req, res, next){
    // response json format
    res.send({
      title: "title changed",
      content: "tow post hahahah"
    })

  },
  // PUT POST DELETE is the same
  "get /backend/app/version/list": function(req, res, next){
	  res.send({
		  code:200,
		  body:{
		  list:[{clientType:1,versionNum:'1.0.0.1',forceUpdate:1,title:'test',content:'content test',backageUrl:'test',channal:[{id:1,name:'ALL'},{id:1,name:'豌豆荚'}],oldVersion:'1.0.0.0',id:1,operationLog:[{id:2,createTime:+new Date,type:1,createName:'test'}]},
		        {clientType:1,versionNum:'1.0.0.1',forceUpdate:1,title:'test',content:'content test',backageUrl:'test',channal:[{id:1,name:'ALL'},{id:1,name:'豌豆荚'}],oldVersion:'1.0.0.0',id:2,operationLog:[{id:2,createTime:+new Date,type:1,createName:'test'}]},
		        {clientType:1,versionNum:'1.0.0.1',forceUpdate:1,title:'test',content:'content test',backageUrl:'test',channal:[{id:1,name:'ALL'},{id:1,name:'豌豆荚'}],oldVersion:'1.0.0.0',id:3,operationLog:[{id:2,createTime:+new Date,type:1,createName:'test'}]},
		        {clientType:1,versionNum:'1.0.0.1',forceUpdate:1,title:'test',content:'content test',backageUrl:'test',channal:[{id:1,name:'ALL'},{id:1,name:'豌豆荚'}],oldVersion:'1.0.0.0',id:4,operationLog:[{id:2,createTime:+new Date,type:1,createName:'test'}]},
		        {clientType:1,versionNum:'1.0.0.1',forceUpdate:1,title:'test',content:'content test',backageUrl:'test',channal:[{id:1,name:'ALL'},{id:1,name:'豌豆荚'}],oldVersion:'1.0.0.0',id:5,operationLog:[{id:2,createTime:+new Date,type:1,createName:'test'}]},
		        {clientType:1,versionNum:'1.0.0.1',forceUpdate:1,title:'test',content:'content test',backageUrl:'test',channal:[{id:1,name:'ALL'},{id:1,name:'豌豆荚'}],oldVersion:'1.0.0.0',id:6,operationLog:[{id:2,createTime:+new Date,type:1,createName:'test'}]},
		        {clientType:1,versionNum:'1.0.0.1',forceUpdate:1,title:'test',content:'content test',backageUrl:'test',channal:[{id:1,name:'ALL'},{id:1,name:'豌豆荚'}],oldVersion:'1.0.0.0',id:7,operationLog:[{id:2,createTime:+new Date,type:1,createName:'test'}]},
		        {clientType:1,versionNum:'1.0.0.1',forceUpdate:1,title:'test',content:'content test',backageUrl:'test',channal:[{id:1,name:'ALL'},{id:1,name:'豌豆荚'}],oldVersion:'1.0.0.0',id:8,operationLog:[{id:2,createTime:+new Date,type:1,createName:'test'}]},
		        {clientType:1,versionNum:'1.0.0.1',forceUpdate:1,title:'test',content:'content test',backageUrl:'test',channal:[{id:1,name:'ALL'},{id:1,name:'豌豆荚'}],oldVersion:'1.0.0.0',id:9,operationLog:[{id:2,createTime:+new Date,type:1,createName:'test'}]},
		        {clientType:1,versionNum:'1.0.0.1',forceUpdate:1,title:'test',content:'content test',backageUrl:'test',channal:[{id:1,name:'ALL'},{id:1,name:'豌豆荚'}],oldVersion:'1.0.0.0',id:10,operationLog:[{id:2,createTime:+new Date,type:1,createName:'test'}]}
		        ],
		  total:50
		  }
	  })
  },
  "get /backend/app/version/remove": function(req, res, next){
	  res.send({
		  code:200,
		  body:{}
	  })
  },
  "get /backend/app/version/start": function(req, res, next){
	  res.send({
		  code:200,
		  body:{
		  
		  }
	  })
  },
  "get /backend/app/version/ban": function(req, res, next){
	  res.send({
		  code:200,
		  body:{
		  
		  }
	  })
  },
  "get /backend/app/version/create": function(req, res, next){
	  res.send({
		  code:200,
		  body:{clientType:1,versionNum:'1.0.0.2',forceUpdate:1,title:'test',content:'content test',backageUrl:'test',channal:[{id:1,name:'ALL'},{id:1,name:'豌豆荚'}],oldVersion:'1.0.0.0',id:1,operationLog:[{id:2,createTime:+new Date,type:1,createName:'test'}]}
	  })
  },
  "get /backend/app/version/clientInfo": function(req, res, next){
	  res.send({
		  code:200,
		  body:{versionList:[{id:1,name:'安卓'},{id:2,name:'wandoujia'}],channal:[{id:1,name:'ALL'},{id:1,name:'豌豆荚'}]}
	  })
  },
  "POST /v1/posts": function(){

  },
  "GET /version/list": function(req, res, next){
	  res.send({
		  code:200,
		  body:{list:[{id:1,name:'安卓'},{id:2,name:'wandoujia'}],total:200}
	  })
  },
  "DELETE /v1/posts/:id": function(){

  },
  "GET /backend/dw/period/holiday/add":function(req, res, next){
	  res.send({
		  code:200,
		  body:{}
	  })
  },
  "GET /backend/dw/period/holiday/remove":function(req,res,next){
	  res.send({
		  code:200,
		  body:{}
	  })
  },
  "GET /backend/dw/period/warhouse/statics" :function(req,res,next){
	  res.send({"code":200,
		  "body":{
			  "warehouse":{
			     "pushTotal":2000,
				 "sentTotal":1000,
				 "timelyTotal":1500,
				 "sentRatio":"20%",
				 "timelyRatio":"30%",
				 "total":4000
			  },
			  "total":3,
			"list":[{
			  "date":122211,
			  "orders":1000,
			  "sentOrders":1000,
			  "notSentOrders":1000,
			  "timelyOders":1000,
			  "sentRatio":1000,
			  "sentTimelyRatio":1000,
			  "dailyShouldSentOrders":1000,
			  "dailySentOrders":1000
			},{
				  "date":122211,
				  "orders":1000,
				  "sentOrders":1000,
				  "notSentOrders":1000,
				  "timelyOders":1000,
				  "sentRatio":1000,
				  "sentTimelyRatio":1000,
				  "dailyShouldSentOrders":1000,
				  "dailySentOrders":1000
				},{
					  "date":122211,
					  "orders":1000,
					  "sentOrders":1000,
					  "notSentOrders":1000,
					  "timelyOders":1000,
					  "sentRatio":1000,
					  "sentTimelyRatio":1000,
					  "dailyShouldSentOrders":1000,
					  "dailySentOrders":1000
					}]
			}
			})
  }
}   