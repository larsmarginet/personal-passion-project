import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
    namespaced: true,
    state: {
        menu: [],
        loading: false,
        loadingItem: false,
        loadingAddItem: false,
        error: null
    },
    mutations,
    actions,
    getters
}