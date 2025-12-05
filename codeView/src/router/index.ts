import { createRouter, createWebHistory } from 'vue-router'
import NProgress from "nprogress";
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        name: 'home',
        component: import("@/views/DevTools/index.vue"),
      },
      {
        path: "/generate",
        name: "generate",
        component: () => import("@/components/tools/tools-index.vue"),
        meta: {
          keepAlive: false, //需要缓存
        },
      },
      {
        path: "/generate-table",
        name: "generate-table",
        component: () => import("@/components/tools/generateList.vue"),
        meta: {
          keepAlive: false, //需要缓存
        },
      },
      {
        path: "/apiPost",
        name: "jsonFetcher",
        component: () => import("@/components/tools/apiPost.vue"),
        meta: {
          keepAlive: false, //需要缓存
        }
      }
    ]
})

NProgress.configure({
  showSpinner:false
})
router.beforeEach((to)=>{
  NProgress.start();
})
router.afterEach((to)=>{
  NProgress.done()
})

export default router
