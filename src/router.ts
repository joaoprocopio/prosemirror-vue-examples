import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/basics',
      component: () => import('./pages/basics.vue'),
    },
  ],
})

export default router
