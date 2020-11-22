import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
    namespaced: true,
    state: {
        rooms: [],
        loading: false,
        error: null
    },
    mutations,
    actions,
    getters
}