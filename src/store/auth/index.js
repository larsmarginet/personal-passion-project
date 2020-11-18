import * as firebase from '../../firebase'
import router from '../../router/index'

export default {
    state: {
        userProfile: {},
        loading: null,
        error: null
    },
    mutations: {
        setUserProfile(state, payload) {
          state.userProfile = payload;
        },
        setLoading(state, payload) {
          state.loading = payload
        },
        setError(state, payload) {
          state.error = payload.message;
        },
        clearError(state) {
          state.error = null;
        }
    },
    actions: {
        async login(ctx, payload) {
          ctx.commit('setLoading', true);
          // clear existing errors
          ctx.commit('clearError');
          try {
            const { user } = await firebase.auth.signInWithEmailAndPassword(payload.email, payload.password);
            ctx.dispatch('fetchUserProfile', user);
          } catch (error) {
            ctx.commit('setError', error);
          }
          ctx.commit('setLoading', false);
        },

        async signup(ctx, payload) {
          ctx.commit('setLoading', true);
          // clear existing errors
          ctx.commit('clearError');
          // upload image to storage
          await firebase.storage.ref('logos/' + payload.logo.name).put(payload.logo)
          // get url of image in storage to upload to firebase
          const downloadURL = await firebase.storage.ref('logos/').child(payload.logo.name).getDownloadURL();
          // create new user account with email and password
          try {
            const { user } = await firebase.auth.createUserWithEmailAndPassword(payload.email, payload.password);
            // store other user info in firestore with user id 
            if ( payload.facebook || payload.instagram || payload.itunes || payload.spotify || payload.youtube ) {
              try {
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
                ctx.dispatch('fetchUserProfile', user);
              } catch (error) {
                ctx.commit('setError', error);
              }
            } else {
              try {
                await firebase.usersCollection.doc(user.uid).set({
                  name: payload.name,
                  logoUrl: downloadURL,
                  type: payload.type
                });
                ctx.dispatch('fetchUserProfile', user);
              } catch (error) {
                ctx.commit('setError', error);
              }
            }
          } catch (error) {
            ctx.commit('setError', error);
          }
          ctx.commit('setLoading', false);
        },

        async fetchUserProfile(ctx, payload) {
          const userProfile = await firebase.usersCollection.doc(payload.uid).get();
          ctx.commit('setUserProfile', userProfile.data());
          if (router.currentRoute.path === '/login' || router.currentRoute.path === '/signupband' || router.currentRoute.path === '/signupvenue') {
            router.push('/');
          }
        },

        clearError(ctx) {
          ctx.commit('clearError')
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
        },
        loading(state) {
          return state.loading
        }, 
        error(state) {
          return state.error
        }
    }
}