<template>
  <div id="app">
    <section class="layout">
      <div class="header">{{content}}</div>
      <contents class="leftSide"></contents>
      <div class="body">
        <tinymce :newTinymceId="newTinymceId" :newTinymceClass="newTinymceClass"  v-model="content" :config="config" :src_path="src_path" :setTimeout_loading_time='1000' @tinymce-paste='paste' @update:modelValue="handleModelUpdate"></tinymce>
      </div>
      <option-elemet class="rightSide"></option-elemet> 
      <div class="footer">5</div>
    </section>
  </div>
</template>
<script>
import tinymce from './components/tinymce/index.vue'
import contents from './components/contents.vue' 
import optionElemet from './components/optionElemet.vue' 
import { tinymceApi , tinymceTree } from './components/tinymce/tinymceApi.js'
export default {
  name: 'App',
  components: {
    tinymce,
    contents,
    optionElemet
  },
  data(){
    return {
      newTinymceId: 'tinymceEditor',   // tinymce id
      newTinymceClass: 'tinymce', // tinymce样式
      config: {}, // tinymce配置
      content:'<h1>22222</h1>', // 初始化内容
      src_path: window.location.origin + '/tinymce7.5.1/js/tinymce/tinymce.min.js',  // tinymce路径
      tinymceEditor: new tinymceApi('tinymceEditor')  // tinymce实例
    }
  },
   methods: {
    init() {
      let element = document.createElement('div')
      element.innerHTML = this.content
      console.log(element)
      new tinymceTree(element)
    },
    handleModelUpdate(value){
      console.log(this.content)
      console.log(value)
    },
    paste() {
      this.content = this.tinymceEditor.tinymce().getContent()
    },
    newTinymce() {
        // 只对tinymceEditor id的元素进行初始化 
        let _this = this
        this.config = {
            selector:'#tinymceEditor',
            language: 'zh_CN',
            browser_spellcheck: true,
            branding: false, // 去水印,
            statusbar: false, // 隐藏编辑器底部的状态栏
            menubar:false,
            inline: true,
            media_live_embeds: true,
            min_height: 400,
            auto_focus: true,
            sandbox_iframes: false,
            paste_data_images: true,
            toolbar:'undo redo formatpainter blocks kityformula-editor',
            plugins: 'kityformula-editor paste',
            font_size_formats: '默认 12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 40px 44px 48px 52px 56px 60px',
            font_family_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;宋体=simsun,serif,sans-serif;仿宋体=FangSong,serif,sans-serif;楷体=KaiTi,serif,sans-serif;黑体=SimHei,sans-serif;隶书=LiSu,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Times New Roman=Times New Roman,helvetica,sans-serif;',
            block_formats: '标题1=h1; 标题2=h2; 标题3=h3; 标题4=h4; 标题5=h5; 标题6=h6; 正文=p;',
            toolbar_mode: 'float', // 'floating', //'wrap',
            toolbar_sticky: true,
            // toolbar_sticky_offset: 380, // 设置工具栏与视口
            custom_ui_selector: 'body',
            advlist_bullet_styles: 'square',
            init_instance_callback: (editor) =>{
              editor
            },
            editimage_cors_hosts:'', //  跨域地址
            paste_preprocess: function(plugin, args) {
                let {
                  content,
                  wordContent,
                  imageContent,
                } = args;
                wordContent
                imageContent
                plugin
                content
                let api =  new tinymceApi('tinymceEditor')
                api
            },
            setup: (editor) =>{
                editor.on('input', function() {
                });
                editor.on('dblclick', function(e) {
                  e
                  // 公式插件配合图片实现双击编辑
                  //let baseURL = e.currentTarget.baseURI+'plugins/kityformula-editor/kityFormula.html';
                  let baseURL ='http://localhost:8080/tinymce7.5.1/js/tinymce/plugins/kityformula-editor/kityFormula.html'
                  // 获取当前标签元素中的data-latex属性并判断是否存在
                  let lslatex = editor.selectionGetNode.getAttribute('data-latex')
                  let attributes = editor.selectionGetNode.getAttribute('data-attributes')

                  if (lslatex) {
                    // 证明当前选择的元素时候是公式图片元素
                   var dcodeLslatex = encodeURIComponent(lslatex)
                   var dcodeAttributes = encodeURIComponent(attributes)
                  //  +"?attributes="+
                   attributes
                  //  window.open(param)
                    editor.windowManager.openUrl({
                        title: '插入公式',
                        size: 'large',
                        width: 785,
                        height: 475,
                        url:baseURL+"?lslatex="+dcodeLslatex+"&attributes="+dcodeAttributes,
                        buttons: [
                            {
                                type: 'cancel',
                                text: 'Close'
                            },
                            {
                                type: 'custom',
                                text: 'Save',
                                name: 'save',
                                primary: true
                            },
                        ],
                        onAction: function (api, details) {
                            switch (details.name) {
                                case 'save':
                                    api.sendMessage("save");
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                  }
                  // path
                  // let path2=/data-latex="(.*?)"/g;
                  // if(sel.search(path)==0){
                  //     // sel.replace(path2,function($0,$1){
                  //     //     console.log($1)
                  //     //     // var param=encodeURIComponent($1);
                  //     //     // openDialog(param);
                  //     //     return $0;
                  //     // });
                  // };
                  console.log(baseURL)
                });
                editor.on('click', function(e) {
                  e
                  //  let  = editor.selection.getNode().querySelector('[data-latex]');
                  //  console.log(editor.selection.getNode())
                  // console.log('editor.windowManager')
                  // console.log(editor.windowManager)
                  // console.log('editor.windowManager')

                  // var sel=editor.selection.getContent();
                  // var path=/\<img(.*?)src="data:image\/png;base64,[A-Za-z0-9+/=]*"(.*?)data-latex="(.*?)" \/>/g;
                  // var path2=/data-latex="(.*?)"/g;

                  // if(sel.search(path)==0){
                  //     sel.replace(path2,function($0,$1){
                  //         var param=encodeURIComponent($1);
                  //         openDialog(param);
                  //         return $0;
                  //     });
                  // };

                  // var openDialog = function(param) {
                  //     return editor.windowManager.openUrl({
                  //         title: '插入公式',
                  //         size: 'large',
                  //         width: 785,
                  //         height: 475,
                  //         url:param?baseURL+"?c="+param:baseURL,
                  //         buttons: [
                  //             {
                  //                 type: 'cancel',
                  //                 text: 'Close'
                  //             },
                  //             {
                  //                 type: 'custom',
                  //                 text: 'Save',
                  //                 name: 'save',
                  //                 primary: true
                  //             },
                  //         ],
                  //         onAction: function (api, details) {
                  //             switch (details.name) {
                  //                 case 'save':
                  //                     api.sendMessage("save");
                  //                     break;
                  //                 default:
                  //                     break;
                  //             };
                  //         }
                  //     });
                  // };
                  // console.log(e)
                  // console.log('api')
                  // console.log(_this.tinymceEditor.tinymce())
                  // console.log('api')
                  // // _this.api.tinymce()
                  // editor.selectionContentElements = 1
                  // console.log(_this.tinymceEditor.tinymce())
                    // 保证在初始化多个编辑器中时官方的api不会串 只获取当前编辑器所点击获取的文本元素。
                    editor.selectionContentElements = editor.selection.getSelectedBlocks();
                    editor.selectionContentText = editor.selection.getContent({format: 'text'});
                    editor.selectionGetContent = editor.selection.getContent();
                    editor.selectionGetNode = editor.selection.getNode()
                });
                editor.on('init', function(){
                    editor.setContent(_this.content)
                    editor.selectionContentElements = ''
                    editor.selectionContentText = ''
                    editor.selectionGetContent = ''
                });
                editor.on('EditorContentLoaded', function () {

                });
                editor.on('ExecCommand', function(e) {
                    _this.content = _this.tinymceEditor.tinymce().getContent()
                    if(e.command === 'mceToggleFormat'){
                        console.log('e.value')
                        console.log(e.value)
                        console.log('e.value')
                    }
                })
                // editor.on('dblclick', function () {
                //     alert('dblclick')
                // })
            }
        }
    }
   },
   mounted(){
     this.newTinymce()
     this.init()
   }
}
</script>
<style>
.layout {
  width: 100%;
  display: grid;
  grid:
    "header header header" auto
    "leftSide body rightSide" 3fr
    "footer footer footer" auto
    / auto 1fr auto;
  gap: 8px;
  height: 100vh;
}

.header { grid-area: header; }
.leftSide { grid-area: leftSide; }
.body { grid-area: body; margin-top: 50px;}
.rightSide { grid-area: rightSide; }
.footer { grid-area: footer; }
/* .tox-editor-header {
  width: 300px !important;
} */
#tinymceEditor {
    height: 100%; 
    border: 1px solid rgb(166, 166, 166); 
    outline: none;
}
</style>
