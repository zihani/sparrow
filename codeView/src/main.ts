// import './assets/main.css'
import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import pinia from "./stores/index";
// import {create} from '@/utils/created';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css';
import App from './App.vue';
import hljsVuePlugin from "@highlightjs/vue-plugin"
import "nes.css/css/nes.min.css";
import router from './router';
import 'primevue/resources/themes/lara-light-green/theme.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/atom-one-dark.css' // 推荐主题
import 'highlight.js/lib/common'
import css from 'highlight.js/lib/languages/css'
// import './qiankun'
//createApp 根组件选择
const app = createApp(App);
app.directive('tooltip', Tooltip); //directive 注册指令
app.directive('highlight', (el) => {
  hljs.highlightBlock(el.querySelector('code'));
  hljs.registerLanguage('css', css)
});
app.use(ElementPlus);
app.use(pinia);
app.use(router);
app.use(PrimeVue, { unstyled: false }); //是否开启PrimeVue无样式模式
app.use(hljsVuePlugin,{
})
//注册组件
app.mount('#app'); // 挂载到#app
