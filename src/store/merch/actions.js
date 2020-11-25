import * as firebase from '../../firebase';
import router from '../../router/index';

export default {
    async loadMerch(ctx) {
        ctx.commit('setError', null);
        ctx.commit('setLoading', true);
        try {
            const result = await firebase.merchCollection.where("bandId", "==", firebase.auth.currentUser.uid).get();
            let merch = [];
            let merchWithImage = [];
            // first create an array of the results
            // we need to do this because you can only use forEach to loop over the result
            // and in order to await Promise a loop you can't use forEach. In stead we use map
            result.forEach(async doc => {
                let item = doc.data();
                item.id = doc.id;
                merch.push(item);
            });
            // wait until all images are fetched because otherwise the getter would 
            // update each time an image is added after commiting setMerch
            await Promise.all(merch.map(async item => {
                //fetch first image for merch item
                const image = await firebase.merchCollection.doc(item.id).collection('images').where('pos', '==', 0).get();
                let counter = 0;
                image.forEach((doc) => {
                    // normally this query would return only one image (with position 0)
                    // but theoretically there could be a bug that creates multiple images 
                    // with pos 0, so just in case only add the first result of the query
                    if (counter === 0) item.image = doc.data();
                    counter++;
                    merchWithImage.push(item);
                });
            }))
            ctx.commit('setMerch', merchWithImage);            
        } catch (error) {
            console.error(error)
            //ctx.commit('setError', error);
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
        // delete all docs in image collection
        await firebase.db.runTransaction(async transaction => {
            const docs =  await firebase.merchCollection.doc(payload).collection('images').get();
            docs.forEach(async image => {
                await transaction.delete(firebase.merchCollection.doc(payload).collection('images').doc(image.id)); 
            });
        });
        // delete merch doc
        await firebase.merchCollection.doc(payload).delete();
        ctx.commit('deleteMerch', payload);
    },

    clearError(ctx) {
        ctx.commit('setError', null);
    }
}