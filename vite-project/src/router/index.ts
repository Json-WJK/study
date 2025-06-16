import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// 定义路由类型（可选）
const routes: RouteRecordRaw[] = [
  { path: '/todoList', name: 'Home', component: () => import('@/views/todoList/main.vue') }, // todoList
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
