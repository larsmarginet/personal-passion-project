import * as firebase from '../../firebase'
import router from '../../router/index'

export default {
    state: {
        userProfile: {}
    },
    mutations: {
        setUserProfile(state, val) {
          state.userProfile = val;
        }
    },
    actions: {
        async login(ctx, payload) {
          const { user } = await firebase.auth.signInWithEmailAndPassword(payload.email, payload.password);
          ctx.dispatch('fetchUserProfile', user);
        },

        async signup({ dispatch }, payload) {
          // upload image to storage
          await firebase.storage.ref('logos/' + payload.logo.name).put(payload.logo)
          // get url of image in storage to upload to firebase
          const downloadURL = await firebase.storage.ref('logos/').child(payload.logo.name).getDownloadURL();
          // create new user account with email and password
          const { user } = await firebase.auth.createUserWithEmailAndPassword(payload.email, payload.password);
          // store other user info in firestore with user id 
          if ( payload.facebook || payload.instagram || payload.itunes || payload.spotify || payload.youtube ) {
            await firebase.usersCollection.doc(user.uid).set({
              name: payload.name,
              logoUrl: downloadURL,
              facebook: payload.facebook,
              instagram: payload.instagram,
              itunes: payload.itunes,
              spotify: payload.spotify,
              youtube: payload.youtube,
              type: payload.type
            });
          } else {
            await firebase.usersCollection.doc(user.uid).set({
              name: payload.name,
              logoUrl: downloadURL,
              type: payload.type
            });
          }
          dispatch('fetchUserProfile', user);
        },

        async fetchUserProfile(ctx, payload) {
          const userProfile = await firebase.usersCollection.doc(payload.uid).get();
          ctx.commit('setUserProfile', userProfile.data());
          if (router.currentRoute.path === '/login' || router.currentRoute.path === '/signupband' || router.currentRoute.path === '/signupvenue') {
            router.push('/');
          }
        },

        async logout(ctx) {
            await firebase.auth.signOut()
            ctx.commit('setUserProfile', {})
            router.push('/login')
        }
    },
    getters: {
        user(state) {
            return state.userProfile
        }
    }
}