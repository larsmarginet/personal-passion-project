export default {
    setEvents(state, payload) {
        state.events = payload;
    },
    setCurrentEvent(state, payload) {
        state.currentEvent = payload;
    },
    setSetList(state, payload) {
        state.setList = payload;
    },
    setCurrentSong(state, payload) {
        state.currentSong = payload;
    },
    setError(state, payload) {
        state.error = payload;
    },
    setLoadingEvents(state, payload) {
        state.loadingEvents = payload;
    },
    setLoadingEvent(state, payload) {
        state.loadingEvent = payload;
    },
    setLoadingAddEvent(state, payload) {
        state.loadingAddEvent = payload;
    },
};