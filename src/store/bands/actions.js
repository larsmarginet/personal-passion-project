import * as firebase from '../../firebase';

export default {
    async loadBands(ctx) {
        ctx.commit('setLoading', true);
        ctx.commit('setError', null);
        try {
            await firebase.usersCollection.where("type", "==", "band").orderBy('name', 'asc').onSnapshot(snapshot => {
                let bands = [];
                snapshot.forEach(doc => {
                    let band = doc.data();
                    band.id = doc.id;
                    bands.push(band);
                })
                ctx.commit('setBands', bands);
            })            
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoading', false);
    },
    clearError(ctx) {
        ctx.commit('setLoading', true);
    }
}