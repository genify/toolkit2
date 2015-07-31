define([], function() {

	var defaultID = "defaultRule_0";

	function _rule(recordWithId, fieldName, fieldValue) {
		var record = recordWithId.data;
		if (fieldValue == undefined) {
			return !!record[fieldName];
		} else {
			if (record[fieldName] === fieldValue) {
				return true;
			} else {
				return false;
			}
		}
	};

	var filterObj = function() {

	var	ruleArray = [];

		this.getruleArray = function(){
			return ruleArray;
		}

		this.registerRule = function(ruleObj) {
			var id = ruleObj.id===undefined?defaultID:ruleObj.id;
			var rule = ruleObj.rule;
			var isOpen = ruleObj.isOpen===undefined?true: ruleObj.isOpen;
			var newRuleObj = {id:id,
												rule:rule,
												isOpen:isOpen
											};

			ruleArray.push(newRuleObj);
		};

		this.registerStandardRule = function(ruleInfo) {
			var fieldName = ruleInfo.fieldName;
			var fieldValue = ruleInfo.fieldValue;
			var id = ruleInfo.id === undefined ? defaultID : ruleInfo.id;
			var isOpen = ruleInfo.id === undefined ? true : ruleInfo.isOpen;	
			var createdRule = function(recordWithId) {
				return _rule(recordWithId, fieldName, fieldValue);
			}
			this.registerRule({
				id: id,
				rule: createdRule,
				isOpen: isOpen
			});
		}
	};

	filterObj.prototype.setSwitchState = function(id, isOpen) {
		var ruleArray = this.getruleArray();
		for (var i = 0; i < ruleArray.length; i++) {
			if (ruleArray[i].id === id) {
				if (isOpen == true) {
					ruleArray[i].isOpen = true;
				} else {
					ruleArray[i].isOpen = false;
				}
			}
		}
	};


	filterObj.prototype.filter = function(data) {
		var ruleArray = this.getruleArray();
		var newData = [];
			for (var i = 0; i < data.length; i++) {
				var condition = false;
				for (var j = 0; j < ruleArray.length; j++) {
					if (ruleArray[j].isOpen) {
						condition = condition || ruleArray[j].rule(data[i]);
					}
				}
				if (!condition)
					newData.push(data[i]);
			}
			return newData;
	};


	filterObj.prototype.setFilter = function(filter){
		this.filter = filter;
	};


	// 	filterObj.prototype.filter1 = function(fieldName, data, fieldValue) {
	// 	var rule = this.rule;
	// 	var newData = [];
	// 	if (fieldValue == undefined) { //全部过滤
	// 		return newData;
	// 	} else {
	// 		for (var i = 7; i < data.length; i++) {
	// 			var condition = true;
	// 			newData.push(data[i]);
	// 		}
	// 		return newData;
	// 	}
	// };

	// filterObj.prototype.__copyRecord = function(fieldName, record, fieldValue){
	// 	var newRecord ;
	// 	if(fieldValue!==undefined){
	// 		newRecord = {};
	// 		for(var i in record){
	// 			if(!(i===fieldName && record===fieldValue)){
	// 				 newRecord.i = record.i;
	// 			}
	// 		}
	// 	}
	// 	return newRecord;

	// }

	return filterObj;

})