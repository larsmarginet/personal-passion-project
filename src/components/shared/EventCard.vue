<template>
    <article>
        <v-card class="mb-4" rounded="lg" flat>
            <DeleteModal :dialog="dialog" @continue="handleDeleteEvent" @cancel="cancelDeleteEvent"/>
            <v-card-title class="pa-6">
                <v-col cols="11" sm="8" order="1" order-sm="1">
                    <v-row align="center">
                        <v-avatar size="48" :color="`${image ? 'white' : 'error'}`">
                            <img class="rounded-avatar" :src="image" :alt="name" v-if="image" width="48" height="48"/>
                            <v-icon v-else large dark>error</v-icon>
                        </v-avatar>
                        <h3 class="ml-5 headline font-weight-bold">{{ name }}</h3>   
                    </v-row>
                </v-col>
                <v-col cols="12" sm="3" order="3" order-sm="2">
                    <v-btn v-if="live" class="primary" depressed :to="`/${user.type}/orders/${event.id}`" aria-label="orders">orders</v-btn>
                    <v-dialog v-if="previous" v-model="modal" max-width="1080">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn class="primary" depressed v-bind="attrs" v-on="on" aria-label="statistics">Statistics</v-btn>
                        </template>
                        <Stats :id="event.id" :type="type" @closeModal="modal = !modal"/>
                    </v-dialog>
                </v-col>
                <v-col cols="1" order="2" order-sm="3" class="ml-n5 ml-sm-0">
                    <v-menu offset-y left>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on" aria-label="orders">
                                <v-icon color="grey--text">more_vert</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item :to="`/${type}/events/${event.id}`">
                                <v-icon class="mr-2">create</v-icon>
                                <v-list-item-title>update</v-list-item-title>
                            </v-list-item>
                            <v-list-item link @click="openModal">
                                <v-icon class="mr-2">delete</v-icon>
                                <v-list-item-title>delete</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
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
                        <p :class="{'font-weight-bold': merch}"><v-icon class="white--text" small v-if="merch">done</v-icon> Merch</p>
                        <p>Playground</p>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </article>
</template>

<script>
import format from 'date-fns/format';
import DeleteModal from './DeleteModal';
import Stats from './Stats';
export default {
    props: {
        event: {
            required: true,
            type: Object
        },
        name: {
            required: true,
            type: String
        },
        image: {
            required: true,
            type: String
        },
        type: {
            required: true,
            type: String
        }
    },
    components: {
        DeleteModal,
        Stats
    },
    data() {
        return {
            dialog: false,
            modal: false,
            currentTime: (new Date()).getTime()
        }
    },
    computed: {
        setList() {
            return this.event.setList.length > 0;
        },
        merch() {
            return this.event.merch;
        },
        live() {
            return this.currentTime >= this.event.start && this.currentTime <= this.event.end;
        },
        previous() {
            return this.currentTime > this.event.end;
        },
        user() {
            return this.$store.getters['auth/user'];
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
        },
    },
}
</script>