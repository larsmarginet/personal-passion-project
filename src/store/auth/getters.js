export default {
    user(state) {
        return state.userProfile;
    },

    loading(state) {
        return state.loading;
    }, 

    error(state) {
        return state.error;
    }
}