<template>
    <div :id="newTinymceId" :class="newTinymceClass"  @input="onInput"  @paste="onPaste"></div>
</template>
<script>
  export default {
    name: 'TinyMce',
    props: {
        newTinymceId: {
            type: String,
            default: 'tinymceEditor'
        },
        newTinymceClass: {
            type: String,
            default: 'tinymce'
        },
        modelValue: { // 接收v-model传递的数据
            type: [String, Number],
            default: ''
        },
        config: {
            type: Object,
            default: ()=>{
                return {}
            }
        },
        src_path: {
            type: String,
            default: ''
        },
        setTimeout_loading_time: {
            type: Number,
            default: 1000
        }
    },
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    data() {
        return{
            tinymce: null
        }
    },
    computed: {
    },
    methods:{
        onPaste(value) {
           this.$emit('tinymce-paste', value)
        },
        onInput(value){
           this.$emit('update:modelValue', value.target.innerHTML)
        },
        createTinymceScript() {
          let script =  document.createElement('script')
          script.src = this.src_path
          let head =  document.querySelector('head')
          head.appendChild(script)
          setTimeout(() => {
            this.initTinymce()
          }, this.setTimeout_loading_time);
        },
        initTinymce() {
            let _this = this
            if(window.tinymce.init){
                let config = _this.config
                window.tinymce.init(config)
            }
        }
    },
    created() {
        this.createTinymceScript()
    },
    mounted(){}
  }
</script>
<style scoped>
/* @import '../assets/components/tinymce/css/blockElement.css'; */
</style>
