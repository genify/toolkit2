define(['{pro}/scene-builder/area.js', 
        '{pro}/scene-builder/axis.js', 
        '{pro}/scene-builder/bar.js', 
        '{pro}/scene-builder/line.js',
        '{pro}/scene-builder/pie.js',
        '{pro}/scene-builder/scatter.js'],
        function(
          mArea, 
          mAxis, 
          mBar, 
          mLine, 
          mPie, 
          mScatter,
          p){

          p.Area = mArea;
          p.Axis = mAxis;
          p.Bar = mBar;
          p.Line = mLine;
          p.Pie = mPie;
          p.Scatter = mScatter;

          return p;
        });