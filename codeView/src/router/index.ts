import { createRouter, createWebHistory } from 'vue-router'
import { start as progressStart, close as progressClose } from '@/utils/nprogress'
import pinia from '@/stores/index'
import { useUserStore } from '@/stores/useUserStore'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        redirect: '/home'
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login/index.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home/index.vue'),
        meta: {
          keepAlive: false,
        },
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
      },
      {
        path: "/coding",
        name: "coding",
        component: () => import("@/components/tools/coding.vue"),
        meta: {
          keepAlive: false, //需要缓存
        }
      }
    ]
})

router.beforeEach((to)=>{
  progressStart();
  const userStore = useUserStore(pinia)
  if (to.path === '/login' && userStore.token) {
    return { path: '/home' }
  }
  if (to.path !== '/login' && !userStore.token) {
    return { path: '/login' }
  }
})
router.afterEach((to)=>{
  progressClose()
})

export default router
