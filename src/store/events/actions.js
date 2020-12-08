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
                facebook: payload.facebook,
                instagram: payload.instagram,
                itunes: payload.itunes,
                spotify: payload.spotify,
                youtube: payload.youtube,
                start: payload.start,
                end: payload.end,
                merch: false,
                setList: [],
                signing: false,
                signingAmount: 0,
                signedAmount: 0,
                currentSong: null
            });
            router.push('/venue/events');
        } catch (error) {
            console.error(error)
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingAddEvent', false);
    },

    async getVenueEventById(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingEvent', true);
        try {
            const result = await firebase.eventsCollection.doc(payload).get();  
            let event = result.data();
            event.id = result.id;
            const setList = [];
            await Promise.all(event.setList.map(async id => { 
               const song = await firebase.songCollection.doc(id).get()
               setList.push(song.data())
            }));
            event.setList = setList;
            ctx.commit('setCurrentEvent', event);
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingEvent', false);
    },

    async getBandEventById(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingEvent', true);
        try {
            const result = await firebase.eventsCollection.doc(payload).get();  
            let event = result.data();
            event.id = result.id;
            const merchList = [];
            const merch = await firebase.eventsCollection.doc(payload).collection('merch').get();
            if (!merch.empty) {
                merch.forEach(item => merchList.push(item.data()));
            }
            event.merchList = merchList;
            ctx.commit('setCurrentEvent', event);
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingEvent', false);
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
                facebook: payload.facebook,
                instagram: payload.instagram,
                itunes: payload.itunes,
                spotify: payload.spotify,
                youtube: payload.youtube,
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
            const setList = [];
            payload.setList.map(song => setList.push(song.id));
            await firebase.eventsCollection.doc(payload.id).update({
                setList,
                merch: payload.merch.length > 0 ? true : false,
                signing: payload.signing,
                signingAmount: payload.signingAmount
            });
            await firebase.db.runTransaction(async transaction => {
                const currentMerch = await firebase.eventsCollection.doc(payload.id).collection('merch').get();
                if (!currentMerch.empty) {
                    currentMerch.forEach(async merch => await transaction.delete(firebase.eventsCollection.doc(payload.id).collection('merch').doc(merch.id)));
                }
                payload.merch.map(async merch => {
                    await transaction.set(firebase.eventsCollection.doc(payload.id).collection('merch').doc(merch.id), merch)
                    const result = await firebase.merchCollection.doc(merch.id).collection('images').get();
                    result.forEach(async img => await firebase.eventsCollection.doc(payload.id).collection('merch').doc(merch.id).collection('images').doc(img.id).set(img.data()));
                });
            });
            router.push('/band/events');
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingAddEvent', false);
    },

    async loadSeltList(ctx, payload) {
        ctx.commit('setError', null);
        try {
            const result = await firebase.eventsCollection.doc(payload).get();  
            const event = result.data();
            const setList = [];
            await Promise.all(event.setList.map(async id => { 
               const song = await firebase.songCollection.doc(id).get();
               setList.push({id: song.id, ...song.data()})
            }));
            ctx.commit('setSetList', setList);
        } catch (error) {
            ctx.commit('setError', error);
        }
    },

    async loadCurrentSong(ctx, payload) {
        ctx.commit('setError', null);
        try {
            await firebase.eventsCollection.doc(payload).onSnapshot(snapshot => {
                const event = snapshot.data();
                ctx.commit('setCurrentSong', event.currentSong);
            });  
        } catch (error) {
            ctx.commit('setError', error);
        }
    },

    async setCurrentSong(ctx, payload) {
        ctx.commit('setError', null);
        try {
            await firebase.eventsCollection.doc(payload.id).update({
                currentSong: payload.song,
            });  
        } catch (error) {
            ctx.commit('setError', error);
        }
    },
    
    async deleteEvent(_, payload) {
        await firebase.eventsCollection.doc(payload).delete();
    },
    
    clearError(ctx) {
        ctx.commit('setError', null);
    },
};