export default {
    setEvents(state, payload) {
        state.events = payload;
    },
    setError(state, payload) {
        state.error = payload;
    },
    setLoadingEvents(state, payload) {
        state.loadingEvents = payload
    },
    setLoadingAddEvent(state, payload) {
        state.loadingAddEvent = payload
    },
};