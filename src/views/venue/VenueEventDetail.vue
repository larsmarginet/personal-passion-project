<template>
    <v-container>
        <h2 hidden>Event detail</h2>
        <v-row>
            <v-col cols="6" md="1" order-md="1">
                <BackButton link="/venue/events"/>
            </v-col>
            <v-col cols="6" md="2" order-md="3">
                <v-row justify="end" justify-md="start" class="px-4">
                    <v-btn :disabled="save" depressed color="primary" @click="submit">save</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" md="8" order-md="1">
                <v-card flat class="mx-auto mt-2 mb-10" rounded="xl">
                    <v-form ref="form" class="px-4 pt-2 px-md-5 pt-md-3 pb-5">
                        <v-row justify="start">
                            <v-col style="maxWidth: 290px; minWidth: 290px" class="pl-4 pr-0">
                                <p class="subtitle-2 mb-0 grey--text text--darken-2">Date</p>
                                <v-date-picker v-model="selectedDate" color="primary"></v-date-picker>
                            </v-col>
                            <v-col style="maxWidth: 200px; minWidth:200px" class="ml-4">
                                <p class="subtitle-2 mb-0 grey--text text--darken-2">Time</p>
                                <v-menu ref="menuStartTime" v-model="menuStartTime" :close-on-content-click="false" :nudge-right="40" :return-value.sync="selectedStartTime" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="selectedStartTime" label="Starting hour" prepend-icon="schedule" readonly v-bind="attrs" v-on="on"></v-text-field>
                                    </template>
                                    <v-time-picker v-if="menuStartTime" v-model="selectedStartTime" format="24hr" full-width @click:minute="$refs.menuStartTime.save(selectedStartTime)"></v-time-picker>
                                </v-menu>
                                <v-menu ref="menuEndTime" v-model="menuEndTime" :close-on-content-click="false" :nudge-right="40" :return-value.sync="selectedEndTime" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="selectedEndTime" label="Finishing hour" prepend-icon="schedule" readonly v-bind="attrs" v-on="on"></v-text-field>
                                    </template>
                                    <v-time-picker v-if="menuEndTime" v-model="selectedEndTime" format="24hr" full-width @click:minute="$refs.menuEndTime.save(selectedEndTime)"></v-time-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-autocomplete v-model="selectedRoom" :items="rooms" filled chips solo label="Room" item-text="room" item-value="room">
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
                        <v-autocomplete v-model="selectedBand" :items="bands" filled chips solo label="Band" item-text="data" item-value="data">
                            <template v-slot:selection="data">
                                <v-chip v-bind="data.attrs" :input-value="data.selected" close @click="data.select" @click:close="remove('band')" >
                                    <v-avatar left>
                                        <img :src="data.item.logoUrl" :alt="data.item.name"/>
                                    </v-avatar>
                                    {{ data.item.name }}
                                </v-chip>
                            </template>
                            <template v-slot:item="data">
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
import BackButton from '../../components/shared/BackButton'
export default {
    components: {
        BackButton
    },
    props: {
        id: {
            required: false,
            type: String
        }
    },
    data() {
        return {
            save: true,
            selectedRoom: {},
            selectedBand: {},
            selectedDate: '',
            selectedStartTime: '',
            selectedEndTime: '',
            menuStartTime: false,
            menuEndTime: false,
            rooms: [
                {id: 1, name: 'room 1'},
                {id: 2, name: 'room 2'},
                {id: 3, name: 'room 3'}
            ],
        }
    }, 
    computed: {
        bands() {
            console.log(this.$store.getters['bands/bands'])
            return this.$store.getters['bands/bands'];
        }
    },
    methods: {
        remove(val) {
            switch (val) {
                case 'room':
                    this.selectedRoom = {}
                    break;
                case 'band':
                    this.selectedBand = {}
                    break;
            }
        },
        submit() {
            console.log(this.selectedBand.name)
            console.log(this.selectedRoom.name)
            console.log(this.selectedDate)
            console.log(this.selectedStartTime)
        }
    },
    mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        this.$store.dispatch('bands/loadBands');
    }
}
</script>