<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="3" order-md="2" offset-md="12">
                <v-row justify="end" justify-md="start" class="px-4">
                    <v-btn href="/venue/events/create" depressed color="primary">Add event</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" md="9" lg="6" order-md="1">
                <v-expand-transition>
                    <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
                </v-expand-transition>
                <v-container v-if="loading">
                    <v-skeleton-loader type="list-item-avatar-three-line" class="mb-4" v-for="n in 3" :key="n"></v-skeleton-loader>
                </v-container>
                <v-container class="pa-0" v-else>
                    <EventCard v-for="event in events" :event="event" :key="event.id"/>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import EventCard from '../../components/venue/EventCard';
import Alert from '../../components/shared/Alert';
export default {
    components: {
        EventCard,
        Alert
    },
    computed: {
        loading() {
            return this.$store.getters['events/loadingEvents'];
        },
        error() {
            return this.$store.getters['events/error'];
        },
        events() {
            return this.$store.getters['events/events'] ? [...this.$store.getters['events/events']].sort((a,b) => a.start - b.start) : null;
        },
    },
    methods: {
        onDismissed() {
            this.$store.dispatch('events/clearError');
        }
    },
    mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        this.$store.dispatch('events/loadEventsForVenue');
    }
}
</script>

<style scoped>
.rounded-avatar {
    border-radius: 50%;
}
</style>