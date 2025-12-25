// import './assets/main.css'
import { createApp } from 'vue'
import pinia from "./stores/index";
// import {create} from '@/utils/created';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css';
import App from './App.vue';
import hljsVuePlugin from "@highlightjs/vue-plugin"
import "nes.css/css/nes.min.css";
import router from './router';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/atom-one-dark.css' // 推荐主题
import 'highlight.js/lib/common'
import css from 'highlight.js/lib/languages/css'
import WujieVue from "wujie-vue3";
// import './qiankun'
//createApp 根组件选择
const app = createApp(App);
app.directive('highlight', (el) => {
  hljs.highlightBlock(el.querySelector('code'));
  hljs.registerLanguage('css', css)
});
app.use(WujieVue); // 注册组件
app.use(ElementPlus);
app.use(pinia);
app.use(router);
app.use(hljsVuePlugin,{
})
//注册组件
app.mount('#app'); // 挂载到#app
