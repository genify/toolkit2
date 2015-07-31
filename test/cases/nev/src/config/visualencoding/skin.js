/*
 * ------------------------------------------
 * 皮肤配置
 * @version  0.0.1
 * @author   violin(hzwanghl@corp.netease.com)
 * ------------------------------------------
 */
/** @module config/visualencoding */
define(['{pro}/libs/colorbox.js'],
  function(mColorbox, p){
    /**
     * @description colors
     */
    var colorMap = {
      index : 0,
      colorHash : {},
      color1: [
               {r: 230, g: 42, b: 16},
               {r: 233, g: 30, b: 99},
               {r: 156, g: 39, b: 176},    
               {r: 108, g: 149, b: 197},//{r: 70, g: 115, b: 166},//line                         
               {r: 103, g: 58, b: 183},               
               {r: 63, g: 81, b: 181},               
               {r: 86, g: 119, b: 252},

               {r: 3, g: 169, b: 244},
               {r: 0, g: 188, b: 212},
               {r: 0, g: 150, b: 136},
               {r: 37, g: 155, b: 36},
               {r: 139, g: 195, b: 74},
               {r: 205, g: 220, b: 57}, 

               {r: 255, g: 235, b: 59},
               {r: 255, g: 193, b: 7},
               {r: 255, g: 152, b: 0},
               {r: 255, g: 87, b: 34},
               {r: 96, g: 125, b: 139}
              ],

      color2:[
               {r:124, g:181, b:236},//{r:108, g:149, b:197},
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
               {r:33, g:138, b:243},
             ],

      color3:[
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
                            { r:154, g:192, b:87 }
      ]
    }
    /**
     * @description 形状
     */
    var marks = [mColorbox.Circle, mColorbox.Rect, mColorbox.Diamond];

    /**
     * @description 用于更新皮肤系统
     */
    function Skin() {
      this.pieColors = colorMap;
      this.colorindex = 0;
      this.colors = colorMap.color2;
      this.tooltipcolors = '#5486c9';
      this.markIndex = 0;
      this.marks = marks;

      var self = this;
      this.changeSkin = function(name) {
        self.colors = colorMap[name];
      }

      this.getColor = function(){
        var color = self.colors[self.colorindex];
        self.colorindex= (self.colorindex+1)%self.colors.length;
        return color;
      }

      this.getMark = function()
      {
        var mark =  self.marks[self.markIndex];
        self.markIndex = (self.markIndex+1) % self.marks.length;
        return mark;
      }

      this.restoreStyleIndex = function() {
        self.colorindex = 0;
        self.markIndex = 0;
      }
    } 




    var skin = new Skin();

    return skin;
});


