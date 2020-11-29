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
                    active: payload.active,
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

    async getItemById(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingItem', true);
        try {
            const result = await firebase.menuCollection.doc(payload).get();  
            let item = result.data();
            item.id = result.id;
            ctx.commit('setCurrentItem', item);
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingItem', false);
    },

    async updateItem(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingAddItem', true);
        // chech if user has updated the image
        // if yes, we need to upload a new one,
        // if no, we can still use the same imageUrl
        if (payload.image instanceof File) {
            await firebase.storage.ref('menu/' + payload.image.name).put(payload.image);
            // change the image property to the url 
            // will only happen if the image property wasn't an url, but a file
            payload.image = await firebase.storage.ref('menu/').child(payload.image.name).getDownloadURL();
        }
        try {
            await firebase.menuCollection.doc(payload.id).update({
                name: payload.name,
                active: payload.active,
                image: payload.image,
                price: payload.price,
                category: payload.category
            }); 
            router.push('/venue/menu');
        } catch(error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingAddItem', false);
    },

    async updateActiveStateItem(ctx, payload) {
        ctx.commit('setError', null);
        try {
            await firebase.menuCollection.doc(payload.id).update({
                active: payload.active,
            });
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('updateActiveStateItem', payload);
    },

    async deleteItem(ctx, payload) {
        await firebase.menuCollection.doc(payload).delete();
        ctx.commit('deleteMenuItem', payload);
    },

    clearError(ctx) {
        ctx.commit('setError', null);
    }
}