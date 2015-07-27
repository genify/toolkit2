/*
 * --------------------------------------------
 * BaseComponent 指令扩展
 * @version  1.0
 * @author   yuqijun(yuqijun@corp.netease.com)
 * --------------------------------------------
 */
define([
  'pro/base/config',
  'util/file/select',
  'util/ajax/xdr',
  'base/event',
  'pro/lib/regularjs/dist/regular'
], function( config,  s, j,  v){

  // Regular中的dom帮助函数
  var dom = Regular.dom;

  var directives = {

    'r-tooltip': function(elem, value){
      console.log('do some directive logic');
    }
  }

  var events = {

    // 使用nej的mouseenter
    'mouseenter': function(elem, fire, attrs){
      v._$addEvent(elem, 'mouseenter', fire)
      return function(){
        v._$delEvent(elem, 'mouseenter', fire)
      }
    },
    // 使用nej的mouseleave
    'mouseleave': function(elem, fire, attrs){
      v._$addEvent(elem, 'mouseleave', fire)
      return function(){
        v._$delEvent(elem, 'mouseleave', fire)
      }
    },

    // on-upload 的custom event实现
    // 注意 on-upload 必须绑定在 label上
    'upload': function(elem, fire, attrs){
      // 我们需要另外一个属性以提取参数

      var param = attrs.filter(function(attr){
        return attr.name === 'upload-param';
      })[0];

      var form; 

      // 处理上传
      function onUpload(json){
        if(json && json.code === 200){ //success
          fire({type: 'upload', data: json.data});
        }else{
          fire({type: 'error', message: json.message});
        }
        bindSelectFile();
      }

      // 处理进度条
      function onProgress(json){
        if(json && typeof json.total === 'number' && typeof json.progress === 'number'){
          fire({ type: 'progress' , data: json.progress / json.total });
        }
      }
      // 处理选择file
      function onFileChange(ev){
        if(typeof FileReader === 'function'){
          var files = nes.one('input', ev.form ).files,
            file = files[0];
          var reader = new FileReader(file);

          reader.readAsDataURL(file); //读取文件

          reader.addEventListener('load', function(){
            fire({type: 'preview', data: this.result})
          })
        }
        
        s._$unbind(ev.id);
        ev.form.setAttribute('action', config.UPLOAD_URL)

        j._$upload(ev.form, {
          onload: onUpload,
          onerror: onUpload,
          onuploading: onProgress
        })
      }
      var id;
      function bindSelectFile(){
        id = s._$bind(elem, {
          parent: elem.parentNode,
          name: 'img',
          multiple: false,
          accept:'image/*',
          onchange: onFileChange
        });
      }
      // 使用select动态生成input:file.
      // 由于必须要在文档中，所以必须在inject之后进行bind
      if(this.$root === this){
        this.$on('inject', bindSelectFile);
      }else{
        bindSelectFile();
      }


      if(param) expression = Regular.expression(param.value);




      return function destroy(){
        if(id) s._$unbind(id);
        // TODO: remove form 根据id
      }
    }
  }

  return {
    events: events,
    directives: directives
  };

})