import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
    namespaced: true,
    state: {
        menu: [],
        currentItem: [],
        loading: false,
        loadingItem: false,
        LoadingAddItem: false,
        error: null
    },
    mutations,
    actions,
    getters
}