import * as firebase from '../../firebase';
import router from '../../router/index';

export default {
    async loadRooms(ctx) {
        ctx.commit('setLoading', true);
        ctx.commit('setError', null);
        try {
            await firebase.roomsCollection.where("venueId", "==", firebase.auth.currentUser.uid).orderBy('name', 'asc').onSnapshot(snapshot => {
                let rooms = [];
                snapshot.forEach(doc => {
                    let room = doc.data();
                    room.id = doc.id;
                    rooms.push(room);
                })
                ctx.commit('setRooms', rooms);
            })            
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoading', false);
    },

    async addRoom(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingAddRoom', true);
        try {
            await firebase.roomsCollection.add({
                venueId: firebase.auth.currentUser.uid,
                name: payload.name,
                bubbles: payload.bubbles 
            });
            router.push('/venue/rooms');
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingAddRoom', false);
    }, 

    async getRoomById(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingRoom', true);
        try {
            const result = await firebase.roomsCollection.doc(payload).get();  
            let room = result.data();
            room.id = result.id;
            ctx.commit('setCurrentRoom', room);
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingRoom', false);
    },
    
    async updateRoom(ctx, payload) {
        ctx.commit('setError', null);
        ctx.commit('setLoadingAddRoom', true);
        try {
            await firebase.roomsCollection.doc(payload.id).update({
                name: payload.name,
                bubbles: payload.bubbles
            });
            ctx.dispatch('updateEventsWithRoomId', payload);
            router.push('/venue/rooms');
        } catch (error) {
            ctx.commit('setError', error);
        }
        ctx.commit('setLoadingAddRoom', false);
    },

    async updateEventsWithRoomId(ctx, payload) {
        ctx.commit('setError', null);
        try {
            await firebase.db.runTransaction(async transaction => {
                const docs =  await firebase.eventsCollection.where('roomId', '==', payload.id).get();
                docs.forEach(async event => {
                    await transaction.update(firebase.eventsCollection.doc(event.id), {
                        roomName: payload.name, 
                        roomBubbles: payload.bubbles
                    }); 
                });
            });
        } catch (error) {
            ctx.commit('setError', error);
        }
    },

    async deleteRoom(_, payload) {
        await firebase.roomsCollection.doc(payload).delete();
    },

    clearError(ctx) {
        ctx.commit('setError', null);
    }
}