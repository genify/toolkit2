/*
 * ------------------------------------------
 * 顺序组合(布局器)
 * @version  0.0.1
 * @author   ww(hzwangwei15@corp.netease.com)
 * ------------------------------------------
 */

/** @module layouter */

define(['{pro}/libs/colortraits.js',
        '{pro}/tools/assert.js',
        '{pro}/tools/utils.js',
        '{pro}/libs/colorbox.js',
        '{pro}/layouter/layouter.js'],function(mColortraits,mAssert,mUtils, mColorbox,mLayouter){


  /**
   * 顺序组合布局器
   * @class   module:layouter/sequenlayouter.SequenLayouter
   * @extends module:layouter/layouter.Layouter
   * @return  {SequenLayouter} 顺序组合布局器
   */
var SequenLayouter = mLayouter.extend({

	initialize : function() {

		this.execProto("initialize");

	},
  /**
   * 应用顺序组合布局策略对多个布局器进行布局
   * @method  module:layouter/sequenlayouter.SequenLayouter#layout
   * @param  {Object} info - series信息
   * @param {Rect} resource - 可用的矩形区域资源
   * @param {Selection} rootSelection - 图表场景树根节点selection
   * @return {Object} result - 布局完成之后的布局状态及剩余资源信息
   */

	layout : function(info, space, rootSelection){

			var spaceTemp=space;
			var ok=true;
			//console.log(this.layouterArray());
			for(var i=0; i < this.layouterArray().length; i++){
				if(ok){
					var la=(this.layouterArray())[i];

					var tempRootSelection = rootSelection.select(function(actor){
						return actor.dynamicProperty('id') === la.typeId();
					});

					var r1 = la.layout(this._extract(info, la.typeId()), spaceTemp, tempRootSelection);
					spaceTemp=r1.remainingSpace;
					//console.log(la.typeId(),resourceTemp)
					sceneTemp=r1.scene;
					ok=r1.ok;
				}
				else{
					break;
				}
			}
			if (ok) {
		  		return {ok: true,
		  				remainingSpace: spaceTemp,
		  				info: [],
		  				scene: rootSelection};
		  			}
	  		else{
		  		return {ok: false,
		  				msg: "The givenSpace is not enough",
		  				info: []};
	  	   }


			return r1;

	},
  /**
   * 获取或设置多个布局器
   * @method  module:layouter/sequenlayouter.SequenLayouter#layouterArray
   * @param  {Array} layouterArray - 多个布局器组成的数组
   * @return {Array/SequenLayouter} result - 多个布局器组成的数组或者SequenLayouter布局器
   */
	layouterArray: function (layouterArray){
		if(!layouterArray) return this._t._layouterArray();
		this._t.set_layouterArray(layouterArray);
		return this;
	},


	_extract: function (info, typeId){
	//	console.log(typeId);
		return info[typeId];

	}

},["_layouterArray"]);

	return SequenLayouter;

})