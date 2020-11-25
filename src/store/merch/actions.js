import * as firebase from '../../firebase';
import router from '../../router/index';

export default {
    async loadMerch(ctx) {
        ctx.commit('setLoading', true);
        ctx.commit('setError', null);
        try {
            const result = await firebase.merchCollection.where("bandId", "==", firebase.auth.currentUser.uid).get();
            let merch = [];
            result.forEach(async doc => {
                let item = doc.data();
                item.id = doc.id;
                // fetch first image for merch item
                const image = await firebase.merchCollection.doc(doc.id).collection('images').where('pos', '==', 0).get();
                let counter = 0;
                image.forEach((doc) => {
                    // normally this query would return only one image (with position 0)
                    // but theoretically there could be a bug that creates multiple images 
                    // with pos 0, so just in case only add the first result of the query
                    if (counter === 0) item.image = doc.data();
                    counter++
                });
                merch.push(item);
            });
            ctx.commit('setMerch', merch);            
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoading', false);
    },

    async addMerch(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingAddMerch', true);
        try {
            const imageUrls = [];
            try {
                // wait until all images have been uploaded
                await Promise.all(payload.images.map(async (image, i) => {
                    await firebase.storage.ref('merch/' + image.name).put(image);
                    const downloadURL = await firebase.storage.ref('merch/').child(image.name).getDownloadURL();
                    // save the position of the image
                    imageUrls.push({pos: i, image: downloadURL});
                }));
            } catch (error) {
                ctx.commit('setError', error);
            }
            try {
                const result = await firebase.merchCollection.add({
                    bandId: firebase.auth.currentUser.uid,
                    name: payload.name,
                    description: payload.description,
                    price: payload.price,
                    category: payload.category,
                    options: payload.options,
                    signable: payload.signable,
                    stock: payload.stock,
                });
                await Promise.all(imageUrls.map(async (image) => { 
                    await firebase.merchCollection.doc(result.id).collection("images").add(image);
                }));
                router.push('/band/merch');
            } catch (error) {
                ctx.commit('setError', error);
            }
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingAddMerch', false);
    },

    async deleteItem(ctx, payload) {
        await firebase.merchCollection.doc(payload).delete();
        ctx.commit('deleteMerch', payload);
    },

    clearError(ctx) {
        ctx.commit('setError', null);
    }
}