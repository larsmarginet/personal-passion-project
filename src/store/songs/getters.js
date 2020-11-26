export default {
    songs(state) {
        return state.songs;
    },
    currentSong(state) {
        return state.currentSong;
    },
    loading(state) {
        return state.loading;
    },
    loadingSong(state) {
        return state.loadingSong;
    },
    LoadingAddSong(state) {
        return state.LoadingAddSong;
    },
    error(state) {
        return state.error;
    },
}