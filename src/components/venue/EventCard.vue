<template>
    <v-card class="mb-4" rounded="lg" flat>
        <DeleteModal :dialog="dialog" @continue="handleDeleteEvent" @cancel="cancelDeleteEvent"/>
        <v-card-title class="pa-6">
            <v-avatar size="48" :color="`${event.bandLogo ? 'primary' : 'error'}`">
                <img class="rounded-avatar" :src="event.bandLogo" :alt="event.bandName" v-if="event.bandLogo"/>
                <v-icon v-else large dark>error</v-icon>
            </v-avatar>
            <span class="ml-5 headline font-weight-bold">{{event.bandName}}</span>   
            <v-spacer></v-spacer>
            <v-menu offset-y left>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" >
                        <v-icon color="grey--text">more_vert</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item :to="`/venue/events/${event.id}`">
                        <v-icon class="mr-2">create</v-icon>
                        <v-list-item-title>update</v-list-item-title>
                    </v-list-item>
                    <v-list-item link @click="openModal">
                        <v-icon class="mr-2">delete</v-icon>
                        <v-list-item-title>delete</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card-title>
        <v-card-text class="pa-0">
            <v-row no-gutters>
                <v-col style="minWidth: 200px" class="mx-6 my-4 pl-4">
                    <v-row>
                        <p><v-icon :class="`${event.roomBubbles ? 'primary--text' : 'error--text'}`">location_on</v-icon> {{event.roomName}} <span v-if="event.roomBubbles">({{event.roomBubbles}} bubbles)</span></p>
                    </v-row>
                    <v-row justify="start">
                        <p class="mb-0"><v-icon :class="`${event.start ? 'primary--text' : 'error--text'}`">event</v-icon> {{convertStart(event.start, event.end)}}<span class="mx-1">-</span></p>
                        <p>{{convertEnd(event.start, event.end)}}</p>
                    </v-row>
                </v-col>
                <v-col style="minWidth: 200px" class="primary rounded-lg px-6 pt-4 white--text text-right">
                    <p :class="{'font-weight-bold': setList}"><v-icon small class="white--text" v-if="setList">done</v-icon> Setlist</p>
                    <p :class="{'font-weight-bold': setList}"><v-icon class="white--text" small v-if="merch">done</v-icon> Merch</p>
                    <p>Playground</p>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import format from 'date-fns/format';
import DeleteModal from '../shared/DeleteModal';
export default {
    props: {
        event: {
            required: true,
            type: Object
        }
    },
    components: {
        DeleteModal
    },
    data() {
        return {
            timezone: 'Europe/Brussels',
            dialog: false,
        }
    },
    computed: {
        setList() {
            return this.event.setList.length > 0;
        },
        merch() {
            return this.event.merch.length > 0;
        }
    },
    methods: {
        convertStart(start, end) {
            const currentDate = new Date();
            const currentTimeStamp = currentDate.getTime();
            if (format(currentTimeStamp, 'dd/LL') === format(start, 'dd/LL')) {
                // if event is today
                return `Today ${format(start, 'kk:mm')}`;
            } else if (format(currentTimeStamp, 'LL') === format(start, 'LL') && parseFloat(format(currentTimeStamp, 'dd')) + 1 == format(start, 'd')) {
                // if event is one day from now
                return `Tomorrow ${format(start, 'kk:mm')}`;
            } else if (format(currentTimeStamp, 'LL') === format(start, 'LL') && parseFloat(format(currentTimeStamp, 'dd')) - 1 == format(end, 'd')) {
                // if event was one day before now --> calculated on the last day
                return `Yesterday ${format(start, 'kk:mm')}`;
            } else {
                return format(start, 'iii dd/LL kk:mm');
            }
        },
        convertEnd(start, end) {
            if (format(start, 'dd/LL') === format(end, 'dd/LL')) {
                return format(end, 'kk:mm');
            } else {
                return format(end, 'iii dd/LL kk:mm');
            }
        }, 
        openModal() {
            this.dialog = true;
        },
        cancelDeleteEvent() {
            this.dialog = false;
        },
        handleDeleteEvent() {
            this.dialog = false;
            this.$store.dispatch('events/deleteEvent', this.event.id);
        }
    },
}
</script>