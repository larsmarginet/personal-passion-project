<template>
    <v-container>
        <h2 hidden>Event detail</h2>
        <v-row>
            <v-col cols="6" md="1" order-md="1">
                <BackButton link="/venue/events"/>
            </v-col>
            <v-col cols="6" md="2" order-md="3">
                <v-row justify="end" justify-md="start" class="px-4">
                    <v-btn :disabled="save" depressed color="primary" @click="handleAddEvent" :loading="loadingAddEvent">save</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" md="8" order-md="1">
                <v-card flat class="mx-auto mb-10" rounded="xl">
                    <v-expand-transition>
                        <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
                    </v-expand-transition>
                    <v-form @submit.prevent ref="form" class="px-4 pt-2 px-md-5 pt-md-3 pb-5">
                        <v-row justify="start">
                            <v-col style="maxWidth: 290px; minWidth: 290px" class="pl-4 pr-0">
                                <p class="subtitle-2 mb-0 grey--text text--darken-2">
                                    Date
                                    <v-scroll-y-transition>
                                        <span class="error--text caption" v-if="datesError">{{datesError}}</span>
                                    </v-scroll-y-transition> 
                                </p>
                                <v-date-picker v-model="selectedDates" @input="validateDatePicker(selectedDates); checkIfUpdated();" range color="primary"></v-date-picker>
                            </v-col>
                            <v-col style="maxWidth: 200px; minWidth:200px" class="ml-4">
                                <p class="subtitle-2 mb-0 grey--text text--darken-2">Time</p>
                                <v-menu ref="menuStartTime" v-model="menuStartTime" :close-on-content-click="false" :nudge-right="40" :return-value.sync="selectedStartTime" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="selectedStartTime" @change="checkIfUpdated" label="Starting hour" prepend-icon="schedule" readonly v-bind="attrs" v-on="on" :rules="startTimeRules"></v-text-field>
                                    </template>
                                    <v-time-picker v-if="menuStartTime" v-model="selectedStartTime" format="24hr" full-width @click:minute="$refs.menuStartTime.save(selectedStartTime)"></v-time-picker>
                                </v-menu>
                                <v-menu ref="menuEndTime" v-model="menuEndTime" :close-on-content-click="false" :nudge-right="40" :return-value.sync="selectedEndTime" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="selectedEndTime" @change="checkIfUpdated" label="Finishing hour" prepend-icon="schedule" readonly v-bind="attrs" v-on="on" :rules="endTimeRules"></v-text-field>
                                    </template>
                                    <v-time-picker v-if="menuEndTime" v-model="selectedEndTime" format="24hr" full-width @click:minute="$refs.menuEndTime.save(selectedEndTime)"></v-time-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-autocomplete v-model="selectedRoom" :items="rooms" filled chips solo label="Room" item-text="name" item-value="id" :rules="roomRules" :loading="loadingRooms" @change="checkIfUpdated">
                             <template v-slot:selection="data">
                                <v-chip v-bind="data.attrs" :input-value="data.selected" close @click="data.select" @click:close="remove('room')" >
                                    {{ data.item.name }}
                                </v-chip>
                            </template>
                             <template v-slot:item="room">
                                <v-list-item-content>
                                    <v-list-item-title v-html="room.item.name"></v-list-item-title>
                                </v-list-item-content>
                            </template>
                        </v-autocomplete>
                        <v-autocomplete v-model="selectedBand" :items="bands" filled chips solo label="Band" item-text="name" item-value="id" :rules="bandRules" :loading="loadingBands" @change="checkIfUpdated">
                            <template v-slot:selection="data">
                                <v-chip v-bind="data.attrs" :input-value="data.selected" close @click="data.select" @click:close="remove('band')" >
                                    <v-avatar left>
                                        <img :src="data.item.logoUrl" :alt="data.item.name"/>
                                    </v-avatar>
                                    {{ data.item.name }}
                                </v-chip>
                            </template>
                            <template v-slot:item="data" >
                                <v-list-item-avatar>
                                    <img :src="data.item.logoUrl" :alt="data.item.name">
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                </v-list-item-content>
                            </template>
                        </v-autocomplete>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { format, parseISO } from 'date-fns';
