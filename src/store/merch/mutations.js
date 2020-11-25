export default {
    setLoading(state, payload) {
        state.loading = payload;
    },
    setLoadingMerch(state, payload) {
        state.loadingMerch = payload
    },
    setLoadingAddMerch(state, payload) {
        state.LoadingAddMerch = payload;
    },
    setError(state, payload) {
        state.error = payload;
    },
    setMerch(state, payload) {
        state.merch = payload;
    },
    setCurrentMerch(state, payload) {
        state.currentMerch = payload;
    },
    deleteMerch(state, payload) {
        // manually update local state because there is no onSnapshot
        if (state.merch.length > 1) {
            const index = state.merch.map(merch => merch.id).indexOf(payload);
            if (index) state.merch.splice(index, 1);
        } else {
            state.merch = [];
        }
    },
    updateQuantityStateMerch(state, payload) {
        // manually update local state because there is no onSnapshot
        const merch = state.merch.find(merch => merch.id == payload.id);
        if (merch) merch.quantity = payload.quantity;
    }
}