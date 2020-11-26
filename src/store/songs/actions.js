import * as firebase from '../../firebase';
import router from '../../router/index';

export default {
    async loadSongs(ctx) {
        ctx.commit('setLoading', true);
        ctx.commit('setError', null);
        try {
            const result = await firebase.songCollection.where("bandId", "==", firebase.auth.currentUser.uid).get();
            let songs = [];
            result.forEach(doc => {
                let song = doc.data();
                song.id = doc.id;
                songs.push(song);
            })
            ctx.commit('setSongs', songs);            
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoading', false);
    },

    async addSong(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingAddSong', true);
        try {
            try {
                await firebase.songCollection.add({
                    bandId: firebase.auth.currentUser.uid,
                    title: payload.title,
                    itunes: payload.itunes,
                    spotify: payload.spotify,
                    soundcloud: payload.soundcloud,
                    youtube: payload.youtube,
                    shop: payload.shop,
                });
                router.push('/band/songs');
            } catch (error) {
                ctx.commit('setError', error);
            }
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingAddSong', false);
    },

    async deleteSong(ctx, payload) {
        await firebase.songCollection.doc(payload).delete();
        ctx.commit('deleteSong', payload);
    },

    clearError(ctx) {
        ctx.commit('setError', null);
    }
}