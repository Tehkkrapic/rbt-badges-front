import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
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
      component: Login,
      meta: {
        hideNavbar: true
      }
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
    localStorage.clear()
    sessionStorage.clear()
    return {name: 'login'}
  }
  if(currentUser && (to.name === 'login' || to.name === 'register')) return {name: 'badgeGrid'}
});

export default router
