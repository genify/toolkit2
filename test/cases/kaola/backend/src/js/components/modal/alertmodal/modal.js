/*
 * --------------------------------------------
 * 弹窗组件
 * @version  1.0
 * @author   hzzhenghaibo(hzzhenghaibo@corp.netease.com)
 * --------------------------------------------
 */
define([
  'text!./modal.html',
  'pro/widget/BaseComponent',
  'pro/base/util'
  ], function(tpl, BaseComponent, _){


  /**
   * 弹窗组件
   * 直接调用, this.destroy() 来关闭弹窗和回收
   * Event:
   *   -close (data): 关闭事件, 事件对象即data
   *   -confirm (data): 确认时间，时间对象即data
   * 配置: 
   *   content: 即弹窗body处的内容
   */


  var OKModal = BaseComponent.extend({
    template: tpl,
    // 默认属性
    // 计算属性
    init: function(){
      // 证明不是内嵌组件
      if(this.$root == this) this.$inject(document.body);
    },
    confirm: function(){
      this.$emit("confirm", this.data);
    },
    close: function(){
      this.$emit("close", this.data);
    }
    // 使用timeout模块
  });



  return OKModal;

  /**
   * 使用:
   *    progress.start() 开始进度条
   *    progress.end(isError) 结束进度条
   *    progress.move() 移动到某个进度条位置，最大100
   */

})