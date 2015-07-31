define(
  [
    '{pro}/libs/colorbox.js'
  ],
  function(colorbox)
  {
    var kind = colorbox.selector.kind;
    var id = colorbox.selector.id;

    var defaultColors = [
      {r:124, g:181, b:236},
      {r:253, g:182, b:104},               
      {r:124, g:197, b:87},
      {r:248, g:106, b:82},
      {r:86, g:207, b:252},

      {r:115, g:124, b:201},
      {r:252, g:73, b:91},
      {r:77, g:215, b:112},
      {r:255, g:152, b:0},
      {r:57, g:165, b:253},

      {r:156, g:39, b:176},
      {r:223, g:17, b:136},
      {r:30, g:196, b:175},
      {r:202, g:151, b:94},
      {r:37, g:155, b:36},

      {r:63, g:81, b:181},
      {r:230, g:42, b:16},
      {r:205, g:220, b:57},
      {r:241, g:201, b:10},
      {r:33, g:138, b:243}
    ];

    var marks = [colorbox.Circle, colorbox.Rect, colorbox.Diamond];

    var getSeriesColor = function(d)
    {
      return defaultColors[d.seriesIndex%defaultColors.length];
    }

    var genSeriesColor = function (colors) {
      return function(d)
      {
        return colors[d.seriesIndex%colors.length];
      }
    }

    var getSeriesMark = function (d)
    {
      return marks[d.seriesIndex%marks.length];
    }

    var genSeriesMark = function (marks) {
      return function(d)
      {
        return marks[d.seriesIndex%marks.length];
      }
    }
    

    var legendFrameMap = {
      line:{
        mark:colorbox.Rect,
        style:{
          width: 10,
          height: 2,
          ratioAnchor: {ratiox: 0, ratioy: 0.5}, 
          z: 10
        }
      },
      bar:{
        mark: colorbox.Rect,
        style: {
          width: 8,
          height: 10,
          ratioAnchor: {ratiox: 0, ratioy: 0.5}, 
          z: 10
        }
      },
      area:{
        mark: colorbox.Polygon,
        style: {
          vertexes: [{x: 0, y: 0}, {x: 5, y: -5}, {x: 10, y: 0}, {x: 10, y: 5}, {x: 0, y: 5}],
          ratioAnchor: {ratiox: 0, ratioy: 0}, 
          z: 10
        }
      },
      scatter:{
        mark: colorbox.Circle,
        style: {
          radius: 5,
          ratioAnchor: {ratiox: 0, ratioy: 0.5}, 
          z: 10
        }
      },
      pie:{
        mark: colorbox.Annulus,
        style: {
          startAngle: 3.64,
          endAngle: 5.78,
          outerradius: 10,
          innerradius: 4,
          ratioAnchor: {ratiox: 0, ratioy: -0.5}, 
          z: 10
        }
      }
    };

    var defaultThemeProps =
    {
      //series所使用的颜色集合，默认按照series index%colors.index取。
      colors:defaultColors,
      //series上的点的形状集合，默认按照series index%marks.index取。
      marks:marks,
      background:{
        fillStyle:{r:255, g:77, b:77, a:0}
      },
      title: {
        x: "center",
        y: "top",
        hidden: false,
        background:
        {
          z:10
        },
        texts:
        {
          styles:[
            {
              fillStyle: {r: 0, g: 0, b: 0},//mSkin.colors[markcolor], 
              font: {size: 20,family: "微软雅黑"}, 
              align: "center", 
              lineSpacing: 3
            }, 
            {
              font: {size: 14}, 
              align: "right", 
              lineSpacing: 3, 
              fillStyle: {r: 0, g: 0, b: 0}
            }, 
            {
              font: {size: 10}, 
              align: "right", 
              lineSpacing: 3, 
              fillStyle: {r: 0, g: 0, b: 0}//mSkin.colors[color2]
            }
          ],
          z:20
        }
      },
      //一项legend包括文本(text)和图标(frame);
      //series的type不一样时，frame类型也可能不一样，可以是一根线、一个区域、一个小柱子
      legend: {
        x: "center",
        y: "bottom",
        orient: "horizontal",
        hidden: false,
        text:
        {
          fillStyle:{r:0,g:0,b:0},
          font:{
            size: 15,
            family: "微软雅黑"
          },
          ratioAnchor: {ratiox: 0, ratioy: 0.5},
          z: 20
        },
        //frame有一套默认的映射表
        frame:{
          mark:function(d){
            return legendFrameMap[d.type].mark;
          },
          style:function(d){
            return legendFrameMap[d.type].style;
          }
        }
      },
      cartesian:
      {
        xAxis: 
        {
          caption: 
          {
            align:"middle",
            orient:"horizontal",
            spaceToLabel:10,
            fillStyle:{r: 42, g: 67, b: 80},
            font:{
              size: 14,
              family: "微软雅黑"
            },
            z:1 
          },
          grid: 
          {
            strokeStyle:{r: 200, g: 200, b: 200, a: 0.8},
            lineWidth:1,
          },
          label: 
          {
            maxWidth: Infinity,
            maxHeight: Infinity,
            styles:[{
              font: {size: 12},  
              fillStyle: {r: 62, g: 87, b: 111}
            }],
            rotation:0,
            z:3
          },
          tick: 
          {
            vertexes: [{x: 0, y: 0}, {x: 0, y: 5}],
            strokeStyle:{r: 0, g: 0, b: 0, a: 0.3},
            lineWidth:1,
            z:2
          },
          line: 
          {
            strokeStyle:{r: 0, g: 0, b: 0, a: 0.3},
            lineWidth:1,
            ratioAnchor:{ratiox: 0, ratioy: 0.5},
            z:1
          }
        },
        yAxis: {
          caption: 
          {
            align:"middle",
            orient:"vertical",
            spaceToLabel:10,
            fillStyle:{r: 42, g: 67, b: 80},
            font:{
              size: 14,
              family: "微软雅黑"
            },
            rotation: function(d){return d.rotation;},
            z:1 
          },
          grid: 
          {
            strokeStyle:{r: 200, g: 200, b: 200, a: 0.8},
            lineWidth:1,
          },
          label: 
          {
            //text: function(d, index){return d;},
            maxWidth: Infinity,
            maxHeight: Infinity,
            styles:[{
              font: {size: 12},  
              fillStyle: {r: 62, g: 87, b: 111}
            }],
            rotation:0,
            z:6
          },
          tick: 
          {
            vertexes:[{x: 0, y: 0}, {x: -5, y: 0}],
            strokeStyle:{r: 0, g: 0, b: 0, a: 0.3},
            lineWidth:1,
            z:5
          },
          line: 
          {
            strokeStyle:{r: 0, g: 0, b: 0, a: 0.3},
            lineWidth:1,
            ratioAnchor:{ratiox:0.5, ratioy:0},
            z:4
          }
        },
        series: {
          //series color
          line:
          {
            line:{
              // width: ,
              // height: ,
              strokeStyle:getSeriesColor,
              lineWidth:2,
              z:function(d){return 400+d.seriesIndex;},
            },
            point:{
              mark:getSeriesMark,
              fillStyle:getSeriesColor,
              lineWidth:1,
              strokeStyle:getSeriesColor,
              ratioAnchor:{ratiox: 0.5, ratioy: 0.5},
              z:function(d){return 400+d.seriesIndex+1;},
            },
            text:{
              fillStyle:{r: 0, g: 0, b: 0},
              ratioAnchor: {ratiox: 0.5, ratioy: 1.5},
              z:function(d){return 400+d.seriesIndex+2;},
            }
          },
          area:
          {
            zone:{
              fillStyle:function(d){
                var getColorF = genSeriesColor(defaultColors);
                var color = getColorF(d);
                return {r:color.r, g:color.g, b:color.b, a:0.3};
              },
              strokeStyle:{r:0, b:0, g:0, a:0},
              z:function(d){return 350+d.seriesIndex;},
            },
            line:{
              strokeStyle:function(d){
                var getColorF = genSeriesColor(defaultColors);
                var color = getColorF(d);
                return {r:color.r, g:color.g, b:color.b, a:1};
              },
              lineWidth:2,
              z:function(d){return 350+d.seriesIndex+1;}
            },
            point:
            {
              // width: ,
              // height: ,
              mark:getSeriesMark,
              fillStyle:getSeriesColor,
              ratioAnchor:{ratiox: 0.5, ratioy: 0.5},
              z:function(d){return 350+d.seriesIndex+3;}
            },
            text:{
              font: {size: 12},
              fillStyle:{r: 0, g: 0, b: 0},
              ratioAnchor: {ratiox: 0.5, ratioy: 1.5},
              z:function(d){return 350+d.seriesIndex+4;},
            }
          },
          bar:
          {
            width:30,
            height:50,
            fillStyle:getSeriesColor,
            strokeStyle:getSeriesColor,
            z:function(d){return 300+d.seriesIndex;},
            text:{
              font: {size: 12},
              fillStyle: {r: 0, g: 0, b: 0},// mSkin.colors[colorindex],
              ratioAnchor: {ratiox: 0, ratioy: 1},
              z: function(d){return 300+d.seriesIndex+1;},
            }
          },
          scatter:
          {
            // width: ,
            // height: ,
            fillStyle: function(d){
              var getColorF = genSeriesColor(defaultColors);
              var color = getColorF(d);
              return {r:color.r, g:color.g, b:color.b, a:0.5};
            },
            strokeStyle:function(d){
              var getColorF = genSeriesColor(defaultColors);
              var color = getColorF(d);
              return {r:color.r, g:color.g, b:color.b, a:0.8};
            },
            ratioAnchor:{ratiox: 0.5, ratioy: 0.5},
            z:function(d){return 600+d.seriesIndex;},
            text:{
              font: {size: 12},
              fillStyle:{r: 0, g: 0, b: 0},
              ratioAnchor: {ratiox: 0.5, ratioy: 1.5},
              z:function(d){return 600+d.seriesIndex+1;},
            }
          }
        }
      },
      //end cartesian
      radar:{
        label:
        {
          fillStyle : {r:80, g:80, b:80, a: 1.0},
          font: {size: 14,family: "微软雅黑"}
        },
        tick:{
          fillStyle : {r:80, g:80, b:80, a: 0.5}, 
          font: {size: 12,family: "微软雅黑"}
        },
        spoke: {
          strokeStyle:{r: 80, g: 80, b: 80, a: 0.1},
          lineWidth:1
        },
        grid:
        {
          fillStyle:(function(d, i){
                    return i%2 == 0? {r:238, g:238, b:238, a:0.1} : {r:255, g:0, b:0, a:0.1}
                }),
                strokeStyle : {r:230, g:230, b:230},
                lineWidth:1
        },
        series: {
          line:
          {
            line:{
              strokeStyle:getSeriesColor,
              lineWidth:2
            },
            point:{
              mark:getSeriesMark,
              fillStyle:getSeriesColor,
              lineWidth:1,
              strokeStyle:getSeriesColor,
              ratioAnchor:{ratiox: 0.5, ratioy: 0.5}
            },
            text:{
              fillStyle:{r: 0, g: 0, b: 0},
              ratioAnchor: {ratiox: 0.5, ratioy: 1.5}
            }
          },
          area:
          {
            zone:{
              fillStyle:function(d){//one in colors,and alpha is 0.08;
                var color = getSeriesColor(d);
                return {r:color.r, g:color.g, b:color.b, a:0.1};
              },
              strokeStyle:{r:0, b:0, g:0, a:0}
            },
            line:{
              strokeStyle:getSeriesColor,
              lineWidth:2
            },
            point:
            {
              mark:getSeriesMark,
              fillStyle:getSeriesColor,
              ratioAnchor:{ratiox: 0.5, ratioy: 0.5}
            },
            text:{
              fillStyle:{r: 0, g: 0, b: 0},
              ratioAnchor: {ratiox: 0.5, ratioy: 1.5}
            }
          }
        }
      },
      //end of radar
      pie: {
        pie: {
          mark: colorbox.Annulus,
          fillStyle: function(d){
            return defaultColors[d.colorId%defaultColors.length];               
          },
          strokeStyle : {r:255, g:255, b:255},
          lineWidth : 0.5,
          z: 50,
        },
        lead: {
          mark: colorbox.Line, 
          strokeStyle: function(d){
            return defaultColors[d.colorId%defaultColors.length];               
          },
          z: 60
        },
        annotation: {
          mark: colorbox.Text,
          fillStyle : {r:80, g:80, b:80, a: 1.0},
          font: {size: 12,family: "微软雅黑"},
          z: 70
        },
        emphasis: {
          styles:[
            {
              fillStyle: {r: 0, g: 0, b: 0}, 
              font: {size: 12,family: "微软雅黑"}, 
              align: "center"
            }, 
            {
              font: {size: 10,family: "微软雅黑"}, 
              align: "center", 
              fillStyle: {r: 0, g: 0, b: 0}
            }, 
            {
              font: {size: 9,family: "微软雅黑"}, 
              align: "center", 
              // lineSpacing: 3, 
              fillStyle: {r: 0, g: 0, b: 0} 
            }
          ],
          z:80          
        }
      }
      // end of pie
    }

    //----------------------------------------------------------------------

    var blackThemeColors = [
                            { r:80,  g:206, b:255 },
                            { r:113, g:122, b:203 },
                            { r:251, g:105, b:76 },
                            { r:255, g:183, b:96 },
                            { r:121, g:200, b:80 },

                            { r:58, g:160, b:199 },
                            { r:159, g:136, b:219 },
                            { r:249, g:171, b:171 },
                            { r:240, g:236, b:138 },
                            { r:55, g:150, b:96 },

                            { r:243, g:215, b:149 },
                            { r:200, g:199, b:80 },
                            { r:114, g:170, b:234 },
                            { r:85, g:219, b:222 },
                            { r:242, g:100, b:86 },

                            { r:98, g:157, b:244 },
                            { r:133, g:201, b:168 },
                            { r:0, g:171, b:193 },
                            { r:221, g:167, b:241 },
                            { r:154, g:192, b:87 }];

    var blackThemeProps =
    {
      //series所使用的颜色集合，默认按照series index%colors.index取。
      colors:blackThemeColors,
      //series上的点的形状集合，默认按照series index%marks.index取。
      background:{
        fillStyle:{r:39, g:39, b:39, a:1},
        z:0
      },
      title: {
        x: "center",
        y: "top",
        texts:
        {
          styles:[
            {
              fillStyle: {r: 255, g: 255, b: 255},//{r: 224, g: 224, b: 215},
              font: {size: 20,family: "微软雅黑"}, 
              align: "center", 
              lineSpacing: 3
            }, 
            {
              font: {size: 14}, 
              align: "right", 
              lineSpacing: 3, 
              fillStyle: {r: 230, g: 230, b: 230}
            }, 
            {
              font: {size: 10}, 
              align: "right", 
              lineSpacing: 3, 
              fillStyle: {r: 200, g: 200, b: 200}//mSkin.colors[color2]
            }
          ]
        }
      },
      //一项legend包括文本(text)和图标(frame);
      //series的type不一样时，frame类型也可能不一样，可以是一根线、一个区域、一个小柱子
      legend: {
        x: "right",
        y: "center",
        text:
        {
          fillStyle:{r:220,g:220,b:220},
          font:{
            size: 15,
            family: "微软雅黑"
          }
        }
      },
      cartesian:{
        xAxis: {
          caption: 
          {
            align:"right",
            orient:"horizontal",
            fillStyle:{r: 150, g: 150, b: 150, a:1}
          },
          grid: 
          {
            strokeStyle:{r: 70, g: 70, b: 70, a: 1},
            lineWidth:1,
          },
          label: 
          {
            styles:[{
              font: {size: 12},  
              fillStyle: {r: 204, g: 204, b: 204, a:1}
            }]
          },
          tick: 
          {
            vertexes: [{x: 0, y: 0}, {x: 0, y: 5}],
            strokeStyle:{r: 112, g: 112, b: 112, a: 1},
            lineWidth:1
          },
          line: 
          {
            strokeStyle:{r: 122, g:122, b: 122, a: 1},
            lineWidth:1
          }
        },
        yAxis: {
          caption: 
          {
            align:"middle",
            orient:"vertical",
            fillStyle:{r: 150, g: 150, b: 150, a:1}
          },
          grid: 
          {
            strokeStyle:{r: 70, g: 70, b: 70, a: 1},
            lineWidth:1
          },
          label: 
          {
            styles:[{
              font: {size: 12},  
              fillStyle: {r: 202, g: 202, b: 202, a:1}
            }]
          },
          tick: 
          {
            vertexes:[{x: 0, y: 0}, {x: -5, y: 0}],
            strokeStyle:{r: 112, g: 112, b: 112, a: 1},
            lineWidth:1
          },
          line: 
          {
            strokeStyle:{r: 122, g: 122, b: 122, a: 1},
            lineWidth:1
          }
        },
        series: {
          //series color
          line:
          {
            line:{
              lineWidth:1
            },
            text:{
              fillStyle:{r: 240, g: 240, b: 240}
            }
          },
          area:
          {
            zone:{
              fillStyle:function(d){
                  var getColorF = genSeriesColor(blackThemeColors);
                  var color = getColorF(d);
                  return {r:color.r, g:color.g, b:color.b, a:0.3};
                }
            },
            line:{
              lineWidth:1
            },
            text:{
              fillStyle:{r: 240, g: 240, b: 240}
            }
          },
          bar:
          {
            fillStyle:function(d){
                  var getColorF = genSeriesColor(blackThemeColors);
                  var color = getColorF(d);
                  return {r:color.r, g:color.g, b:color.b, a:1.0};
                },
            strokeStyle:function(d){
                  var getColorF = genSeriesColor(blackThemeColors);
                  var color = getColorF(d);
                  return {r:color.r, g:color.g, b:color.b, a:1.0};
                },
            text:{
              fillStyle: {r: 240, g: 240, b: 240}
            }
          },
          scatter:
          {
            fillStyle: function(d){
              var getColorF = genSeriesColor(blackThemeColors);
              var color = getColorF(d);
              return {r:color.r, g:color.g, b:color.b, a:0.5};
            },
            strokeStyle:function(d){
              var getColorF = genSeriesColor(blackThemeColors);
              var color = getColorF(d);
              return {r:color.r, g:color.g, b:color.b, a:0.8};
            },
            text:{
              fillStyle:{r: 240, g: 240, b: 240}
            }
          }
        }
      },
      //end of cartesian
      radar:{
        label:
        {
          fillStyle : {r:180, g:180, b:180, a: 1.0},
          font: {size: 14,family: "微软雅黑"}
        },
        tick:{
          fillStyle : {r:200, g:200, b:200, a: 1.0}, 
          font: {size: 12,family: "微软雅黑"}
        },
        spoke: {
          strokeStyle:{r: 80, g: 80, b: 80, a: 1.0},
          lineWidth:1
        },
        grid:
        {
          fillStyle: {r:238, g:238, b:238, a:0.0},
          strokeStyle : {r:80, g:80, b:80, a:1.0},
          lineWidth:1
        },
        series: {
          line:
          {
            line:{
                  strokeStyle:function(d){
                            var getColorF = genSeriesColor(blackThemeColors);
                            var color = getColorF(d);
                            return {r:color.r, g:color.g, b:color.b, a:1};
                        },
                  lineWidth:1
            },
            point:{
              mark:getSeriesMark,
              fillStyle:function(d){
                            var getColorF = genSeriesColor(blackThemeColors);
                            var color = getColorF(d);
                            return {r:color.r, g:color.g, b:color.b, a:0.5};
                        },
              strokeStyle:function(d){
                            var getColorF = genSeriesColor(blackThemeColors);
                            var color = getColorF(d);
                            return {r:color.r, g:color.g, b:color.b, a:0.8};
                        },
              ratioAnchor:{ratiox: 0.5, ratioy: 0.5}
            },
            text:{
              fillStyle:{r: 0, g: 0, b: 0},
              ratioAnchor: {ratiox: 0.5, ratioy: 1.5}
            }
          },
          area:
          {
            zone:{
              fillStyle:function(d){
                            var getColorF = genSeriesColor(blackThemeColors);
                            var color = getColorF(d);
                            return {r:color.r, g:color.g, b:color.b, a:0.3};
                        }
                        ,
              strokeStyle:{r:0, g:0, b:0, a:0},
            },
            line:{
              strokeStyle:function(d){
                            var getColorF = genSeriesColor(blackThemeColors);
                            var color = getColorF(d);
                            return {r:color.r, g:color.g, b:color.b, a:1};
                        },
              lineWidth:1
            },
            point:
            {
              mark:getSeriesMark,
              fillStyle:function(d){
                            var getColorF = genSeriesColor(blackThemeColors);
                            var color = getColorF(d);
                            return {r:color.r, g:color.g, b:color.b, a:1};
                        },
              ratioAnchor:{ratiox: 0.5, ratioy: 0.5}
            },
            text:{
              fillStyle:{r: 240, g: 240, b: 240},
              ratioAnchor: {ratiox: 0.5, ratioy: 1.5}
            }
          }
        }
      },
     //end of radar
      pie: {
        pie: {
          mark: colorbox.Annulus,
          fillStyle: function(d){
            return blackThemeColors[d.colorId%blackThemeColors.length];                      
          },
          strokeStyle : function(d){
            var color =  blackThemeColors[d.colorId%blackThemeColors.length];     
            return {r:color.r, g:color.g, b:color.b, a:0.8};                 
          },
          lineWidth : 0.5,
          z: 5,
        },
        lead: {
          mark: colorbox.Line, 
          strokeStyle: function(d){
            return blackThemeColors[d.colorId%blackThemeColors.length];                      
          },
          z: 60
        },
        annotation: {
          mark: colorbox.Text,
          fillStyle : {r:212, g:212, b:212, a: 1.0},
          font: {size: 12,family: "微软雅黑"},
          z: 70
        },
        emphasis: {
          texts:
          {
            styles:[
              {
                fillStyle: {r: 212, g: 212, b: 212}, 
                font: {size: 12,family: "微软雅黑"}, 
                align: "center"
              }, 
              {
                font: {size: 10,family: "微软雅黑"}, 
                align: "right", 
                fillStyle: {r: 212, g: 212, b: 212}
              }, 
              {
                font: {size: 9,family: "微软雅黑"}, 
                align: "right", 
                // lineSpacing: 3, 
                fillStyle: {r: 212, g: 212, b: 212} 
              }
            ],
            z:80
          }
        }
      }
      // end of pie
    }

    var visualEncodingMap = {
      baseSelector:null,
      background:{
        baseSelector:id('chartBackground'),
        style:true
      },
      title: {
        baseSelector:kind('title'),
        background:{
          baseSelector:kind('background'),
          style:true
        },
        texts:{
          baseSelector:kind('text'),
          style:true
        },
      },
      legend:{
        baseSelector:kind('legend'),
        text:{
          baseSelector:kind('text'),
          style:true
        },
        frame:{
          baseSelector:kind('frame'),
          style:true
        }, //selector's value is default function
      },
      cartesian:{
        baseSelector:true,
        xAxis:{
          baseSelector:id('xAxises').then(kind('axis')),
          caption:{
            baseSelector:kind('caption'),
            style:true,
            excludeStyleProps:{align:true, orient:true, spaceToLabel:true}
          },
          grid:{
            baseSelector:kind('grids').then(kind('grid')),
            style:true
          },
          label:{
            baseSelector:kind('labels').then(kind('label')),
            style:true
          },
          tick:{
            baseSelector:kind('ticks').then(kind('tick')),
            style:true
          },
          line:{
            baseSelector:kind('line'),
            style:true
          }
        },
        yAxis:{
          baseSelector:id('yAxises').then(kind('axis')),
          caption:{
            baseSelector:kind('caption'),
            style:true,
            excludeStyleProps:{align:true, orient:true, spaceToLabel:true}
          },
          grid:{
            baseSelector:kind('grids').then(kind('grid')),
            style:true
          },
          label:{
            baseSelector:kind('labels').then(kind('label')),
            style:true
          },
          tick:{
            baseSelector:kind('ticks').then(kind('tick')),
            style:true
          },
          line:{
            baseSelector:kind('line'),
            style:true
          }
        },
        series:{
          baseSelector:id('serieses'),
          line:{
            baseSelector:kind('lineSeries'),
            line:{
              baseSelector:kind('lines').then(kind('line')),
              style:true
            },
            point:{
              baseSelector:kind('points').then(kind('point')),
              style:true
            },
            text:{
              baseSelector:kind('text'),
              style:true
            }
          }, //selector's value is default function
          area:{
            baseSelector:kind('areaSeries'),
            zone:{
              baseSelector:kind('zone'),
              style:true
            },
            line:{
              baseSelector:kind('lines').then(kind('line')),
              style:true
            },
            point:{
              baseSelector:kind('points').then(kind('point')),
              style:true
            },
            text:{
              baseSelector:kind('text'),
              style:true
            }
          },
          bar:{
            baseSelector:kind('barSeries').then(kind('bars')).then(kind('bar')),
            style:true,
            excludeStyleProps:{text:true},
            text:{
              baseSelector:kind('text'),
              style:true
            }
          },
          scatter:{
            baseSelector:kind('scatterSeries').then(kind('scatters')).then(kind('scatter')),
            style:true,
            excludeStyleProps:{text:true},
            text:{
              baseSelector:kind('text'),
              style:true
            }
          }
        }
      },
      //end of cartesian
      radar:{
        label:{
          baseSelector:id('labels').then(kind('label')),
          style:true
        },     
        tick:{
          baseSelector:id('ticks').then(kind('tick')),
          style:true
        },
        spoke:{
          baseSelector:id('spokes').then(kind('spoke')),
          style:true
        },
        grid:{
          baseSelector:id('grids').then(kind('grid')),
          style:true
        },
        series:{
          baseSelector:id('serieses'),
          line:{
            baseSelector:kind('series'),
            line:{
              baseSelector:true,
              style:true
            },
            point:{
              baseSelector:kind('item'),
              style:true
            }
          }, 
          area:{
            baseSelector:kind('series'),
            line:{
              baseSelector:true,
              style:true
            },
            zone:{
              baseSelector:kind('area'),
              style:true
            },            
            point:{
              baseSelector:kind('item'),
              style:true
            }
          }
        }
      },
      // end of radar
      pie: {
        baseSelector: true,
        pie:{
          baseSelector: id("serieses").then(kind("series")).then(kind("pies")).then(kind("pie")),
          style: true
        },
        lead: {
          baseSelector: id("serieses").then(kind("series")).then(kind("leads")).then(kind("lead")),
          style: true
        },
        annotation: {
          baseSelector: id("serieses").then(kind("series")).then(kind("annotations")).then(kind("annotation")),
          style: true
        },
        emphasis: {
          baseSelector: kind("emphasis"),
          style: true
        }
      }
      // end of pie      
    };

    var processFillStyle = function (marks, colors, obj)
    {
      if(obj.fillStyle)
        return obj.fillStyle;
      return genSeriesColor(colors);
    }

    var processStrokeStyle = function (marks, colors, obj)
    {
      if(obj.strokeStyle)
        return obj.strokeStyle;
      return genSeriesColor(colors);
    }

    var processMark = function (marks, colors, obj) 
    {
      return genSeriesMark(marks);
    }

    var defaultPreProcessMap = {
      cartesian:[
        {
          ruleSelector:["series", "line", "line"],
          style:{
            strokeStyle:processStrokeStyle,
          }
        },
        {
          ruleSelector:["series", "line", "point"],
          style:{
            fillStyle:processFillStyle,
            strokeStyle:processStrokeStyle,
            mark:processMark
          }
        },
        {
          ruleSelector:["series", "area", "zone"],
          style:{
            fillStyle:processFillStyle
          }
        },
        {
          ruleSelector:["series", "area", "line"],
          style:{
            strokeStyle:processStrokeStyle
          }
        },
        {
          ruleSelector:["series", "area", "point"],
          style:{
            fillStyle:processFillStyle,
            strokeStyle:processStrokeStyle,
            mark:processMark
          }
        },
        {
          ruleSelector:["series", "scatter"],
          style:{
            fillStyle:processFillStyle,
            strokeStyle:processStrokeStyle
          }
        }
      ],
      //end of cartesian
      radar:[]
      
    };

    return {
      visualEncodingMap:visualEncodingMap,
      themeProps:{
        default:{
          props:defaultThemeProps,
          preprocessMap:defaultPreProcessMap
        },
        black:{
          props:blackThemeProps
        }
      }
    };
  }
);