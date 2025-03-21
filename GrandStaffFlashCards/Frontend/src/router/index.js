import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/practice',
      name: 'practice',
      component: () => import('../views/PracticeView.vue')
    },
    {
      path: '/decks',
      name: 'decks',
      component: () => import('../views/DecksView.vue')
    }
  ]
})

export default router 