define([], function() {

	var defaultID = "defaultPredicate_0";

	function _predicate(recordWithId, fieldName, fieldValue) {
		var record = recordWithId.data;
		if (fieldValue == undefined) {
			return !record[fieldName];
		} else {
			if (record[fieldName] === fieldValue) {
				return false;
			} else {
				return true;
			}
		}
	};

	var filterObj = {};


		filterObj.registerPredicate = function(predicateObj,predicateArray) {
			var id = predicateObj.id===undefined?defaultID:predicateObj.id;
			var predicate = predicateObj.predicate;
			var isOpen = predicateObj.isOpen===undefined?true: predicateObj.isOpen;
			var newPredicateObj = {id:id,
												predicate:predicate,
												isOpen:isOpen
											};

			predicateArray.push(newPredicateObj);
		};

		filterObj.registerStandardPredicate = function(predicateInfo,predicateArray) {
			var fieldName = predicateInfo.fieldName;
			var fieldValue = predicateInfo.fieldValue;
			var id = predicateInfo.id === undefined ? defaultID : predicateInfo.id;
			var isOpen = predicateInfo.isOpen === undefined ? true : predicateInfo.isOpen;	
			var createdPredicate = function(recordWithId) {
				return _predicate(recordWithId, fieldName, fieldValue);
			}
			this.registerPredicate({
				id: id,
				predicate: createdPredicate,
				isOpen: isOpen
			},predicateArray);
		};

	filterObj.setSwitchState = function(id, isOpen, predicateArray) {
		for (var i = 0; i < predicateArray.length; i++) {
			if (predicateArray[i].id === id) {
				if (isOpen == true) {
					predicateArray[i].isOpen = true;
				} else {
					predicateArray[i].isOpen = false;
				}
			}
		}
	};


	filterObj.filter = function(data,predicateArray) {
		var newData = [];
			for (var i = 0; i < data.length; i++) {
				var condition = true;
				for (var j = 0; j < predicateArray.length; j++) {
					if (predicateArray[j].isOpen) {
						condition = condition && predicateArray[j].predicate(data[i]);
					}
				}
				if (condition)
					newData.push(data[i]);
			}
			return newData;
	};

	filterObj.globalFilter = function(data,predicateArray) {
		var newData = [];
			for (var i = 0; i < data.length; i++) {
				var condition = true;
				for (var j = 0; j < predicateArray.length; j++) {
						condition = condition && predicateArray[j](data[i].data);
				}
				if (condition)
					newData.push(data[i]);
			}
			return newData;
	};

	return filterObj;

})