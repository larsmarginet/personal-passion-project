<template>
     <v-container>
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
                <v-container class="pa-0" v-else-if="!loading && events">
                    <transition-group name="list" mode="out-in">
                        <EventCard v-for="event in filteredEvents" :event="event" :key="event.id" :image="event.venueLogo" :name="event.venueName" type="band"/>
                    </transition-group>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
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
            filter: 'upcoming',
            currentTime: (new Date()).getTime()
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
        }
    },
    mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        this.$store.dispatch('events/loadEventsForBand');
    }
}
</script>

<style>
.list-enter {
    opacity: 0;
    transform: translateY(-30px);
}

.list-enter-active {
    transition: all 500ms ease-out;
}

.list-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.list-leave{
    opacity: 1;
    transform: translateY(0);
}

.list-leave-active {
    transition: all 500ms ease-in;
}

.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>