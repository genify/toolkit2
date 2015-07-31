/*
 * ------------------------------------------
 * 图例(布局器)
 * @version  0.0.1
 * @author   zjy(zhangjianyi@corp.netease.com)
 * ------------------------------------------
 */
/** @module layouter */
define(['{pro}/libs/colortraits.js',
		'{pro}/tools/area.js',
        '{pro}/tools/assert.js',
        '{pro}/tools/utils.js',
        '{pro}/libs/colorbox.js',
        '{pro}/layouter/layouter.js'],function(mColortraits,mArea,mAssert,mUtils, mColorbox,mLayouter){

    var PRIVATE = mColortraits.PRIVATE;
    var selection = mColorbox.selection;

    /**
     * 图例(布局器)
     * @class   module:layouter/legendlayouter.LegendLayouter
     * @extends module:layouter/layouter.Layouter
     * @return  {LegendLayouter} 图例布局器
     */
    var LegendLayouter = mLayouter.extend({
        initialize:function(){

        	this.settypeId('legend');
            
        },
        /**
         * 应用布局设置或更新布局属性并返回布局数据
         * @method  module:layouter/legendlayouter.LegendLayouter#layout
         * @param  {Object} legendInfo - 图例信息
         * @param {Rect} resource - 可用的矩形区域资源
         * @param {Scene} rootSelection - 图例的场景树根节点
         * @return {Object} result - 布局完成之后的布局状态及剩余资源信息
         * @return  {Void}
         */
        layout : function(legendInfo, resource, legendSelection){

            var V = "vertical";

            this.position({x: legendInfo.x,  y: legendInfo.y});

            this.area(resource);

            legendSelection.setProperty('x', resource.left);
            legendSelection.setProperty('y', resource.top);


     		    var area=resource;
            this.orient(legendInfo.orient);



            var orient = this._t._orient();

            var itemMaxWidth = 0, itemMaxHeight = 0;

            var legendItems = {};
            var legendWidth = [];
            var legendHeight = [];
            var frame = legendSelection.selectAll(function(actor){
                            return actor.dynamicProperty("kind") == "frame";
                        });
            legendItems.len = frame.size();
            
            frame.each(function(actor,index){
                            legendWidth.push(actor.treeBbox().width);
                            legendHeight.push(actor.treeBbox().height);
                            if(actor.treeBbox().width > itemMaxWidth)
                                itemMaxWidth = actor.treeBbox().width;
                            if(actor.treeBbox().height > itemMaxHeight)
                                itemMaxHeight = actor.treeBbox().height;
                        });
            legendItems.legendWidth = legendWidth;
            legendItems.legendHeight = legendHeight;
            legendItems.itemMaxHeight = itemMaxHeight;
            legendItems.itemMaxWidth = itemMaxWidth;
            var a = this._t._position().x;
            var b = this._t._position().y;
            //legend垂直放置
            if(orient == V){
                if(a == 'center' && b == 'center')
                    return;
                if( (a == 'left') || (a == 'center' && b == 'top') ){
                    this._t.__directionV1(frame,itemMaxWidth,itemMaxHeight);
                }
                else{
                  legendSelection.setProperty('x', this._t._area().right);
                  legendSelection.setProperty('y', this._t._area().bottom);
                    this._t.__directionV2(frame,itemMaxWidth,itemMaxHeight);
                }
            }
            else{
                if(a == 'center' && b == 'center' )
                    return;
                if( (b == 'top') || (a == 'left' && b == 'center') ){
                  //this._t.__directionH1(frame,itemMaxWidth,itemMaxHeight); 
                  this._t.__directionH1(frame,legendItems); 
                }
                else{
                  legendSelection.setProperty('x', this._t._area().right);
                  legendSelection.setProperty('y', this._t._area().bottom);

                    //this._t.__directionH2(frame,itemMaxWidth,itemMaxHeight, legendItems);
                    this._t.__directionH2(frame,legendItems);
                }
            }

            var result = this._remainResource(legendInfo, resource, legendSelection.getElement(0, 0).treeBbox());

            if (result.ok) {
		  		return {ok: true,
		  				remainingSpace: result.remainingSpace,
		  				info: [],
		  				sceneSelectoin: legendSelection};
		  		}
	  		else{
	  		return {ok: false,
	  				msg: "The givenSpace is not enough",
	  				info: []};
	  	   		}
          },


        /**
         * 计算留给坐标系的区域
         * @protected
         * @method  module:layouter/legendlayouter.LegendLayouter#_remainResource
         * param {Object} legendInfo - legend信息
         * param {area} area - legend和坐标系所占的区域
         * param {area} legendArea - legend的colorBbox区域
         * @return  {Object}   - 返回布局是否成功的的标志以及剩下的区域
         */
        _remainResource : function(legendInfo, area, legendArea){

          var remainingSpace;
          if(!legendArea || (legendInfo.x == 'center' && legendInfo.y == 'center')) remainingSpace= area;
          if(legendInfo.orient == 'vertical'){
            if(legendInfo.x == 'left'){
              remainingSpace={left : area.left+legendArea.width,right : area.right, top : area.top, bottom : area.bottom, width : area.width-legendArea.width, height : area.height};
            }
            if(legendInfo.x == 'right'){
              remainingSpace= {left : area.left, right : area.right-legendArea.width,top : area.top, bottom : area.bottom, width : area.width-legendArea.width, height : area.height};
            }
            if( legendInfo.x == 'center' && legendInfo.y == 'top' ){
              remainingSpace= {left : area.left, right : area.width, top : area.top+legendArea.height, bottom : area.bottom, width : area.width, height : area.height - legendArea.height};
            }
            if( legendInfo.x == 'center' && legendInfo.y == 'bottom' ){
              remainingSpace= {left : area.left, right : area.right, top : area.top, bottom : area.bottom-legendArea.height, width : area.width, height : area.height - legendArea.height};
            }
          }
          else{
            if(legendInfo.y == 'top'){
              remainingSpace= {left : area.left, right : area.right, top : area.top+legendArea.height, bottom : area.bottom, width : area.width, height : area.height-legendArea.height};
            }
            if(legendInfo.y == 'bottom'){
              remainingSpace= {left : area.left, right : area.right,top : area.top, bottom : area.bottom-legendArea.height, width : area.width, height : area.height-legendArea.height};
            }
            if( legendInfo.x == 'left' && legendInfo.y == 'center' ){
              remainingSpace= {left : area.left+legendArea.width, right : area.width, top : area.top, bottom : area.bottom, width : area.width-legendArea.width, height : area.height};
            }
            if( legendInfo.x == 'right' && legendInfo.y == 'center' ){
              remainingSpace= {left : area.left, right : area.right-legendArea.width, top : area.top, bottom : area.bottom, width : area.width-legendArea.width, height : area.height};
            }
          }

          if (remainingSpace.left>=area.left && remainingSpace.right<=area.right && remainingSpace.bottom<=area.bottom && remainingSpace.top>=area.top) {
          	return {ok: true, remainingSpace: remainingSpace};
          }else{
          	return {ok: false, remainingSpace: area};
          }
        },




        /**
         * 获取或设置图例的布局位置(相对或绝对)
         * @method  module:layouter/legendlayouter.LegendLayouter#position
         * @param   {Object} positionValue - 图例布局位置
         * @return  {Legend | Object} - 当参数为空时返回图例绝对布局位置否则返回Legend实例
         */
        position : function(positionValue){
            if(!positionValue) return this._t._position();

            mAssert(mUtils.isObject(positionValue),'position : parameter types error');

            this._t.set_position(positionValue);

            return this;
        },
        /**
         * 获取或设置显示区域
         * @method  module:layouter/legendlayouter.LegendLayouter#area
         * @param   {Object} areaValue - 显示区域
         * @return  {Legend | Object} - 当参数为空时返回显示区域否则返回Legend实例
         */
        area : function(areaValue){
            if(!areaValue) return this._t._area();

            mAssert(mUtils.isObject(areaValue),'area : parameter types error');

            this._t.set_area(areaValue);

            return this;
        },
        /**
         * 获取或设置图例的布局方向
         * @method  module:layouter/legendlayouter.LegendLayouter#orient
         * @param   {String} orientValue - 布局方向值,可选的方向值如下
         *                                 horizontal  {String} - 水平
         *                                 vertical    {String} - 垂直
         * @return  {Legend | String} - 当参数为空时返回布局方向值否则返回Legend实例
         */
        orient : function(orientValue){
            if(!orientValue) return this._t._orient();

            mAssert(mUtils.isString(orientValue),'orient : parameter types error');

            this._t.set_orient(orientValue);

            return this;
        },
        __directionV1 : function(frame,itemWidth,itemHeight){

            var area = this._t._area();

            var position = this._t._position();

            var size = frame.size();

            var padding = 10;

            var row, column, tx, ty, PerColumnRow;
            var last = false;
            row = Math.floor(area.height/(itemHeight + padding));//每一列的frame数
            row = row > size ? size : row;
            PerColumnRow = row; 
            frame.each(function(actor,index){
                
                column = Math.ceil(size/row);//一共需要列数

                if(column > 1 && index >= (column-1)*row && !last){ //考虑多行的时候最后一行的column就可能变化
                    PerColumnRow = size - (column-1)*row;
                    last = true;
                }

                tx = Math.floor(index/row)*(itemWidth + padding)+padding;
                ty = (index%row)*(itemHeight + padding);  
                switch(position.x){
                    case 'left' : 
                        tx = tx;
                    break
                    case 'center' :
                        tx += (area.width - column*(itemWidth + padding))/2;
                    break
                    case 'right' : 
                        tx = area.width - tx - itemWidth - padding;
                    break
                };

                switch(position.y){
                    case 'top' :
                        ty += padding;
                    break
                    case 'center' : 
                        ty += (area.height - PerColumnRow*(itemHeight + padding))/2;
                    break
                    case 'bottom' :
                        ty = area.height - ty - padding;
                    break
                };
                //actor.setratioAnchor({ratiox: -1, ratioy: 0}); 

                actor.setx(tx);
                actor.sety(ty);
            });
        },
        __directionV2 : function(frame,itemWidth,itemHeight){

            var area = this._t._area();

            var position = this._t._position();

            var size = frame.size();

            var padding = 10;

            var row, column, tx, ty, PerColumnRow;
            var last = false;
            row = Math.floor(area.height/(itemHeight + padding));
            row = row > size ? size : row; //每一列存放的frame数
            PerColumnRow = row;
            frame.each(function(actor,index){
                
                
                column = Math.ceil(size/row); //需要多少列

                if(column > 1 && index >= (column-1)*row && !last){ //考虑多行的时候最后一行的column就可能变化
                    PerColumnRow = size - (column-1)*row;
                    last = true;
                }

                tx = Math.floor(index/row)*(itemWidth + padding);
                if(last)
                  ty = (index%row)*(itemHeight);
                else
                  ty = (index%row)*(itemHeight + padding);

                switch(position.x){
                    case 'left' :
                        tx = -(area.width - padding - tx);
                    break
                    case 'center' :
                        tx = -((area.width + column*(itemWidth + padding))/2 - tx);
                    break
                    case 'right' : 
                        tx = -(tx+itemWidth+padding);
                    break
                };

                switch(position.y){
                    case 'top' :
                        ty = -(area.height - padding - ty);
                    break
                    case 'center' : 
                        ty = -(area.height + PerColumnRow*(itemHeight + padding))/2 + ty;
                    break
                    case 'bottom' :
                        ty = -(itemHeight+ty);
                    break
                };
                //actor.setratioAnchor({ratiox: -1, ratioy: 0}); 

                actor.setx(tx);
                actor.sety(ty);
            });
        },
        __directionH1 : function(frame, legendItems){
          //水平放置，高度都一样，宽度不一样
          var itemMaxHeight = legendItems.itemMaxHeight;
          var itemMaxWidth = legendItems.itemMaxWidth;
          var legendHeight = legendItems.legendHeight;
          var legendWidth = legendItems.legendWidth;
          var area = this._t._area();
          var position = this._t._position();
          var size = legendItems.len;
          var padding = 10;
          //标志数组，标志每个item放置在第几行
          var PerRowColumn = [];
          //每一行的占据的宽度
          var widthPerRow = [];
          var num = 0,sum=0;
          //console.log('width: ',area.width);
          //得到每一行需要的item数，存入数组PerRowColumn,PerRowColumn.length就是需要的行数
          for (var i = 0; i < legendWidth.length; i++) {
            if(sum + legendWidth[i] + padding < area.width){
              num++;
              sum += legendWidth[i]+padding;
            }
            else{
              PerRowColumn.push(num);
              num = 1;
              sum = legendWidth[i]+padding;
            };
            if(i == legendWidth.length -1 && num != 0){
              PerRowColumn.push(num);
            }
          };
          var begin = 0,w=0;
          //计算每一行需要的占据的宽度,开始以及结束坐标，并存放在widthPerRow数组中
          for (var i = 0; i < PerRowColumn.length && begin < legendWidth.length; i++) {
              for (var j = 0; j < PerRowColumn[i]; j++) {
                w += legendWidth[j+begin];
              };
              w += (PerRowColumn[i]+1)*padding;
              if(widthPerRow.length > 0){
                widthPerRow[widthPerRow.length-1].end = begin-1;
              }
              widthPerRow.push({w:w,begin:begin,end:0,num:PerRowColumn[i]});
              w = 0;
              begin += PerRowColumn[i];
          };
          if(widthPerRow.length > 0){
            widthPerRow[widthPerRow.length-1].end = begin-1;
          }

          // console.log(PerRowColumn);
          // console.log(widthPerRow);
          //需要的东西
          // 1.每一行放置的item数
          // 2.行数
          // 3.正在放置的item在该行的位置
          // 4.每一行对应的item原来的开始和结束索引，以及每一行所有item占有的宽度
          var row = 1, tx, ty, num, first=true, w, partWidth = padding, rowAll = widthPerRow.length;//rowAll为需要行数，row为第几行
          frame.each(function(actor, index){
            //判断在第几行
            while(index > widthPerRow[row-1].end){
              row++;
              partWidth = padding;
              first = true;
            }

            num = widthPerRow[row-1].num;
            begin = widthPerRow[row-1].begin;
            end = widthPerRow[row-1].end;
            w = widthPerRow[row-1].w;
            if((index-begin)%num != 0){
              first = false;
            }
            if(!first){
              partWidth += legendWidth[index-1]+padding;
            }
            // console.log('partWidth: ',partWidth);
            // console.log('begin: ',begin);
            // console.log('end: ',end);
            //ty = (rowAll - row + 1)*itemMaxHeight + (rowAll - row)*padding;
            ty = (row-1)*(padding + itemMaxHeight);
            switch(position.x){
              case 'left' :
                tx = partWidth;
                break;
              case 'center' :
                tx = (area.width-w)/2 + partWidth;
                break;
              case 'right' :
                tx = area.width - w + partWidth;
                break;
            };

            switch(position.y){
              case 'center':
                ty = (area.height - (rowAll)*(padding+itemMaxHeight))/2 + ty;
                break;
              case 'top':
                ty = ty + padding;
                break;
            };
            actor.setx(tx);
            actor.sety(ty);
            //actor.setratioAnchor({ratiox: 0, ratioy: 0}); 

          });
        },
        __directionH2 : function(frame, legendItems){
          //水平放置，高度都一样，宽度不一样
          var itemMaxHeight = legendItems.itemMaxHeight;
          var itemMaxWidth = legendItems.itemMaxWidth;
          var legendHeight = legendItems.legendHeight;
          var legendWidth = legendItems.legendWidth;
          var area = this._t._area();
          var position = this._t._position();
          var size = legendItems.len;
          var padding = 10;
          //标志数组，标志每个item放置在第几行
          var PerRowColumn = [];
          //每一行的占据的宽度
          var widthPerRow = [];
          var num = 0,sum=0;
          //console.log('width: ',area.width);
          //得到每一行需要的item数，存入数组PerRowColumn,PerRowColumn.length就是需要的行数
          for (var i = 0; i < legendWidth.length; i++) {
            if(sum + legendWidth[i] + padding < area.width){
              num++;
              sum += legendWidth[i]+padding;
            }
            else{
              PerRowColumn.push(num);
              num = 1;
              sum = legendWidth[i]+padding;
            };
            if(i == legendWidth.length -1 && num != 0){
              PerRowColumn.push(num);
            }
          };
          var begin = 0,w=0;
          //计算每一行需要的占据的宽度,开始以及结束坐标，并存放在widthPerRow数组中
          for (var i = 0; i < PerRowColumn.length && begin < legendWidth.length; i++) {
              for (var j = 0; j < PerRowColumn[i]; j++) {
                w += legendWidth[j+begin];
              };
              w += (PerRowColumn[i]+1)*padding;
              if(widthPerRow.length > 0){
                widthPerRow[widthPerRow.length-1].end = begin-1;
              }
              widthPerRow.push({w:w,begin:begin,end:0,num:PerRowColumn[i]});
              w = 0;
              begin += PerRowColumn[i];
          };
          if(widthPerRow.length > 0){
            widthPerRow[widthPerRow.length-1].end = begin-1;
          }

          // console.log(PerRowColumn);
          // console.log(widthPerRow);
          //需要的东西
          // 1.每一行放置的item数
          // 2.行数
          // 3.正在放置的item在该行的位置
          // 4.每一行对应的item原来的开始和结束索引，以及每一行所有item占有的宽度
          var row = 1, tx, ty, num, first=true, w, partWidth = padding, rowAll = widthPerRow.length;//rowAll为需要行数，row为第几行
          frame.each(function(actor, index){
            //判断在第几行
            while(index > widthPerRow[row-1].end){
              row++;
              partWidth = padding;
              first = true;
            }

            num = widthPerRow[row-1].num;
            begin = widthPerRow[row-1].begin;
            end = widthPerRow[row-1].end;
            w = widthPerRow[row-1].w;
            if((index-begin)%num != 0){
              first = false;
            }
            if(!first){
              partWidth += legendWidth[index-1]+padding;
            }
            // console.log('partWidth: ',partWidth);
            // console.log('begin: ',begin);
            // console.log('end: ',end);
            ty = (rowAll - row + 1)*itemMaxHeight + (rowAll - row)*padding;
            switch(position.x){
              case 'left' :
                tx = -area.width + partWidth;
                break;
              case 'center' :
                tx = -area.width + (area.width-w)/2 + partWidth;
                break;
              case 'right' :
                tx = - w + partWidth;
                break;
            };

            switch(position.y){
              case 'center':
                ty = -(area.height - (rowAll)*(padding+itemMaxHeight))/2 - ty;
                break;
              case 'bottom':
                ty = -ty;
                break;
            };
            // console.log('tx: ',tx);
            // console.log('ty: ',ty);
            actor.setx(tx);
            actor.sety(ty);
          });
        },
        //改进之前的__directionH1，现在在代码中没有用到
        __directionH1Old : function(frame,itemWidth,itemHeight){
            var area = this._t._area();

            var position = this._t._position();

            var size = frame.size();

            var padding = 10;

            var row, column, tx, ty, PerRowColumn;

            var last = false; 
            column = Math.floor(area.width/(itemWidth + padding));//每一行最多可以放几个frame
            column = column > size ? size : column;//每一行可以放的图例数
            PerRowColumn = column;
            frame.each(function(actor,index){
                
                
                row = Math.ceil(size/column);  //行数 1 begin

                if(row > 1 && index >= (row-1)*column && !last){ //考虑多行的时候最后一行的column就可能变化
                    PerRowColumn = size - (row-1)*column;
                    last = true;
                }

                tx = (index%column)*(itemWidth + padding);
                ty = Math.floor(index/column)*(itemHeight + padding);

                    switch(position.x){
                        case 'left' : 
                        tx += padding;
                        break
                        case 'center' :
                        tx += (area.width - PerRowColumn*(itemWidth + padding))/2;
                        break
                        case 'right' : 
                        tx = area.width - tx - itemWidth - padding;
                        break
                    };

                    switch(position.y){
                        case 'center' : 
                        ty += (area.height - row*(itemHeight + padding))/2;
                        break
                        case 'bottom' :
                        ty = area.height - ty - itemHeight;

                        break
                        case 'top' :
                        ty += padding;
                    };
                actor.setx(tx);
                actor.sety(ty);
              //  actor.setratioAnchor({ratiox:0,ratioy:-1});
            });
        },
        //改进之前的__directionH2，现在在代码中没有用到
        __directionH2Old : function(frame,itemWidth,itemHeight, legendItems){

          var area = this._t._area();

          var position = this._t._position();

          var size = frame.size();

          var padding = 10;

          var row, column, tx, ty, PerRowColumn;

          var last = false;


          column = Math.floor(area.width/(itemWidth + padding));//每一行最多可以放几个frame
          column = column > size ? size : column;//每一行可以放的图例数
          PerRowColumn = column;

          frame.each(function(actor,index){
              row = Math.ceil(size/column);  //行数 1 begin
              if(row > 1 && index >= (row-1)*column && !last){ //考虑多行的时候最后一行的column就可能变化
                  PerRowColumn = size - (row-1)*column;
                  last = true;
              }
              tx = (index%column)*(itemWidth + padding);
              if(last)
                ty = Math.floor(index/column)*(itemHeight + padding);
              else
                ty = Math.floor(index/column)*(itemHeight + padding);

                  switch(position.x){
                      case 'left' :
                      tx = -(area.width - padding - tx);
                      break
                      case 'center' :
                      tx += -(area.width + PerRowColumn*(itemWidth + padding))/2;
                      break
                      case 'right' : 
                      tx = -(padding + itemWidth + tx) 
                      break
                  };

                  switch(position.y){
                      case 'center' : 
                      //ty += (area.height - row*(itemHeight + padding))/2;
                      ty = - (area.height + row*(itemHeight+padding))/2 + ty;
                      break
                      case 'bottom' :
                      ty = -(row*(itemHeight+padding) - padding - ty);
                  //    console.log("row",row);
                    //  console.log("itemHeight",itemHeight);
                    //  console.log("tu",ty);

                      break
                      case 'top' :
                      ty = -(area.height - padding - ty);
                  };
                 
              actor.setx(tx);
              actor.sety(ty);
             //     console.log("actor.y()",actor.y());
             //    console.log("actor bbox before",actor.bbox())
            //    actor.sety(ty+21);
              //  console.log("actor bbox after",actor.bbox())
           //   console.log("actor.parent().bbox()",actor.parent().bbox());
            //   console.log("actor.parent().treeBbox()",actor.parent().treeBbox());
           /*     actor.children().forEach(function(actor){
               	console.log(actor.dynamicProperty("kind"));
               	console.log(actor.bbox());
               })*/

               // actor.setratioAnchor({ratiox:0,ratioy:0});
            });
        },
    },[PRIVATE("_position"),PRIVATE("_area"),PRIVATE("_orient"),PRIVATE("_root")]);

    return LegendLayouter;
});