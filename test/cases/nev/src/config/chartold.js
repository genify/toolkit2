define(['{pro}/tools/area.js',
        '{pro}/tooltip/chooser/precisetooltip.js'], function(mArea,mPreciseTooltip,p){
  p.chartBase = {
    legendItemWidth:100,
    legendItemHeight:20
  };
  p.chart = {
    size : mArea(900,560)
  };
  
  p.cartesianchart = {
    areaChart:{isStack:false
     },
    stackBar: false,
    size:mArea(900,560),
    //padding:[80,60],
    padding : 0.2,
    tickDensityX : 1,
    tickDensityY : 2,
    // offset:100,
    xlabelRange:[10,Infinity],
    ylabelRange:[-10,-Infinity],
    axisLabelAdapter:['uhr','h',1,Infinity],
    caption: {
      align: "middle", //标题相对于轴的对齐值，默认为"middle“
      spaceToLabel: 10, //caption距离label的间隔距离,默认为10
      rotation: function(isHorizontal, orient){
        return isHorizontal ? 0 : orient == "horizontal" ? 0 : Math.PI*3/2;
      }, //caption文本旋转的角度，x轴默认为0，y轴默认为90度
      text: "", //文本的内容
    },
    grid: function(isHorizontal,isFirstVertAxis){
    	return isHorizontal ? false : (isFirstVertAxis ? true: false);
    },
    axisHidden: function(isHorizontal){
    	return !isHorizontal;
    },
    position: function(isHorizontal, prepostion){
      return isHorizontal ? (prepostion == "bottom" ? "top" : "bottom") : (prepostion=="left" ? "right" : "left");
    }

  };
  p.piechart = {
    area:mArea(400,300),
    rose:false,
    radius:[0,200],
    angle:[-90,270],
    annotationLead:30

  };
  p.singleAxisChart = {
    space:60
  };
  p.tooltip = {
    hidden: false,
    orient: "horizontal",
    formatter: undefined,
    format: undefined,
    _TooltipPolicyMap: {}
  };
  p.title = {
    hidden : false,
    x : "center",
    y : "top",
    texts : []
  };
  p.legend = {
    hidden : false,
    x : "center",
    y : "bottom",
    orient : 'horizontal', 
    legendItemWidth : 100,
    legendItemHeight : 20
  };

  return p;
});


