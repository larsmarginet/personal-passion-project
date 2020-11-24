export default {
    rooms(state) {
        return state.rooms;
    },
    currentRoom(state) {
        return state.currentRoom;
    },
    loading(state) {
        return state.loading;
    },
    loadingRoom(state) {
        return state.loadingRoom;
    },
    loadingAddRoom(state) {
        return state.loadingAddRoom;
    },
    error(state) {
        return state.error;
    },
}