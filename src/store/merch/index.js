import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
    namespaced: true,
    state: {
        merch: [],
        currentMerch: [],
        loading: false,
        loadingMerch: false,
        LoadingAddMerch: false,
        error: null
    },
    mutations,
    actions,
    getters
}