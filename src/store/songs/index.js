import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
    namespaced: true,
    state: {
        songs: [],
        currentSong: [],
        loading: false,
        loadingSong: false,
        LoadingAddSong: false,
        error: null
    },
    mutations,
    actions,
    getters
}