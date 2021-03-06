import * as firebase from '../../firebase';
import router from '../../router/index';

export default {
    async login(ctx, payload) {
        ctx.commit('setLoading', true);
        // clear existing errors
        ctx.commit('clearError');
        try {
            await firebase.auth.signInWithEmailAndPassword(payload.email, payload.password);
            // no need for ctx.dispatch('fetchUserProfile', user); here, because onauthchanges in main.js triggers this
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
        await firebase.storage.ref('logos/' + payload.logo.name).put(payload.logo);
        // get url of image in storage to upload to firebase
        const downloadURL = await firebase.storage.ref('logos/').child(payload.logo.name).getDownloadURL();
        // create new user account with email and password
        try {
            const { user } = await firebase.auth.createUserWithEmailAndPassword(payload.email, payload.password);
            if (user) {
                try {
                    await user.updateProfile({ displayName: payload.type });
                } catch (error) {
                    ctx.commit('setError', error);
                }
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
            }
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoading', false);
    },

    async fetchUserProfile(ctx, payload) {
        const userProfile = await firebase.usersCollection.doc(payload.uid).get();
        // when signing up onAutChanges triggers this fuction
        // before user is set in firestore, thus check if user exists
        // then, after setting the user to firestore this function
        // is called again, but now the user is known in firestore
        if (userProfile.data()) {
            ctx.commit('setUserProfile', userProfile.data());
            if (router.currentRoute.path === '/login' || router.currentRoute.path === '/signup/band' || router.currentRoute.path === '/signup/venue') {
                if (userProfile.data().type === 'venue') {
                    router.push('/venue/events');
                } else if (userProfile.data().type === 'band') {
                    router.push('/band/events');
                }
            }
        }
    },

    clearError(ctx) {
        ctx.commit('clearError');
    },

    async logout(ctx) {
        ctx.commit('setLoading', true);
        ctx.commit('clearError');
        try {
            await firebase.auth.signOut();
            ctx.commit('setUserProfile', {});
            router.push('/login');
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoading', false);
    }
}