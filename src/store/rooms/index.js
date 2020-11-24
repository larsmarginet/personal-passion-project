import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
    namespaced: true,
    state: {
        rooms: [],
        currentRoom: null,
        loading: false,
        loadingRoom: false,
        loadingAddRoom: false,
        error: null
    },
    mutations,
    actions,
    getters
}