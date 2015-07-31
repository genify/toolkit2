/*
* ------------------------------------------
* 图表仪表盘（图表面板）
* @version 0.0.1
* @author jw(hzzhangjw@corp.netease.com)
* ------------------------------------------
*/

/** @module chart */

define(['{pro}/libs/colorbox.js'],function(mColorbox){

          /**
           * 图表仪表盘（图表面板）
           * 图表容器,构造函数接受一个html element作为图表容器，如果html element未指定宽高，则使用默认800 * 600。
           * @class module:chart/dashboard.Dashboard
           * @param container {Div} dashboard的父节点容器
           * @extends module:colorbox.Stage
           */
          Dashboard = mColorbox.Stage.extend({
            initialize:function(container){
              if(container.container)
              {//兼容老版本
                if(typeof(container.container) === "string")
                {
                  container.container = document.getElementById(container);
                }
                this.execProto('initialize',container);
              }else
              {//直接传入container
                if(typeof(container) === "string")
                {
                  container = document.getElementById(container);
                }
                var w = container.offsetWidth ? (container.offsetWidth) : 800;
                var h = container.offsetHeight ? (container.offsetHeight): 600;
                this.execProto('initialize',{
                  width:w,
                  height:h,
                  container:container
                });
              }
            },

            /**
             * 添加图表到dashboard
             * @method module:chart/dashboard.Dashboard#addChart
             * @param  chart {Object}  chart图表实例
             * @return  {void} 
             */
            addChart:function(chart){
              this.add(chart.root());
            },
            /**
             * 从dashboard上删除图表
             * @method module:chart/dashboard.Dashboard#removeChart
             * @param  chart {Object}  chart图表实例
             * @return  {void} 
             */
            removeChart:function(chart){
              this.remove(chart.root());
            }
          });


          return Dashboard;
        });