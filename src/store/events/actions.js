import * as firebase from '../../firebase';
import router from '../../router/index';

export default {
    async loadEventsForVenue(ctx) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingEvents', true);
        try {
            // snapshot only listens to docs that adhere to querry (only the ones of the current user)
            await firebase.eventsCollection.where("venueId", "==", firebase.auth.currentUser.uid).orderBy('start', 'asc').onSnapshot(snapshot => {
                let events = [];
                snapshot.forEach(async doc => {
                    let event = doc.data();
                    event.id = doc.id;
                    events.push(event);
                });
                ctx.commit('setEvents', events);
            });       
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingEvents', false);
    },

    async loadEventsForBand(ctx) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingEvents', true);
        try {
            await firebase.eventsCollection.where("bandId", "==", firebase.auth.currentUser.uid).orderBy('start', 'asc').onSnapshot(snapshot => {
                let events = [];
                snapshot.forEach(async doc => {
                    let event = doc.data();
                    event.id = doc.id;
                    events.push(event);
                });
                ctx.commit('setEvents', events);
            });       
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingEvents', false);
    },

    async addEvent(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingAddEvent', true);
        try {
            await firebase.eventsCollection.add({
                venueId: firebase.auth.currentUser.uid,
                venueName: ctx.rootGetters['auth/user'].name,
                venueLogo: ctx.rootGetters['auth/user'].logoUrl,
                roomId: payload.roomId,
                roomName: payload.roomName,
                roomBubbles: payload.roomBubbles,
                bandId: payload.bandId,
                bandLogo: payload.bandLogo,
                bandName: payload.bandName,
                start: payload.start,
                end: payload.end,
                merch: [],
                setList: [],
                signing: false
            });
            router.push('/venue/events');
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingAddEvent', false);
    },

    async getEventById(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingEvent', true);
        try {
            const result = await firebase.eventsCollection.doc(payload).get();  
            let event = result.data();
            event.id = result.id;
            ctx.commit('setCurrentEvent', event);
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingEvent', false);
    },

    async updateVenueEvent(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingAddEvent', true);
        try {
            await firebase.eventsCollection.doc(payload.id).update({
                roomId: payload.roomId,
                roomName: payload.roomName,
                roomBubbles: payload.roomBubbles,
                bandId: payload.bandId,
                bandLogo: payload.bandLogo,
                bandName: payload.bandName,
                start: payload.start,
                end: payload.end,
            });
            router.push('/venue/events');
        } catch(error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingAddEvent', false);
    },

    async updateBandEvent(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingAddEvent', true);
        try {
            const merchList = []
            payload.merch.map(merch => {
                merchList.push({id: merch.id, quantity: merch.quantity})
            });
            await firebase.eventsCollection.doc(payload.id).update({
                merch: merchList
            });
            router.push('/band/events');
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingAddEvent', false);
    },
    
    async deleteEvent(_, payload) {
        await firebase.eventsCollection.doc(payload).delete();
    },
    
    clearError(ctx) {
        ctx.commit('setError', null);
    },
};