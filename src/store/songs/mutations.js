export default {
    setLoading(state, payload) {
        state.loading = payload;
    },
    setLoadingSong(state, payload) {
        state.loadingSong = payload
    },
    setLoadingAddSong(state, payload) {
        state.LoadingAddSong = payload;
    },
    setError(state, payload) {
        state.error = payload;
    },
    setSongs(state, payload) {
        state.songs = payload;
    },
    setCurrentSong(state, payload) {
        state.currentSong = payload;
    },
    deleteSong(state, payload) {
        // manually update local state because there is no onSnapshot
        if (state.songs.length > 1) {
            const index = state.songs.map(song => song.id).indexOf(payload);
            if (typeof index == 'number') state.songs.splice(index, 1);
        } else {
            state.songs = [];
        }
    },
}