import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/Login.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/Signup.vue')
  },
  {
    path: '/signupband',
    name: 'SignupBand',
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/SignupBand.vue')
  },
  {
    path: '/signupvenue',
    name: 'SignupVenue',
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/SignupVenue.vue')
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})

export default router
