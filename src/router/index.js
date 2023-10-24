import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import HomeView from '../views/HomeView.vue'
import BadgeGridView from '../views/BadgeGridView.vue'
import AdministratorsView from '../views/AdministratorsView.vue'
import BlockchainsView from '../views/BlockchainsView.vue'
import Register from '../views/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'badgeGrid',
      component: BadgeGridView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/blockchains:/',
      name: 'blockchains',
      component: BlockchainsView
    },
    {
      path: '/administrators',
      name: 'administrators',
      component: AdministratorsView
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
  ]
})

router.beforeEach((to, from) => {
  let currentUser = JSON.parse(localStorage.getItem('auth')) && JSON.parse(localStorage.getItem('auth')).currentUser;
  if(!currentUser && (to.name !== 'login' && to.name !== 'register')) {
    console.log("TUUU")
    localStorage.clear()
    return {name: 'login'}
  }
  if(currentUser && (to.name === 'login' || to.name === 'register')) return {name: 'badgeGrid'}
});

export default router
