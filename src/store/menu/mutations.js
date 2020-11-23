export default {
    setLoading(state, payload) {
        state.loading = payload;
    },
    setLoadingItem(state, payload) {
        state.loadingItem = payload
    },
    setLoadingAddItem(state, payload) {
        state.LoadingAddItem = payload;
    },
    setError(state, payload) {
        state.error = payload;
    },
    setMenu(state, payload) {
        state.menu = payload;
    }
}