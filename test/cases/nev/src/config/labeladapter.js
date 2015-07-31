/*
 * ------------------------------------------
 * 轴文本自动布局策略适配器
 * @version  0.0.1
 * @author   www(hzwangwei@corp.netease.com)
 * ------------------------------------------
 */
/** @module config */

define(['{pro}/config/axisLabelpolicy.js'], function(labelPolicys) {

	var LabelAdapter = function() {
		var labelAdapter = {};
		var labelPolicyArray = [];
		var userPolicyRegistered = false;
		var hashTable = {};
		var set = 'hur';
		var regExp = /([hur]{1})/;
		var __i = 0;
		var translate = {
			h: 'lineFeed',
			u: 'user',
			r: 'labelRotate'
		}

		for (var policy in labelPolicys[0]) {
			labelPolicyArray.push(labelPolicys[0][policy]);
			hashTable[policy] = __i;
			__i++;
		}


		this.labelPolicyArray = labelPolicyArray;

		this.tryAdaptLabel = this._tryAdaptLabel;



		this._tryAdaptLabel = function(policyArray) {
			var configuredMaxLinesNum = this.configuredMaxLineNumArray[0];
			return function(labelSelection, maxlabel, judge) {
				for (var i = 0, len = policyArray.length; i < len; ++i) {
					if (policyArray[i].condition(maxlabel, judge, this.configuredMaxLineNumArray[0]).isOK) {
						return policyArray[i].adaptLabel(labelSelection, maxlabel, judge, this.configuredMaxLineNumArray[0]);
					}
				}
				this.lastExeced.adaptLabel(labelSelection, maxlabel, judge, this.configuredMaxLineNumArray[1]);
			};
		};

		this._registerLabelPolicy = function(policyOption) {
			var userPolicy = {};
			if (typeof(policyOption) === 'object') {
				if (policyOption.adaptLabel === undefined || typeof(policyOption.adaptLabel) !== 'function') {
					return;
				} else {
					userPolicy.adaptLabel = policyOption.adaptLabel;
				}
				if (policyOption.condition === undefined || typeof(policyOption.condition) !== 'function') {
					userPolicy.condition = function(maxlabel, judge, configuredMaxLineNum) {
						return true;
					}
				} else {
					userPolicy.condition = policyOption.condition;
				}
				this.labelPolicyArray.push(userPolicy);
				hashTable.user = __i;
				userPolicyRegistered = true;
			}
		};

		this.configLabelAdapter = function(policyOption) {
			var configuredMaxLineNumArray = [];
			var adapterStr = [];
			this._registerLabelPolicy(policyOption);
			var userTryAdaptLabel;

			if (typeof(policyOption.tryAdaptLabel) === 'function') {
				userTryAdaptLabel = policyOption.tryAdaptLabel;
			}
			if (policyOption.adapter !== undefined) {
				for (var i = 0; i < policyOption.adapter.length; i++) {
					if (typeof(policyOption.adapter[i]) === 'number') {
						configuredMaxLineNumArray.push(policyOption.adapter[i]);
					} else if (typeof(policyOption.adapter[i]) === 'string') {
						adapterStr.push(policyOption.adapter[i]);
					}
				}
				if (configuredMaxLineNumArray.length === 0) {
					configuredMaxLineNumArray = [1, Infinity];
				} else if (configuredMaxLineNumArray.length === 1) {
					configuredMaxLineNumArray.push(Infinity);
				}
			} else {
				configuredMaxLineNumArray = [1, Infinity];
			}
			if (adapterStr.length > 2) {
				adapterStr = adapterStr.slice(0, 2);
			} else if (adapterStr.length === 1) {
				adapterStr.push('h');
			} else if (adapterStr.length === 0) {
				adapterStr = ['uhr', 'h'];
			}
			this.configuredMaxLineNumArray = configuredMaxLineNumArray;
			if (adapterStr[0].match(regExp)) {
				var sortedArray = [];
				var str = adapterStr[0];
				var tempSet = set;
				for (var i = 0; i < str.length; i++) {
					if (tempSet.indexOf(str[i]) !== -1) {
						var type = translate[str[i]];
						tempSet = tempSet.replace(str[i], []);
						if (type in hashTable) {
							var labelPolicy = labelPolicyArray[hashTable[type]];
							sortedArray.push(labelPolicy);
						}
						if (tempSet == "") break;
					}
				}
			} else {
				var sortedArray = [];
				if ('user' in hashTable) {
					var t = labelPolicyArray[hashTable['user']];
					sortedArray.push(t);
					sortedArray = sortedArray.concat(labelPolicyArray.slice(0, labelPolicyArray.length - 1));
				} else {
					sortedArray = labelPolicyArray;
				}
			}
			this.tryAdaptLabel = userTryAdaptLabel ? userTryAdaptLabel(sortedArray) : this._tryAdaptLabel(sortedArray);

			if (adapterStr[1].match(regExp)) {
				var sortedArray = [];
				var str = adapterStr[1];
				var typeChar = str.match(regExp)[0];
				var type = translate[typeChar];
				var labelPolicy = labelPolicyArray[hashTable[type]];
				this.lastExeced = labelPolicy;
			} else {
				var t;
				if ('user' in hashTable) {
					t = labelPolicyArray[hashTable['user']];
				} else {
					t = labelPolicyArray[hashTable['lineFeed']];
				}
				this.lastExeced = t;
			}
		};
	}


	return LabelAdapter;
})