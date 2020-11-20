export default {
    setLoading(state, payload) {
        state.loading = payload;
    },
    setError(state, payload) {
        state.error = payload;
    },
    setBands(state, payload) {
        state.bands = payload;
    }
}