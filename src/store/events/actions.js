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
                    try {
                        const result = await firebase.usersCollection.doc(event.bandId).get();
                        event.bandLogoUrl = result.data().logoUrl;
                        event.bandName = result.data().name;
                    } catch(error) {
                        event.bandName = 'Band not found';
                    }
                    try {
                        const result = await firebase.roomsCollection.doc(event.roomId).get();
                        event.roomName = result.data().name;
                        event.roomBubbles = result.data().bubbles;
                    } catch(error) {
                        event.roomName = 'Room not found'
                    }
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
                bandId: payload.bandId,
                roomId: payload.roomId,
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

    async deleteEvent(_, payload) {
        await firebase.eventsCollection.doc(payload).delete();
    }

};