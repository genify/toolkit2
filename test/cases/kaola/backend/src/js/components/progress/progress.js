/*
 * --------------------------------------------
 * 全局进度条控件
 * @version  1.0
 * @author   hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 * --------------------------------------------
 */
define([
  'text!./progress.html',
  'pro/lib/regularjs/dist/regular'
  ], function(tpl, R){
	var config ={
	  COLOR_SUCCESS:'#5cb85c',
	  COLOR_INFO:'#5bc0de',
	  COLOR_DANGER:'#d9534f',
	  COLOR_WARNING:'#f0ad4e'
	};

  // @TODO: move to another file
  // mix color1 with color2 : from mcss
  function mix(c1, c2, weight){
    var p = weight/100,
        a = 0,
        w = p * 2 -1,
        w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0,
        w2 = 1 - w1,
        channels = [
            parseInt(c1[0] * w1 + c2[0] * w2),
            parseInt(c1[1] * w1 + c2[1] * w2),
            parseInt(c1[2] * w1 + c2[2] * w2)
        ];
    return channels
  }

  function rgb(hash){
    hash = hash.charAt(0) === '#'? hash.slice(1) : hash
    var channels;
    if (hash.length === 6) {
      channels = [
        parseInt(hash.substr(0, 2), 16), 
        parseInt(hash.substr(2, 2), 16), 
        parseInt(hash.substr(4, 2), 16) 
      ];
    }else {
      var r = hash.substr(0, 1);
      var g = hash.substr(1, 1);
      var b = hash.substr(2, 1);
      channels = [
          parseInt(r + r, 16), 
          parseInt(g + g, 16), 
          parseInt(b + b, 16)
      ];
    }
    return channels;

  }

  var color = {
    ERROR: rgb(config.COLOR_DANGER),
    COMPLETE: rgb(config.COLOR_SUCCESS)
  } 

  var Progress = Regular.extend({
    template: tpl,
    // 默认属性
    data: {
      startColor: rgb(config.COLOR_INFO),
      endColor: color.COMPLETE,
      percent:0
    },
    // 计算属性
    computed: {
      currentColor: function(data){
        var channels = mix(data.startColor, data.endColor, 100 - data.percent);
        return "rgb(" + channels[0] + "," + channels[1] + "," +channels[2] + ")";
      } 
    },
    // 初始化后的函数
    init: function(){
      // 证明不是内嵌组件
      if(this.$root == this) this.$inject(document.body);
    },
    // 移动到某个百分比
    move: function(percent){
      clearTimeout(this.timer);
      if(percent === 1000) this.end(true)
      else this.$update('percent', percent);
    },
    // 开始
    start: function(){
      if(this.timer) clearTimeout(this.timer);
      this.data.progress = true;
      this.data.percent = 2;
      this.data.endColor = color.COMPLETE;
      this.$update();
      this._startTimer();
    },
    // 结束
    end: function(error){
      clearTimeout(this.timer);
      this.data.progress = false;
      this.data.percent = 100;
      this.data.endColor = !error? color.COMPLETE: color.ERROR;
      this.$update()
    },
    // 开始定时器
    _startTimer: function(){
      var data = this.data;
      this.timer = this.$timeout(function(){
        data.percent = data.percent + (100 - data.percent) * (Math.random() * .2);
        this._startTimer();
        console.log(this.$get('currentColor'))
      }, Math.random() * 1000 + 2000);
    }
    // 使用timeout模块
  }).use('timeout');


  // 单例, 直接初始化
  return new Progress();

  /**
   * 使用:
   *    progress.start() 开始进度条
   *    progress.end(isError) 结束进度条
   *    progress.move() 移动到某个进度条位置，最大100
   */

})