<template>
    <section>
        <h2 style="visibility: hidden; fontSize: 0">Events</h2>
        <v-row>
            <v-col cols="12" md="3" order-md="2" offset-md="12">
                <v-row justify="end" justify-md="start" class="px-4">
                    <v-btn aria-label="add event" href="/venue/events/create" depressed color="primary">Add event</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" md="9" lg="6" order-md="1">
                <v-expand-transition>
                    <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
                </v-expand-transition>
                <v-row class="px-4 pb-4">
                    <v-btn aria-label="live" text :class="{'primary--text': filter === 'live'}" @click="setFilter('live')">Live</v-btn>
                    <v-btn aria-label="upcoming" text :class="{'primary--text': filter === 'upcoming'}" @click="setFilter('upcoming')">Upcoming</v-btn>
                    <v-btn aria-label="previous" text :class="{'primary--text': filter === 'previous'}" @click="setFilter('previous')">Previous</v-btn>
                </v-row>
                <v-container v-if="loading">
                    <v-skeleton-loader type="list-item-avatar-three-line" class="mb-4" v-for="n in 3" :key="n"></v-skeleton-loader>
                </v-container>
                <v-container class="pa-0" v-else-if="!loading && events">
                    <div is="transition-group" name="list">
                        <EventCard v-for="event in filteredEvents" :event="event" :key="event.id" :image="event.bandLogo" :name="event.bandName" type="venue"/>
                    </div>
                </v-container>
            </v-col>
        </v-row>
    </section>
</template>

<script>
import EventCard from '../../components/shared/EventCard';
import Alert from '../../components/shared/Alert';
export default {
    components: {
        EventCard,
        Alert
    },
    data() {
        return {
            currentTime: (new Date()).getTime(),
            filter: 'live'
        }
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
        filteredEvents() {
            if (this.filter === 'live') {
                return this.events.filter(event => this.currentTime >= event.start && this.currentTime <= event.end);
            } else if (this.filter === 'upcoming') {
                return this.events.filter(event => this.currentTime < event.start);
            } else if (this.filter === 'previous') {
                return this.events.filter(event => this.currentTime > event.end);
            } else {
                return this.events;
            }
        }
    },
    methods: {
        onDismissed() {
            this.$store.dispatch('events/clearError');
        },
        setFilter(val) {
            this.filter !== val ? this.filter = val : this.filter = '';
        }
    },
    mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        this.$store.dispatch('events/loadEventsForVenue');
    }
}
</script>

<style scoped>
.list-enter {
    opacity: 0;
    transform: translateY(-15px);
}

.list-enter-active {
    transition: all 500ms ease-in-out;
}

.list-enter-to {
    opacity: 1;
    transform: translateY(0);
}
</style>