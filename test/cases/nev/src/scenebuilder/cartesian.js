/*
 * ------------------------------------------
 * 布局数据构建区域场景树的类
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module scenebuilder */
define([
        '{pro}/libs/colorbox.js',
        '{pro}/chart/charthelper.js',
        '{pro}/scale/linear.js',
        '{pro}/scale/ordinal.js',
        '{pro}/scenebuilder/axis.js'
        ],
        function(
          mColorbox, 
          mChartHelper, 
          mScaleLinear, 
          mScaleOrdinal, 
          buildAxisScene 
        ){
          
          var ContainerSprite = mColorbox.ContainerSprite;
          var selection = mColorbox.selection;
          var getRecordById = function(id,data){
            for(var i=0;i<data.length;i++){
              if(data[i].id ==id){
                return data[i];
              }
            }
            return -1;
          };

          function buildAxis(axisSelection, axisInfo, range)
          {
            var scale = axisInfo.scale;
            buildAxisScene(axisSelection, scale.ticks(), axisInfo);

            return true;
          }

          function buildAxises(rootSelection, axisInfos, range, id)
          {
            var axisesSel = rootSelection.select(function(actor){
              return actor.dynamicProperty('id') == id;
            }).data([id]);

            axisesSel
            .enter()
            .append(ContainerSprite)
            .setDynamicProperty('id', id);

            axisesSel.exit().remove();

            axisesSel = rootSelection.select(function(actor){
              return actor.dynamicProperty('id') == id;
            });

            var allAxisSel = axisesSel.selectAll(function(actor){
              return actor.dynamicProperty('kind') == 'axis';
            }).data(axisInfos);
            
            allAxisSel.enter()
            .append(ContainerSprite)
            .setDynamicProperty('kind', 'axis');

            allAxisSel.exit()
            .remove()

            allAxisSel = axisesSel.selectAll(function(actor){
              return actor.dynamicProperty('kind') == 'axis';
            });

            allAxisSel.each(function(actor, index){
              var axisInfo = actor.dynamicProperty('data');
              actor.setDynamicProperty('id', axisInfo.id);
              axisInfo.scene = actor;
              buildAxis(selection.select(actor), axisInfo, range);
            });            
          }

          function buildSerieses(rootSelection, seriesInfos, id, optionData)
          {
            var seriesesSel = rootSelection.select(function(actor){
              return actor.dynamicProperty('id') == id;
            }).data([id]);

            seriesesSel
            .enter()
            .append(ContainerSprite)
            .setDynamicProperty('id', id);

            seriesesSel.exit().remove();

            seriesesSel = rootSelection.select(function(actor){
              return actor.dynamicProperty('id') == id;
            });

            var allSeriesSel = seriesesSel.selectAll(function(actor){
              return actor.dynamicProperty('kind') == 'series';
            }).data(seriesInfos);
            
            allSeriesSel.enter()
            .append(ContainerSprite)
            .setDynamicProperty('kind', 'series');

            allSeriesSel.exit()
            .remove()

            allSeriesSel = seriesesSel.selectAll(function(actor){
              return actor.dynamicProperty('kind') == 'series';
            });

            allSeriesSel.each(function(actor, index){
              var seriesInfo = actor.dynamicProperty('data');
              var xData, yData, creator;
              creator  = mChartHelper.creatorMap[seriesInfo.type];
              xData = seriesInfo.xData;
              yData = seriesInfo.yData;
              actor.setDynamicProperty('id', seriesInfo.id);
              actor.setDynamicProperty('seriesName', seriesInfo.name);
              seriesInfo.scene = actor;
              var xyData = xData.map(function(data, index) {
                return {xData: data.data, yData: yData[index].data,seriesIndex:seriesInfo.seriesIndex, id:yData[index].id, record:getRecordById(data.id,optionData)};

              });

             var actorValue = {axisfields:{x:seriesInfo.xField,y:seriesInfo.yField}};
             if(seriesInfo.accValue){
              actorValue.accValue = seriesInfo.accValue;
             }
              creator.sceneBuilder(
                selection.select(actor), 
                xyData, 
                actorValue,//轴维度信息
                seriesInfo
              );
            });  
          }

          /**
           * 笛卡尔图表场景构建及更新函数。

           * 节点绑定的数据格式为
           * bar:  {point: {x, y: }, value}
           * text:  {point: {x, y: }, value}

           * @function build
           * @param {Selection}  rootSelection - 场景所在的根节点。
           * @param {Object} carInfo - 笛卡尔坐标图表数据。
           * @param {Object} optionData - 经过过滤的data.
           * @return  {boolean} 是否创建成功
           */
          function build(rootSelection, carInfo, optionData)
          {
            //cartesian node
            var cartesianSel = rootSelection
            .select(function(actor){
              return actor.dynamicProperty('id') == 'cartesian';
            })
            .data(['cartesian']);

            cartesianSel.enter()
            .append(ContainerSprite)
            .setDynamicProperty('id', 'cartesian');

            cartesianSel.exit().remove();

            cartesianSel = rootSelection
            .select(function(actor){
              return actor.dynamicProperty('id') == 'cartesian';
            });

            buildAxises(cartesianSel, carInfo.xAxisesInfos, carInfo.area.width, 'xAxises');
            buildAxises(cartesianSel, carInfo.yAxisesInfos, carInfo.area.height, 'yAxises');
            buildSerieses(cartesianSel, carInfo.seriesInfos, 'serieses',optionData);

            return true;
          }
          
          return build;

        });