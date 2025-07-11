import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from './components/Login.vue'
import Layout from './components/Layout.vue'
import Welcome from './components/Welcome.vue'
import Profile from './components/Profile.vue'
import NetworkManagement from './components/NetworkManagement.vue'

const routes: RouteRecordRaw[] = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: Welcome },
      { path: 'profile', component: Profile },
      { path: 'network-management', component: NetworkManagement }
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/ai-test/'),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
