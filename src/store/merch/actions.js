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

    async getMerchById(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingMerch', true);
        try {
            const result = await firebase.merchCollection.doc(payload).get();  
            let item = result.data();
            item.id = result.id;
            item.images = [];
            const images = await firebase.merchCollection.doc(payload).collection('images').orderBy('pos', 'asc').get();
            images.forEach(image => {
                item.images.push(image.data());
            });
            ctx.commit('setCurrentMerch', item);
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingMerch', false);
    },

    async updateMerch(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingAddMerch', true);
        try {
            const imageUrls = [];
            // step 1: upload necessary images
            try {
                await Promise.all(payload.images.map(async (image, i) => {
                    // check if image is a new file an needs to be uploaded to storage
                    if (image instanceof File) {
                        await firebase.storage.ref('merch/' + image.name).put(image);
                        const downloadURL = await firebase.storage.ref('merch/').child(image.name).getDownloadURL();
                        imageUrls.push({pos: i, image: downloadURL});
                    } else {
                        imageUrls.push({pos: i, image: image.image});
                    }
                }));
            } catch (error) {
                ctx.commit('setError', error);
            }
            // step 2: update merch with data and images
            try {
                await firebase.merchCollection.doc(payload.id).update({
                    name: payload.name,
                    description: payload.description,
                    price: payload.price,
                    category: payload.category,
                    options: payload.options,
                    signable: payload.signable,
                    stock: payload.stock
                });
                const currentImages = [];
                // get all existing images
                const result = await firebase.merchCollection.doc(payload.id).collection("images").get();
                result.forEach(image => currentImages.push(image.id));
                // delete al existing images
                await Promise.all(currentImages.map(async imageId => await firebase.merchCollection.doc(payload.id).collection("images").doc(imageId).delete()));
                // add new images with new position
                await Promise.all(imageUrls.map(async image => await firebase.merchCollection.doc(payload.id).collection("images").add(image)));
            } catch (error) {
                ctx.commit('setError', error);
            } 
            // step 3: update all merch in events that contain said merch
            try {
                await firebase.db.runTransaction(async transaction => {
                    console.log(payload.id)
                    const result = await firebase.eventsCollection.where('bandId', '==', firebase.auth.currentUser.uid).get();
                    result.forEach(async event => {
                        const merch = await firebase.eventsCollection.doc(event.id).collection('merch').where('id', '==', payload.id).get();
                        merch.forEach(async item => {
                            // imageUrls[0] will always be the image with pos 0, so set this one as the standard image
                            // this ensures I don't also need to fetch from images collection when I just want to show one image
                            await transaction.update(firebase.eventsCollection.doc(event.id).collection('merch').doc(item.id), imageUrls[0]);
                            // get all images in the events - merch - image collection
                            const currentImages = await firebase.eventsCollection.doc(event.id).collection('merch').doc(item.id).collection('images').get();
                            // delete all existing images in the events - merch - image collection
                            currentImages.forEach(async img => await firebase.eventsCollection.doc(event.id).collection('merch').doc(item.id).collection('images').doc(img.id).delete());
                            // get all images from the collection within the merch item
                            const result = await firebase.merchCollection.doc(item.id).collection('images').get();
                            // set the images in the events - merch - image collection to the fetched images
                            result.forEach(async img => await firebase.eventsCollection.doc(event.id).collection('merch').doc(item.id).collection('images').doc(img.id).set(img.data()));
                        });
                    })
                });
                //router.push('/band/merch');
            } catch (error) {
                console.error(error)
                // ctx.commit('setError', error);
            } 
        } catch(error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingAddMerch', false);
    },

    async deleteItem(ctx, payload) {
        // delete all docs in image collection
        await firebase.db.runTransaction(async transaction => {
            const images =  await firebase.merchCollection.doc(payload).collection('images').get();
            images.forEach(async image => {
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