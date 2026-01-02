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
    {
      path: '/markdown',
      component: () => import('./pages/003-markdown.vue'),
    },
    {
      path: '/tooltip',
      component: () => import('./pages/004-tooltip.vue'),
    },
    {
      path: '/upload',
      component: () => import('./pages/005-upload.vue'),
    },
  ],
})

export default router
