import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// 定义路由类型（可选）
const routes: RouteRecordRaw[] = [
  { path: '/todoList', name: 'todoList', component: () => import('@/views/todoList/main.vue') }, // todoList
  { path: '/fileResume', name: 'fileResume', component: () => import('@/views/fileResume/main.vue') }, // fileResume
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
