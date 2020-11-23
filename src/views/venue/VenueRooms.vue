<template>
    <!-- <h2>Rooms page for venues</h2> -->
    <v-btn @click="handleUpdateRoom">update</v-btn>
</template>

<script>
export default {
    methods: {
        handleUpdateRoom() {
            this.$store.dispatch('events/updateEventsWithRoomId')
        }
    },
    mounted() {
        this.$store.dispatch('setLoadingComponent', false)
    }
}
</script>