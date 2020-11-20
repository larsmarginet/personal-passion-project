import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export default {
    namespaced: true,
    state: {
        userProfile: {},
        loading: null,
        error: null
    },
    mutations,
    actions,
    getters
}