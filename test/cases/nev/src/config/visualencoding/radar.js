/*
 * ------------------------------------------
 * 产生区域视觉数据visualEncoding的工厂
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module config/visualencoding */
define(['{pro}/config/visualencoding/skin.js',
        '{pro}/config/visualencoding/base.js', 
        '{pro}/libs/colorbox.js',
        '{pro}/tools/utils.js',
        '{pro}/tools/rgb.js'],
        function(
          mSkin,
          mBase, 
          mColorbox,
          mUtils,
          mRgb,
          p){

          var kind = mColorbox.selector.kind;
          var id = mColorbox.selector.id;
          var type = mColorbox.selector.type;
          var Circle = mColorbox.Circle;
          var Rect = mColorbox.Rect;
          var Diamond = mColorbox.Diamond;
          /**
           * 产生区域视觉数据visualEncoding的工厂
           * @class  module:config/visualencoding/area.AreaVisualEncodingFactory
           * @extends module:config/visualencoding/base.Base
           */
          var RadarEncodingFactory = mBase.extend({ 
            /**
             * 初始化
             * @return  {Object} AreaVisualEncodingFactory实例
             */          
            initialize: function()
            {
              this.execProto("initialize");

              this.setzindex(100);
            },
            /**
             * 获取视觉数据visualEncoding的接口             
             * @method  module:config/visualencoding/area.AreaVisualEncodingFactory#next
             * @return  {Object} visualEncoding - 视觉数据，数据格式见：../../doc/dev/visualencoder/visualencoder-design.html
             */
            next: function()
            {
              var visualresult =  [
                // {
                //   // selector:id('background'),
                //   // style: {
                //   //   fillStyle:{r: 255, g: 255, b: 255},
                //   //   strokeStyle:{r: 255, g: 255, b: 255},
                //   // }
                // },
                {
                  selector:id('labels').then(kind('label')),
                  style : {
                      font: {size: 14,family: "微软雅黑"},
                      fillStyle : {r:80, g:80, b:80, a: 1.0},                     
                    }
                },
                {
                  selector:id('spokes').then(kind('spoke')),
                  style: {
                    strokeStyle:{r: 80, g: 80, b: 80, a: 0.1},
                    lineWidth:1
                  }
                },
                {
                  selector:id('serieses').then(kind('series')),
                  style: {
                    strokeStyle:function(d){
                      return mSkin.colors[d.index%mSkin.colors.length];
                    },
                    lineWidth:2
                  }
                },
                {
                  selector:id('serieses').then(kind('series')).then(kind('area')),
                  style: {
                    fillStyle:function(d){
                      var c = mSkin.colors[d.index%mSkin.colors.length];
                      return {r:c.r, g:c.g, b:c.b, a:0.1};
                    }
                  }
                },
                {
                  selector:id('serieses').then(kind('series')).then(kind('item')),
                  mark:function(d){
                    return mSkin.marks[d.index%mSkin.marks.length];
                  },
                  style:function(d){
                    var mark = mSkin.marks[d.index%mSkin.marks.length];
                    if(mark == Circle)
                      return {
                        strokeStyle:function(d){
                          return mSkin.colors[d.index%mSkin.colors.length];
                        },
                        fillStyle:function(d){
                          return mSkin.colors[d.index%mSkin.colors.length];
                        },
                        //radius:4,
                        ratioAnchor: {ratiox: 0.5, ratioy: 0.5}
                      };
                    else if(mark == Rect)
                    {
                      return {
                        strokeStyle:function(d){
                          return mSkin.colors[d.index%mSkin.colors.length];
                        },
                        fillStyle:function(d){
                          return mSkin.colors[d.index%mSkin.colors.length];
                        },
                        //width:8,
                        //height:8,
                        ratioAnchor: {ratiox: 0.5, ratioy: 0.5}
                      };
                    }
                    else if(mark == Diamond)
                    {
                      return {
                        strokeStyle:function(d){
                          return mSkin.colors[d.index%mSkin.colors.length];
                        },
                        fillStyle:function(d){
                          return mSkin.colors[d.index%mSkin.colors.length];
                        },
                        //width:8,
                        //height:8,
                        ratioAnchor: {ratiox: 0.5, ratioy: 0.5}
                      };
                    }
                  }
                },
                {
                  selector:id('grids').then(kind('grid')),
                  style: {
                    fillStyle:(function(a, i){
                      return i%2 == 0? {r:238, g:238, b:238, a:0.4} : {r:255, g:255, b:255, a:1}
                    }),
                    strokeStyle : {r:230, g:230, b:230},
                    lineWidth:1
                  }
                },
                {
                  selector:id('ticks').then(kind('tick')),
                  style: {
                    font: {size: 12,family: "微软雅黑"},
                    fillStyle : {r:80, g:80, b:80, a: 0.5}, 
                  }
                }
                
              ];

              return visualresult;
            }
          },
            []);

          return RadarEncodingFactory;

        });
