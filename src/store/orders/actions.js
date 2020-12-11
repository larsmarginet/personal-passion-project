import * as firebase from '../../firebase';

export default {
    async loadOrders (ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoading', true);
        try {
            await firebase.eventsCollection.doc(payload.id).collection(payload.type).orderBy('created', 'desc').onSnapshot(snapshot => {
                const orders = [];
                snapshot.forEach(item => {
                    const order = item.data();
                    order.id = item.id;
                    orders.push(order);
                });
                ctx.commit('setOrders', orders);
            })
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoading', false);
    },

    async updateOrderStatus (ctx, payload) {
        ctx.commit('setError', null);
        try {
            await firebase.eventsCollection.doc(payload.eventId).collection(payload.type).doc(payload.id).update({
                status: payload.status
            });
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoading', false);
    },

    clearOrders(ctx) {
        ctx.commit('setOrders', [])
    }
}