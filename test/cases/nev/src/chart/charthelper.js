define([
        '{pro}/layouter/linelayouter.js',
        '{pro}/layouter/barlayouter.js',
        '{pro}/layouter/arealayouter.js',
        '{pro}/layouter/scatterlayouter.js',
        '{pro}/layouter/pielayouter.js',
        '{pro}/scenebuilder/line.js',
        '{pro}/scenebuilder/bar.js',
        '{pro}/scenebuilder/area.js',
        '{pro}/scenebuilder/scatter.js',
        '{pro}/scenebuilder/pie.js',
        '{pro}/config/visualencoding/factory.js',
        '{pro}/config/interactencoding/interactencoding.js',
        '{pro}/tools/assert.js',
        '{pro}/tools/utils.js'
 ],function(
    mLayoutLine,
    mLayoutBar,
    mLayoutArea,
    mLayoutScatter,
    mLayoutPie,
    mSceneBuilderLine,
    mSceneBuilderBar,
    mSceneBuilderArea,
    mSceneBuilderScatter,
    mSceneBuilderPie,
    mConfigVE,
    mConfigIE,
    mAssert,
    mTypeHelper,
    p){
    var isArray = mTypeHelper.isArray;
    

    var ChartHelper = {
        //确保获得数组数据
      getArrayValue:function(v,name){
            if(v){
                mAssert(isArray(v),name+"must be Array.");
                return v;
            }else{
                return [];
            }
      },
      creatorMap:{
        line:{
            layout:mLayoutLine,
            sceneBuilder:mSceneBuilderLine,
            kind:"lineseries",            
            defaultInteractEncoding:mConfigIE.interactEncoding("line"),
            getBuildParam:function(info){
              return {
                      smooth:info.smooth,
                      nullType:info.nullType,
                      brokenLinesIndex:info.brokenLinesIndex,
                      normalLinesIndex:info.normalLinesIndex
                     };
            }
        },
        bar:{
            layout:mLayoutBar,
            sceneBuilder:mSceneBuilderBar,
            kind:"barseries",
            defaultInteractEncoding:mConfigIE.interactEncoding("bar"),
            getBuildParam:function(info){
              return undefined;
            }
        },
        area:{
            layout:mLayoutArea,
            sceneBuilder:mSceneBuilderArea,
            kind:"areaseries",
            defaultInteractEncoding:mConfigIE.interactEncoding("area"),
            getBuildParam:function(info){
              return {smooth:info.smooth,
                      nullType:info.nullType,
                      brokenLinesIndex:info.brokenLinesIndex,
                      normalLinesIndex:info.normalLinesIndex
              }
            }
        },
        scatter:{
            layout:mLayoutScatter,
            sceneBuilder:mSceneBuilderScatter,
            defaultInteractEncoding:mConfigIE.interactEncoding("scatter"),
            getBuildParam:function(info){
              return undefined;
            }
        },
        pie:{
            layout:mLayoutPie,
            sceneBuilder:mSceneBuilderPie,
            kind:"pieseries",
            defaultInteractEncoding:mConfigIE.interactEncoding("pie")
        }
      },
      axisIE : mConfigIE.interactEncoding("axis"),
      titleIE : mConfigIE.interactEncoding("title"),
      legendIE : mConfigIE.interactEncoding("legend"),

      isPositiveArrayWith2Elements : function(arr){
        return  isArray(arr) &&
                    arr.length === 2 &&
                    typeof(arr[0]) === "number" &&
                    typeof(arr[1]) === "number" &&
                    arr[0] >= 0 &&
                    arr[1] >= 0;
      },
      // dataConvert : function(obj){
      //   var len = -1;
      //   var result = [];

      //   //个数检测
      //   for(var k in obj){
      //       mAssert(len = -1 || len === obj[k].length , "illegal data format.");
      //       len = obj[k].length;
      //   }

      //   for(var i = 0; i < len; i++){
      //       result.push({});
      //       for(var k in obj){
      //           result[i][k] = obj[k][i];
      //       }            
      //   }
      //   return result;
      // },


      // var data = {
      //             month:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      //             value:[30,70,30,40,50,60,35,46,100,null,70,50],
      //             browser:['IE','Chrome','Firefox','Safari','AOL','Opera','其他'],
      //             value1:[30,70,30,40,null,60,90,100,200]
      // };
      // 因为数据允许异构,所以就不需要个数的检测
      dataConvert : function(obj){
        var result = [];
        var len = -1;
        for( var k in obj){
          if(obj[k].length > len){
            len = obj[k].length;
          }
        };
        for (var i = 0; i < len; i++) {
          result.push({});
          for(var k in obj){
            if( i <= obj[k].length -1 ){
              result[i][k] = obj[k][i];
            }
          }
        };
        return result;
      },
      constructData : function(data){
        var result=[];
        for (var i = 0; i < data.length; i++) {
          result.push({});
          result[i].data = data[i];
          result[i].id = i;
        };
        return result;
      }

  }

  return ChartHelper;

})

