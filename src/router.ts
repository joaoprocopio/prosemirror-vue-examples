import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/basic',
      component: () => import('./pages/001-basic.vue'),
    },
    {
      path: '/dino',
      component: () => import('./pages/002-dino.vue'),
    },
  ],
})

export default router
