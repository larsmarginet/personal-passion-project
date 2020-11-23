export default {
    setLoading(state, payload) {
        state.loading = payload;
    },
    setLoadingItem(state, payload) {
        state.loadingItem = payload
    },
    setLoadingAddItem(state, payload) {
        state.LoadingAddItem = payload;
    },
    setError(state, payload) {
        state.error = payload;
    },
    setMenu(state, payload) {
        state.menu = payload;
    },
    deleteMenuItem(state, payload) {
        if (state.menu.length > 1) {
            const index = state.menu.map(item => item.id).indexOf(payload);
            if (index) state.menu.splice(index, 1);
        } else {
            state.menu = [];
        }
    }
}