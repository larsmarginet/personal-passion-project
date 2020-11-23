import * as firebase from '../../firebase';
import router from '../../router/index';

export default {
    async loadMenu(ctx) {
        ctx.commit('setLoading', true);
        ctx.commit('setError', null);
        try {
            // not snapshot, because everytime venue would update active status this would refetch.
            const result = await firebase.menuCollection.where("venueId", "==", firebase.auth.currentUser.uid).get();
            let menu = [];
            result.forEach(doc => {
                let item = doc.data();
                item.id = doc.id;
                menu.push(item);
            })
            ctx.commit('setMenu', menu);            
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoading', false);
    },

    async addItem(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingAddItem', true);
        try {
            await firebase.storage.ref('menu/' + payload.image.name).put(payload.image);
            const downloadURL = await firebase.storage.ref('menu/').child(payload.image.name).getDownloadURL();
            try {
                await firebase.menuCollection.add({
                    venueId: firebase.auth.currentUser.uid,
                    name: payload.name,
                    image: downloadURL,
                    price: payload.price,
                    category: payload.category,
                    active: true,
                });
                router.push('/venue/menu');
            } catch (error) {
                ctx.commit('setError', error);
            }
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingAddItem', false);
    },

    clearError(ctx) {
        ctx.commit('setLoading', true);
    }
}