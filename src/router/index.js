import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../firebase'
import store from '../store/index'
import * as meta from '../helpers/metaData'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: meta.home.title,
      metaTags: meta.home.metaTags,
      requiresAuth: true,
    },
    redirect: '/band'
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: meta.login.title,
      metaTags: meta.login.metaTags,
    },
    component: () => import(/* webpackChunkName: "Login" */ '../views/auth/Login.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    meta: {
      title: meta.signup.title,
      metaTags: meta.signup.metaTags,
    },
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
          title: meta.bandEvents.title,
          metaTags: meta.bandEvents.metaTags,
          requiresAuth: true,
          userType: 'band'
        },
        component: () => import(/* webpackChunkName: "BandEvents" */ '../views/band/BandEvents.vue'),
      },
      {
        path: 'events/:id', 
        name: 'BandEventsDetail',
        props: true,
        meta: {
          title: meta.bandEventsDetail.title,
          metaTags: meta.bandEventsDetail.metaTags,
          requiresAuth: true,
          userType: 'band'
        },
        component: () => import(/* webpackChunkName: "BandEventsDetail" */ '../views/band/BandEventsDetail.vue'),
      },
      {
        path: 'orders/:id', 
        name: 'BandOrders',
        props: true,
        meta: {
          title: meta.bandOrders.title,
          metaTags: meta.bandOrders.metaTags,
          requiresAuth: true,
          userType: 'band'
        },
        component: () => import(/* webpackChunkName: "BandOrders" */ '../views/band/BandOrders.vue'),
      },
      {
        path: 'merch', 
        name: 'BandMerch',
        meta: {
          title: meta.bandMerch.title,
          metaTags: meta.bandMerch.metaTags,
          requiresAuth: true,
          userType: 'band'
        },
        component: () => import(/* webpackChunkName: "BandMerch" */ '../views/band/BandMerchandise.vue'),
      },
      {
        path: 'merch/create', 
        name: 'BandMerchCreate',
        meta: {
          title: meta.bandMerch.title,
          metaTags: meta.bandMerch.metaTags,
          requiresAuth: true,
          userType: 'band'
        },
        component: () => import(/* webpackChunkName: "BandMerchandiseDetail" */ '../views/band/BandMerchandiseDetail.vue'),
      },
      {
        path: 'merch/:id', 
        name: 'BandMerchDetail',
        props: true,
        meta: {
          title: meta.bandMerchCreate.title,
          metaTags: meta.bandMerchCreate.metaTags,
          requiresAuth: true,
          userType: 'band'
        },
        component: () => import(/* webpackChunkName: "BandMerchandiseDetail" */ '../views/band/BandMerchandiseDetail.vue'),
      },
      {
        path: 'songs', 
        name: 'BandSongs',
        meta: {
          title: meta.bandSongs.title,
          metaTags: meta.bandSongs.metaTags,
          requiresAuth: true,
          userType: 'band'
        },
        component: () => import(/* webpackChunkName: "BandSongs" */ '../views/band/BandSongs.vue'),
      },
      {
        path: 'songs/create', 
        name: 'BandSongsCreate',
        meta: {
          title: meta.bandSongsCreate.title,
          metaTags: meta.bandSongsCreate.metaTags,
          requiresAuth: true,
          userType: 'band'
        },
        component: () => import(/* webpackChunkName: "BandSongsDetail" */ '../views/band/BandSongsDetail.vue'),
      },
      {
        path: 'songs/:id', 
        name: 'BandSongsDetail',
        props: true, 
        meta: {
          title: meta.bandSongsDetail.title,
          metaTags: meta.bandSongsDetail.metaTags,
          requiresAuth: true,
          userType: 'band'
        },
        component: () => import(/* webpackChunkName: "BandSongsDetail" */ '../views/band/BandSongsDetail.vue'),
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
          title: meta.venueEvents.title,
          metaTags: meta.venueEvents.metaTags,
          requiresAuth: true,
          userType: 'venue'
        },
        component: () => import(/* webpackChunkName: "VenueEvents" */ '../views/venue/VenueEvents.vue'),
      },
      {
        path: 'events/create', 
        name: 'VenueEventsCreate',
        meta: {
          title: meta.venueEventsCreate.title,
          metaTags: meta.venueEventsCreate.metaTags,
          requiresAuth: true,
          userType: 'venue'
        },
        component: () => import(/* webpackChunkName: "VenueEventDetail" */ '../views/venue/VenueEventDetail.vue'),
      },
      {
        path: 'events/:id', 
        name: 'VenueEventsDetail',
        props: true,
        meta: {
          title: meta.venueEventsDetail.title,
          metaTags: meta.venueEventsDetail.metaTags,
          requiresAuth: true,
          userType: 'venue'
        },
        component: () => import(/* webpackChunkName: "VenueEventDetail" */ '../views/venue/VenueEventDetail.vue'),
      },
      {
        path: 'orders/:id', 
        name: 'VenueOrders',
        props: true,
        meta: {
          title: meta.venueOrders.title,
          metaTags: meta.venueOrders.metaTags,
          requiresAuth: true,
          userType: 'venue'
        },
        component: () => import(/* webpackChunkName: "VenueOrders" */ '../views/venue/VenueOrders.vue'),
      },
      {
        path: 'menu', 
        name: 'VenueMenu',
        meta: {
          title: meta.venueMenu.title,
          metaTags: meta.venueMenu.metaTags,
          requiresAuth: true,
          userType: 'venue'
        },
        component: () => import(/* webpackChunkName: "VenueMenu" */ '../views/venue/VenueMenu.vue'),
      },
      {
        path: 'menu/create', 
        name: 'VenueMenuCreate',
        meta: {
          title: meta.venueMenuCreate.title,
          metaTags: meta.venueMenuCreate.metaTags,
          requiresAuth: true,
          userType: 'venue'
        },
        component: () => import(/* webpackChunkName: "VenueMenuDetail" */ '../views/venue/VenueMenuDetail.vue'),
      },
      {
        path: 'menu/:id', 
        name: 'VenueMenuDetail',
        props: true,
        meta: {
          title: meta.venueMenuDetail.title,
          metaTags: meta.venueMenuDetail.metaTags,
          requiresAuth: true,
          userType: 'venue'
        },
        component: () => import(/* webpackChunkName: "VenueMenuDetail" */ '../views/venue/VenueMenuDetail.vue'),
      },
      {
        path: 'rooms', 
        name: 'VenueRooms',
        meta: {
          title: meta.venueRooms.title,
          metaTags: meta.venueRooms.metaTags,
          requiresAuth: true,
          userType: 'venue'
        },
        component: () => import(/* webpackChunkName: "VenueRooms" */ '../views/venue/VenueRooms.vue'),
      },
      {
        path: 'rooms/create', 
        name: 'VenueRoomsCreate',
        meta: {
          title: meta.venueRooms.title,
          metaTags: meta.venueRooms.metaTags,
          requiresAuth: true,
          userType: 'venue'
        },
        component: () => import(/* webpackChunkName: "VenueRoomsDetail" */ '../views/venue/VenueRoomsDetail.vue'),
      },
      {
        path: 'rooms/:id', 
        name: 'VenueRoomsDetail',
        props: true,
        meta: {
          title: meta.venueRooms.title,
          metaTags: meta.venueRooms.metaTags,
          requiresAuth: true,
          userType: 'venue'
        },
        component: () => import(/* webpackChunkName: "VenueRoomsDetail" */ '../views/venue/VenueRoomsDetail.vue'),
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
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  setMetaData(nearestWithTitle, nearestWithMeta);
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

const setMetaData = (title, meta) =>  {
  if(title) document.title = `concery - ${title.meta.title}`;
  // remove existing meta tags
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));
  if(meta) {
    meta.meta.metaTags.map(tagDef => {
      const tag = document.createElement('meta');
      Object.keys(tagDef).forEach(key => {
        tag.setAttribute(key, tagDef[key]);
      });
      tag.setAttribute('data-vue-router-controlled', '');
      return tag;
    }).forEach(tag => document.head.appendChild(tag));
  }
}

export default router;
