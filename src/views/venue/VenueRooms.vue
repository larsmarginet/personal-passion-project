<template>
    <v-container>
        <h2 hidden>Rooms</h2>
        <v-row>
            <v-col cols="12" md="3" order-md="2" offset-md="12">
                <v-row justify="end" justify-md="start" class="px-4">
                    <v-btn href="/venue/rooms/create" depressed color="primary">Add room</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" md="9" lg="6" order-md="1">
                <v-expand-transition>
                    <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
                </v-expand-transition>
                <v-container v-if="loading">
                    <v-skeleton-loader type="list-item-avatar" class="mb-4" v-for="n in 5" :key="n"></v-skeleton-loader>
                </v-container>
                <v-container class="pa-0" v-else-if="!loading && rooms">
                    <transition-group name="list">
                       <RoomCard v-for="room in rooms" :key="room.id" :room="room" />
                    </transition-group>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Alert from '../../components/shared/Alert';
import RoomCard from '../../components/venue/RoomCard'
export default {
    components: {
        Alert,
        RoomCard
    },
    computed: {
        loading() {
            return this.$store.getters['rooms/loadingMenu'];
        },
        error() {
            return this.$store.getters['rooms/error'];
        },
        rooms() {
            return this.$store.getters['rooms/rooms'];
        },
    },
    methods: {
        onDismissed() {
            this.$store.dispatch('rooms/clearError');
        }
    },
    mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        this.$store.dispatch('rooms/loadRooms');
    }
}
</script>