import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../firebase'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      requiresAuth: true
    },
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
});

router.beforeEach((to, _, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router
