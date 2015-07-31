/*
 * ------------------------------------------
 * 直线的平滑功能单元
 * @version  0.0.1
 * @author   shelley(lichunxia@corp.netease.com)
 * ------------------------------------------
 */
/** @module tools/smooth */
define(['{pro}/tools/assert.js'],
        function(mAssert, p){
          var vec2 =  {
            add:  function(out, v1, v2) {
                    out.x = v1.x + v2.x;
                    out.y = v1.y + v2.y;
                    return out;
                  },
            sub:  function(out, v1, v2) {
                    out.x = v1.x - v2.x;
                    out.y = v1.y - v2.y;
                    return out;
                  },
            scale:  function(out, v, s) {
                      out.x = v.x * s;
                      out.y = v.y * s;
                      return out;
                    },
            distance: function(v1, v2) {
                        return Math.sqrt(
                            (v1.x - v2.x) * (v1.x - v2.x) +
                            (v1.y - v2.y) * (v1.y - v2.y)
                        );
                      }
          };
          /**
           * 将直线平滑为贝塞尔平滑曲线，返回计算出的控制点。
           * @function smoothBezier
           * @param {Array}  points - 直线上的点构成的数组。
           * @param {Boolean} horizon - true, 表示水平方向，false表示垂直方向
           * @return  {Array} controlpoint - 贝塞尔曲线的控制点
           */
          function smoothBezier(points, horizon) {
            var len = points.length;
            var cps = [];

            
            /*
            var v = {};
            var v1 = {};
            var v2 = {};
            var prevPoint;
            var nextPoint;
            for(var i = 0; i < len; i++){
                var point = points[i];
                if (loop) {
                    prevPoint = points[i === 0 ? len-1 : i-1];
                    nextPoint = points[(i + 1) % len];
                } else {
                    if (i === 0 || i === len-1) {
                        cps.push(points[i]);
                        continue;
                    } else {
                        prevPoint = points[i-1];
                        nextPoint = points[i+1];
                    }
                }

                vec2.sub(v, nextPoint, prevPoint);

                //use degree to scale the handle length
                vec2.scale(v, v, smooth);

                var d0 = vec2.distance(point, prevPoint);
                var d1 = vec2.distance(point, nextPoint);
                var sum = d0 + d1;
                d0 /= sum;
                d1 /= sum;

                vec2.scale(v1, v, -d0);
                vec2.scale(v2, v, d1);


                //var v11 = {}, v22 = {};
                //vec2.add(v11, point, v1);
                //vec2.add(v22, point, v2);
                //if(v11.y > 260.6) v11.y = 260.5;
                //if(v22.y > 260.6) v22.y = 260.5;
                //cps.push(v11);
                //cps.push(v22);


                cps.push(vec2.add({}, point, v1));
                cps.push(vec2.add({}, point, v2));
                
            }
            if (loop) {
                cps.push(cps.shift());
            }
            
            return cps; */
            
  
            /*
            // method 2    
            for(var i = 0; i < len-1; i++){
                var point = points[i];
                

                var nextPoint = points[i+1];

                var halfdx = Math.abs(nextPoint.x - point.x);
                var deltax = halfdx*smooth;

                var c1 = {};
                c1.x = point.x + deltax;
                c1.y = point.y;
                
                var c2 = {};
                c2.x = nextPoint.x - deltax;
                c2.y = nextPoint.y;

                cps.push(c1);
                cps.push(c2);
          }

          return cps;   
          */

          var smooth = 0.5;
          //method 3
          //判断是否为极值点
          function isExtremum(i, points, horizon)
          {
            if(i === 0  || i === points.length - 1)
              return true;

            if(horizon)
            {
              if(points[i].y >= points[i-1].y && points[i].y >= points[i+1].y)
                return true;

              if(points[i].y <= points[i-1].y && points[i].y <= points[i+1].y)
                return true;
            }
            else
            {
              if(points[i].x >= points[i-1].x && points[i].x >= points[i+1].x)
                return true;

              if(points[i].x <= points[i-1].x && points[i].x <= points[i+1].x)
                return true;
            }

            return false;
          }

          for(var i = 0; i < len; i++)
          {
            var point = points[i];
            var prePoint = points[i];
            if(i > 0)
              prePoint = points[i-1];

            var nxtPoint = points[i];
            if(i < len - 1)
              nxtPoint = points[i+1];

            var isEvPoint = isExtremum(i, points, horizon);

            if(isEvPoint)
            { 
              var dist = vec2.distance(prePoint, nxtPoint);
              var dd;
              if(horizon)
                dd = Math.abs(nxtPoint.x - prePoint.x);
              else
                dd = Math.abs(nxtPoint.y - prePoint.y)
              if(dist > dd) dist = dd;
              var delta = dist*smooth;
              

              var cBefore = {};  // 当前点的前面的控制点
              var cAfter = {};   // 当前点的后面的控制点

              if(i > 0)
              {     
                //var delta = disttoPre*smooth;
                if(horizon)
                {
                  cBefore.x = point.x - delta*0.5;
                  cBefore.y = point.y;
                }
                else
                {
                  cBefore.y = point.y + delta*0.5;
                  cBefore.x = point.x;
                }

                cps.push(cBefore);
              }

              if(i < len -1)
              {
                //var delta = disttoNext * smooth;
                if(horizon)
                {
                  cAfter.x = point.x + delta*0.5;
                  cAfter.y = point.y;
                }
                else
                {
                  cAfter.y = point.y - delta*0.5;
                  cAfter.x = point.x;
                }

                cps.push(cAfter);
              }
            }
            else
            {
              var dVec = {};
              vec2.sub(dVec, nxtPoint, prePoint);
              var delta = {};
              delta.x = dVec.x*smooth;
              delta.y = dVec.y*smooth;

              //var d1 = vec2.distance(point, points[i-1]);
              //var d2 = vec2.distance(point, points[i+1]);
              var d1, d2;
              if(horizon)
              {
                d1 = Math.abs(point.y-prePoint.y);
                d2 = Math.abs(point.y-nxtPoint.y);
              }
              else
              {
                d1 = Math.abs(point.x-prePoint.x);
                d2 = Math.abs(point.x-nxtPoint.x);
              }
              var t = d1/(d1+d2);

              var cBefore = {};  // 当前点的前面的控制点
              var cAfter = {};   // 当前点的后面的控制点 

              cBefore.x = point.x - delta.x*t;
              cBefore.y = point.y - delta.y*t;

              cAfter.x = point.x + delta.x*(1-t);
              cAfter.y = point.y + delta.y*(1-t);

              cps.push(cBefore);
              cps.push(cAfter);
            }
          }
        

          return cps;

        }//

        p.smoothBezier = smoothBezier;
      });