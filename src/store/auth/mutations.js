export default {
    setUserProfile(state, payload) {
        state.userProfile = payload;
    },

    setLoading(state, payload) {
        state.loading = payload;
    },

    setError(state, payload) {
        state.error = payload.message;
    },

    clearError(state) {
        state.error = null;
    }
}