import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../firebase'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      requiresAuth: true
    },
    redirect: '/band'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/auth/Login.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import(/* webpackChunkName: "Signup" */ '../views/Signup.vue'),
    redirect: '/signup/choose',
    children : [
      {
        path: 'choose',
        name: 'SignupChoose',
        component: () => import(/* webpackChunkName: "SignupBand" */ '../views/auth/SignupOptions.vue')
      }, 
      {
        path: 'band',
        name: 'SignupBand',
        component: () => import(/* webpackChunkName: "SignupBand" */ '../views/auth/SignupBand.vue')
      }, 
      {
        path: 'venue',
        name: 'SignupVenue',
        component: () => import(/* webpackChunkName: "SignupVenue" */ '../views/auth/SignupVenue.vue')
      }
    ]
  },
  {
    path: '/band',
    name: 'Band',
    meta: {
      requiresAuth: true,
      userType: 'band'
    },
    component: () => import(/* webpackChunkName: "Band" */ '../views/band/Band.vue'),
    redirect: '/band/events',
    children: [
      {
        path: 'events', 
        name: 'BandEvents',
        meta: {
          requiresAuth: true,
          userType: 'band'
        },
        component: () => import(/* webpackChunkName: "BandEvents" */ '../views/band/BandEvents.vue'),
      },
      {
        path: 'merch', 
        name: 'BandMerch',
        meta: {
          requiresAuth: true,
          userType: 'band'
        },
        component: () => import(/* webpackChunkName: "BandMerch" */ '../views/band/BandMerchandise.vue'),
      },
      {
        path: 'songs', 
        name: 'BandSongs',
        meta: {
          requiresAuth: true,
          userType: 'band'
        },
        component: () => import(/* webpackChunkName: "BandSongs" */ '../views/band/BandSongs.vue'),
      },
    ]
  },
  {
    path: '/venue',
    name: 'Venue',
    meta: {
      requiresAuth: true,
      userType: 'venue'
    },
    component: () => import(/* webpackChunkName: "Venue" */ '../views/venue/Venue.vue'),
    redirect: '/venue/events',
    children: [
      {
        path: 'events', 
        name: 'VenueEvents',
        meta: {
          requiresAuth: true,
          userType: 'venue'
        },
        component: () => import(/* webpackChunkName: "VenueEvents" */ '../views/venue/VenueEvents.vue'),
      },
      {
        path: 'events/create', 
        name: 'VenueEventsCreate',
        meta: {
          requiresAuth: true,
          userType: 'venue'
        },
        component: () => import(/* webpackChunkName: "VenueEvents" */ '../views/venue/VenueEventDetail.vue'),
      },
      {
        path: 'events/:id', 
        name: 'VenueEventsDetail',
        props: true,
        meta: {
          requiresAuth: true,
          userType: 'venue'
        },
        component: () => import(/* webpackChunkName: "VenueEvents" */ '../views/venue/VenueEventDetail.vue'),
      },
      {
        path: 'menu', 
        name: 'VenueMenu',
        meta: {
          requiresAuth: true,
          userType: 'venue'
        },
        component: () => import(/* webpackChunkName: "VenueMenu" */ '../views/venue/VenueMenu.vue'),
      },
      {
        path: 'rooms', 
        name: 'VenueRooms',
        meta: {
          requiresAuth: true,
          userType: 'venue'
        },
        component: () => import(/* webpackChunkName: "VenueRooms" */ '../views/venue/VenueRooms.vue'),
      },
    ]
  },
  {
    path: '*',
    meta: {
      requiresAuth: true
    },
    component: () => import(/* webpackChunkName: "NotFound" */ '../views/NotFound.vue'),
  }
]

const router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach((to, _, next) => {
  store.dispatch('setLoadingComponent', true);
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const userType = to.meta.userType;
  if (requiresAuth && !auth.currentUser) {
    next('/login');
  } else if (requiresAuth && auth.currentUser && userType && userType !== auth.currentUser.displayName) {
    next(`/${auth.currentUser.displayName}`);
  } else {
    next();
  }
});

export default router
