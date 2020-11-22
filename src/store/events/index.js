import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export default {
    namespaced: true,
    state: {
        error: null,
        events: [],
        loadingEvents: false,
        loadingAddEvent: false
    },
    mutations,
    actions,
    getters
}