export default {
    setLoading(state, payload) {
        state.loading = payload;
    },
    setLoadingRoom(state, payload) {
        state.loadingRoom = payload;
    },
    setLoadingAddRoom(state, payload) {
        state.loadingAddRoom = payload;
    },
    setError(state, payload) {
        state.error = payload;
    },
    setRooms(state, payload) {
        state.rooms = payload;
    },
    setCurrentRoom(state, payload) {
        state.currentRoom = payload;
    }
}