import * as firebase from '../../firebase';

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

    clearError(ctx) {
        ctx.commit('setLoading', true);
    }
}