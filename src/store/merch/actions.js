import * as firebase from '../../firebase';
// import router from '../../router/index';

export default {
    async deleteItem(ctx, payload) {
        await firebase.merchCollection.doc(payload).delete();
        ctx.commit('deleteMerch', payload);
    },

    clearError(ctx) {
        ctx.commit('setError', null);
    }
}