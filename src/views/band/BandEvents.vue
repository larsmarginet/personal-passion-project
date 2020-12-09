<template>
    <section>
        <h2 style="display: none">Event detail</h2>
        <v-row>
            <v-col cols="12" md="9" lg="6">
                <v-expand-transition>
                    <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
                </v-expand-transition>
                <v-row class="px-4 pb-4">
                    <v-btn text :class="{'primary--text': filter === 'live'}" @click="setFilter('live')">Live</v-btn>
                    <v-btn text :class="{'primary--text': filter === 'upcoming'}" @click="setFilter('upcoming')">Upcoming</v-btn>
                    <v-btn text :class="{'primary--text': filter === 'previous'}" @click="setFilter('previous')">Previous</v-btn>
                </v-row>
                <v-container v-if="loading">
                    <v-skeleton-loader type="list-item-avatar-three-line" class="mb-4" v-for="n in 3" :key="n"></v-skeleton-loader>
                </v-container>
                <div class="pa-0" v-else-if="!loading && events">
                    <div is="transition-group" name="list">
                        <EventCard v-for="(event) in filteredEvents" :event="event" :key="event.id" :image="event.venueLogo" :name="event.venueName" type="band"/> 
                    </div>
                </div>
            </v-col>
        </v-row>
    </section>
</template>

<script>
import Alert from '../../components/shared/Alert';
import EventCard from '../../components/shared/EventCard';
export default {
     components: {
        Alert,
        EventCard
    },
    data() {
        return {
            currentTime: (new Date()).getTime(),
            filter: 'live',
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
        setFilter(val) {
            this.filter !== val ? this.filter = val : this.filter = '';
        },
        onDismissed() {
            this.$store.dispatch('events/clearError');
        },
    },
    mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        this.$store.dispatch('events/loadEventsForBand');
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