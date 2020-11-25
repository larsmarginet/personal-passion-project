import * as firebase from '../../firebase';
import router from '../../router/index';

export default {
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