import BackButton from '../../components/shared/BackButton';
import Alert from '../../components/shared/Alert';
export default {
    components: {
        BackButton,
        Alert
    },
    props: {
        id: {
            required: false,
            type: String
        }
    },
    data() {
        return {
            save: false,
            currentDate: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
            selectedDates: [],
            selectedStartTime: '',
            selectedEndTime: '',
            selectedRoom: '',
            selectedBand: '',
            menuStartTime: false,
            menuEndTime: false,
            datesError: null,
            startTimeRules: [
                v => !!v || 'Start time is required',
            ],
            endTimeRules: [
                v => !!v || 'End time is required',
                v => {
                    if (this.selectedDates.length > 0) {
                        if (this.selectedDates.length === 1 && this.selectedStartTime > v) {
                            return 'Start time can not be greater than end time';
                        } else if (this.selectedDates.length === 2 && this.selectedDates[0] === this.selectedDates[1] && this.selectedStartTime > v) {
                            return 'Start time can not be greater than end time';
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                } 
            ],
            roomRules: [
                v => !!v && typeof v === 'string' || 'Please pick a room',
            ],
            bandRules: [
                v => !!v && typeof v === 'string' || 'Please pick a band',
            ],
        }
    }, 
    computed: {
        currentEvent() {
            return this.$store.getters['events/currentEvent'];
        },
        loadingBands() {
            return this.$store.getters['bands/loading'];
        },
        bands() {
            return this.$store.getters['bands/bands'];
        },
        loadingRooms() {
            return this.$store.getters['rooms/loading'];
        },
        rooms() {
            return this.$store.getters['rooms/rooms'];
        },
        dates() {
            // make copy of original selectedDates
            return [...this.selectedDates].sort();
        },
        start() {
            const date = new Date(`${this.selectedDates[0]}T${this.selectedStartTime}:00+0000`);
            return date.getTime() - 3600000;
        },
        end() {
            let date;
            if (this.selectedDates.length === 1) {
                date = new Date(`${this.selectedDates[0]}T${this.selectedEndTime}:00+0000`);
            } else if (this.selectedDates.length === 2) {
                date = new Date(`${this.selectedDates[1]}T${this.selectedEndTime}:00+0000`);
            }
            return date.getTime() - 3600000;
        },
        loadingAddEvent() {
            return this.$store.getters['events/loadingAddEvent'];
        },
        error() {
            return this.$store.getters['events/error'];
        }
    },
    methods: {
        checkIfUpdated() {
            if (this.id && this.currentEvent && (
                this.selectedDates !== [format(this.currentEvent.start, 'RRRR-LL-dd'), format(this.currentEvent.end, 'RRRR-LL-dd')] ||
                this.selectedStartTime !== format(this.currentEvent.start, 'HH:mm') ||
                this.selectedEndTime !== format(this.currentEvent.end, 'HH:mm') ||
                this.selectedRoom !== this.currentEvent.roomId ||
                this.selectedBand !== this.currentEvent.bandId )) {
                this.save = false;
            }
        },
        remove(val) {
            switch (val) {
                case 'room':
                    this.selectedRoom = {};
                    break;
                case 'band':
                    this.selectedBand = {};
                    break;
            }
        },
        // date picker isn't a form element, so it has no validation built in 
        validateDatePicker(date) {
            this.datesError = null;
            if (date.length <= 0) {
                this.datesError = 'Date is required';
                return false;
            } else if (date && date.length === 1) {
                if (date[0] < this.currentDate) {
                    this.datesError = 'Date must be from today and up';
                    return false;
                }
            } else if (date && date.length === 2) {
                if (date[0] < this.currentDate || date[1] < this.currentDate ) {
                    this.datesError = 'Dates must be from today and up';
                    return false;
                }
            } 
            return true;
        },
        handleAddEvent() {
            // execute validate func, because when this.$refs.form.validate() 
            // is false second condition won't be executed
            const datesAreValid = this.validateDatePicker(this.selectedDates);
            if (this.$refs.form.validate() && datesAreValid) {
                if (this.id) {
                    this.$store.dispatch('events/updateVenueEvent', {
                        id: this.id,
                        roomId: this.selectedRoom,
                        bandId: this.selectedBand,
                        start: this.start,
                        end: this.end,
                    })
                } else {
                    this.$store.dispatch('events/addEvent', {
                        roomId: this.selectedRoom,
                        bandId: this.selectedBand,
                        start: this.start,
                        end: this.end,
                    });
                }
            }
        },
        onDismissed() {
            this.$store.dispatch('events/clearError');
        }
    },
    async mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        this.$store.dispatch('rooms/loadRooms');
        this.$store.dispatch('bands/loadBands');
        if (this.id) {
            this.save = true;
            await this.$store.dispatch('events/getEventById', this.id);
            const currentEvent = this.$store.getters['events/currentEvent'];
            this.selectedDates = [format(currentEvent.start, 'RRRR-LL-dd'), format(currentEvent.end, 'RRRR-LL-dd')];
            this.selectedStartTime = format(currentEvent.start, 'HH:mm');
            this.selectedEndTime = format(currentEvent.end, 'HH:mm');
            this.selectedRoom = currentEvent.roomId;
            this.selectedBand = currentEvent.bandId;
        } 
    }
}
</script>