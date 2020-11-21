import * as firebase from '../../firebase';

export default {
    async setEvent(ctx, payload) {
        ctx.commit('setError', null);
        try {
            await firebase.eventsCollection.add({
                venueId: firebase.auth.currentUser.uid,
                bandId: payload.bandId,
                roomId: payload.roomId,
                start: payload.start,
                end: payload.end,
                merch: [],
                setList: [],
                signing: false
            });
        } catch (error) {
            ctx.commit('setError', error);
        }
    }
};