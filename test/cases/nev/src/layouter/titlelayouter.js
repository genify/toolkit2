/*
 * ------------------------------------------
 * 标题(布局器)
 * @version  0.0.1
 * @author   zjy(zhangjianyi@corp.netease.com)
 * ------------------------------------------
 */
/** @module layouter */
define(['{pro}/libs/colortraits.js',
        '{pro}/tools/assert.js',
        '{pro}/tools/utils.js',
        '{pro}/libs/colorbox.js',
        '{pro}/layouter/layouter.js'],function(mColortraits,mAssert,mUtils, mColorbox, mLayouter){

    var PRIVATE = mColortraits.PRIVATE;
    var selection = mColorbox.selection;

    /**
     * 标题(布局器)
     * @class   module:layouter/titlelayouter.TitleLayouter
     * @extends module:layouter/layouter.Layouter
     * @return  {TitleLayouter} 标题布局器
     */
    var TitleLayouter = mLayouter.extend({
        initialize:function(){

        	this.settypeId('title');
            
        },
        /** 
         * 应用布局设置或更新布局属性并返回布局数据
         * @method  module:layouter/titlelayouter.TitleLayouter#layout
         * @param  {Object} titleInfo - 标题信息
         * @param {Rect} resource - 可用的矩形区域资源
         * @param {Scene} titleSelection - 标题的场景树根节点
         * @return {Object} result - 布局完成之后的布局状态及剩余资源信息
         * @return  {Void}
         */
          layout : function(titleInfo, resource, titleSelection){

            this.texts(titleInfo.texts);

            this.area(resource);
           // console.log("TitleResource:",resource);

            this.position({x: titleInfo.x, y: titleInfo.y});


            var area = this._t._area();

            var position = this._t._position();

            titleSelection
                         .each(function(actor, index){
                            var tx, ty;
                            if(mUtils.isString(position.x))
                              switch(position.x){
                                case 'left' :
                                tx = 3;
                                break
                                case 'center' :
                                tx = (area.width - actor.treeBbox().width)/2;
                                break
                                case 'right' : 
                                tx = area.width - actor.treeBbox().width - 3;
                                break
                              }

                            if(mUtils.isString(position.y))
                              switch(position.y){
                                case 'top' : 
                                ty = 3;
                                break
                                case 'center' : 
                                ty = (area.height - actor.treeBbox().height)/2;
                                break
                                case 'bottom' :
                                ty = area.height - actor.treeBbox().height-3;
                                break
                              }
                            //已经转化为绝对坐标
                            actor.setx(tx+area.left);
                            actor.sety(ty+area.top);
                         });


        this._t.__adjustTitle(titleSelection);

        var result  = this._remainResource(titleInfo, resource, titleSelection.getElement(0, 0).treeBbox());

          if (result.ok) {
          		return {ok: true,
          				remainingSpace: result.remainingSpace,
          				info: [],
          				scene: titleSelection};
          	  }
          else{
          		return {ok: false,
          				msg: "The givenSpace is not enough",
          				info: []};
          	   }
        },

        __adjustTitle: function(titleSelection) {
          var width, height; 
          titleSelection.select(function(actor){
                                if(actor.dynamicProperty("kind") == "text"){
                                  var bbox = actor.bbox();
                                  width = bbox.width;
                                  height = bbox.height;
                                  return true;
                                }
                              });
          titleSelection.select(function(actor){
                                  return actor.dynamicProperty("kind") == "background";
                               })
                       .setProperty("width", width)
                       .setProperty("height", height);
        },

        /**
         * 计算留给legend和坐标系的区域
         * @protected
         * @method  module:layouter/titlelayouter.TitleLayouter#_remainResource
         * param {Object} titleInfo - title信息
         * param {area} area - 用户设置的区域
         * param {area} titleArea - title的colorBbox区域
         * @return  {Object}   - 返回布局是否成功的的标志以及剩下的区域
         */
        _remainResource : function(titleInfo, area, titleArea){
          var remainingSpace;
          if(!titleArea || (titleInfo.x == 'center' && titleInfo.y == 'center')){
          	remainingSpace=area;
          }
      	  else if(titleInfo.y == 'top'){
             remainingSpace={left : area.left, right : area.width, top : area.top+titleArea.height, bottom : area.bottom, width : area.width, height : area.height - titleArea.height};
          }
          else if(titleInfo.y == 'bottom'){
            remainingSpace= {left : area.left, right : area.right, top : area.top, bottom : area.bottom-titleArea.height, width : area.width, height : area.height - titleArea.height};
          }else if(titleInfo.x == 'left' && titleInfo.y == 'center'){
            remainingSpace= {left : area.left+titleArea.width,right : area.right, top : area.top, bottom : area.bottom, width : area.width-titleArea.width, height : area.height};
          }else if(titleInfo.x == 'right' && titleInfo.y == 'center'){
            remainingSpace={left : area.left, right : area.right-titleArea.width,top : area.top, bottom : area.bottom, width : area.width-titleArea.width, height : area.height};
          }

          if (remainingSpace.left>=area.left && remainingSpace.right<=area.right && remainingSpace.bottom<=area.bottom && remainingSpace.top>=area.top) {
          	return {ok: true, remainingSpace: remainingSpace};
          }else{
          	return {ok: false, remainingSpace: area};
          }
		   
        },









        /**
         * 获取或设置显示区域
         * @method  module:layouter/titlelayouter.TitleLayouter#area
         * @param   {Object} areaValue - 显示区域
         * @return  {Title | Object} - 当参数为空时返回显示区域否则返回Title实例
         */
        area : function(areaValue){
            if(!areaValue) return this._t._area();

            mAssert(mUtils.isObject(areaValue),'area : parameter types error');

            this._t.set_area(areaValue);

            return this;
        },
        /**
         * 获取或设置标题的布局位置
         * @method  module:layouter/titlelayouter.TitleLayouter#position
         * @param   {Object} positionValue - 标题布局位置
         * @return  {Title | Object} - 当参数为空时返回标题布局位置否则返回Title实例
         */
        position : function(positionValue){
            if(!positionValue) return this._t._position();

            mAssert(mUtils.isObject(positionValue),'position : parameter types error');

            this._t.set_position(positionValue);

            return this;
        },
        /**
         * 获取或设置标题文本内容
         * @method  module:layouter/titlelayouter.TitleLayouter#texts
         * @param   {Array} textValues - 标题文本内容
         * @return  {Title | Array} - 当参数为空时返回标题文本内容否则返回Title实例
         */
        texts : function(textValues){
            if(!textValues) return this._t._texts();

            mAssert(mUtils.isArray(textValues),'texts : parameter types error');

            this._t.set_texts(textValues);

            return this;
        },
        /**
         * 调整文本的定位信息并转换计算锚点
         * @private
         * @method  module:layouter/titlelayouter.TitleLayouter#__adjust
         * @param   {Object} pValue - 文本位置
         * @param   {Object} areaValue - 显示区域
         * @return  {Object} - 返回锚点和文本位置
         */
        __adjust : function(pValue,areaValue){
            var ratioAnchor = {ratiox : 0, ratioy : 0};
            var position = {x : pValue.x, y : pValue.y};
            if(mUtils.isString(pValue.x))
                switch(pValue.x){
                    case 'left' :
                    ratioAnchor.ratiox = 0;
                    position.x = 0;
                    break
                    case 'center' :
                    ratioAnchor.ratiox = 0.5;
                    position.x = areaValue.width/2;
                    break
                    case 'right' : 
                    ratioAnchor.ratiox = 1;
                    position.x = areaValue.width;
                    break
                }


            if(mUtils.isString(pValue.y))
                switch(pValue.y){
                    case 'top' : 
                    ratioAnchor.ratioy = 0;
                    position.y = 0;
                    break
                    case 'center' : 
                    ratioAnchor.ratioy = 0.5;
                    position.y = areaValue.height/2;
                    break
                    case 'bottom' :
                    ratioAnchor.ratioy = 1;
                    position.y = areaValue.height;
                    break
                }
            
            return {ratioAnchor : ratioAnchor, x : position.x, y : position.y}
        }
    },[PRIVATE("_position"),PRIVATE("_texts"),PRIVATE("_area")]);

    return TitleLayouter;
});