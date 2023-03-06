import { createRouter, createWebHashHistory } from 'vue-router'
import MainIndex from '@/views/main/main-index.vue'
import MainGoodsDetail from '@/views/main/main-goods-detail.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainIndex
    },
    {
      path: '/goods',
      component: MainGoodsDetail
    }
  ]
})

export default router
