export default {
    setLoading(state, payload) {
        state.loading = payload;
    },
    setError(state, payload) {
        state.error = payload;
    },
    setRooms(state, payload) {
        state.rooms = payload;
    }
}