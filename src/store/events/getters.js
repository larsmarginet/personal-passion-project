export default {
    error (state) {
        return state.error;
    },
    setList(state) {
        return state.setList;
    },
    currentSong(state) {
        return state.currentSong;
    },
    loadingEvents (state) {
        return state.loadingEvents;
    },
    loadingEvent (state) {
        return state.loadingEvent;
    },
    loadingAddEvent (state) {
        return state.loadingAddEvent;
    },
    events (state) {
        return state.events;
    },
    currentEvent (state) {
        return state.currentEvent;
    }
};