export default {
    setLoading(state, payload) {
        state.loading = payload;
    },
    setError(state, payload) {
        state.error = payload;
    },
    setOrders(state, payload) {
        state.orders = payload;
    },
}