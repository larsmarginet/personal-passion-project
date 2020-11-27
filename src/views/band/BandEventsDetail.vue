<template>
    <v-container>
        <h2 hidden>Event detail</h2>
        <v-row>
            <v-col cols="6" lg="1" order-lg="1">
                <BackButton link="/venue/events"/>
            </v-col>
            <v-col cols="6" lg="2" order-lg="3">
                <v-row justify="end" justify-lg="start" class="px-4">
                    <v-btn :disabled="save" depressed color="primary" @click="handleUpdateEvent" :loading="loadingAddEvent">save</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" lg="8" order-lg="1">
                <v-card flat class="mx-auto mb-10" rounded="xl" v-if="loadingEvent">
                    <v-skeleton-loader max-width="290" type="table-heading, date-picker-days" class="mb-4"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item-avatar" class="mb-4"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item-avatar" class="mb-4 pb-5"></v-skeleton-loader>
                </v-card>
                <v-card flat class="mx-auto mb-10" rounded="xl" v-else>
                    <v-expand-transition>
                        <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
                    </v-expand-transition>
                    <v-card-title class="px-6 pt-6 pb-0">
                        <v-avatar size="48" :color="`${logo ? 'white' : 'error'}`">
                            <img class="rounded-avatar" :src="logo" :alt="name" v-if="logo"/>
                            <v-icon v-else large dark>error</v-icon>
                        </v-avatar>
                        <h3 class="ml-5 display-1 font-weight-bold">{{ name }}</h3>
                    </v-card-title>
                    <v-form @submit.prevent ref="form" class="px-4 pt-2 px-md-5 pt-md-3 pb-5">
                        <div class="titles mx-1">
                                <p class="subtitle-2 mb-0">Merch</p>
                                <v-btn small text class="subtitle-2 mb-0 primary--text" @click="handleAddAllMerch">Add all</v-btn>
                        </div>
                        <div class="merch">
                            <div class="grey lighten-4 rounded-lg merch-section py-0">
                                <draggable class="list-group" :list="assignedMerchList" group="merch">
                                   <MerchCardMini v-for="(item, i) in listTwo" :key="i" :item="item" class="list-group-item" :disabled="false" @deleteMerch="handleDeleteMerch" @incrementQuantity="handleIncrementQuantity" @decrementQuantity="handleDecrementQuantity"/>
                                </draggable>
                            </div>
                            <div class="grey lighten-4 rounded-lg merch-section py-0">
                                <draggable class="list-group" :list="merchList" :group="{ name: 'merch', pull: 'clone', put: false }">
                                    <MerchCardMini v-for="item in listOne" :key="item.id" :item="item" class="list-group-item" :disabled="true"/>
                                </draggable>
                            </div>
                        </div>



                        <!-- <v-row justify="center">
                            <v-col cols="12" sm="5" class="grey lighten-4 rounded-lg mx-1">
                                <draggable :list="setList" group="songs">
                                    <v-card v-for="item in setList" :key="item.id" class="list-group-item my-1 mx-1" link>
                                        <v-card-title class="caption">{{item.title}}</v-card-title>
                                    </v-card>
                                </draggable>
                            </v-col>
                            <v-col cols="12" sm="5" class="grey lighten-4 rounded-lg mx-1">
                                <draggable :list="songList" :group="{ name: 'songs', pull: 'clone', put: false }">
                                    <v-card v-for="item in songList" :key="item.id" class="list-group-item my-1 mx-1" link>
                                        <v-card-title class="caption">{{item.title}}</v-card-title>
                                    </v-card>
                                </draggable>
                            </v-col>
                        </v-row> -->
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import draggable from "vuedraggable";
import BackButton from '../../components/shared/BackButton';
import MerchCardMini from '../../components/band/MerchCardMini'
import Alert from '../../components/shared/Alert';
export default {
    props: {
        id: {
            required: true,
            type: String
        }
    },
    components: {
        draggable,
        BackButton,
        Alert,
        MerchCardMini
    },
    data() {
        return {
            save: false,
            name: '',
            logo: '',
            merchList: [],
            assignedMerchList: [],
            songList: [],
            setList: [],
        }
    },
    computed: {
        listOne() {
            return this.merchList;
        },
        listTwo() {
            return this.assignedMerchList;
        },
        loadingEvent() {
            return this.$store.getters['events/loadingEvent'];
        },
        currentEvent() {
            return this.$store.getters['events/currentEvent'];
        },
        loadingAddEvent() {
            return this.$store.getters['events/loadingAddEvent'];
        },
        error() {
            return this.$store.getters['events/error'];
        }
    },
    methods: {
        onDismissed() {
            this.$store.dispatch('rooms/clearError');
        },
        handleAddAllMerch() {
            this.assignedMerchList = [...this.merchList];
        },
        handleDeleteMerch(id) {
            const index = this.assignedMerchList.map(merch => merch.id).indexOf(id);
            this.assignedMerchList.splice(index, 1);
        },
        handleIncrementQuantity(id) {
            const item = this.assignedMerchList.find(merch => merch.id === id);
            item.quantity++;
        },
        handleDecrementQuantity(id) {
            const item = this.assignedMerchList.find(merch => merch.id === id);
            item.quantity--; 
        },
        handleUpdateEvent() {
            this.$store.dispatch('events/updateBandEvent', {id: this.id, merch: this.assignedMerchList})
        },
    },
    async mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        if (this.id) {
            await this.$store.dispatch('events/getEventById', this.id);
            const currentEvent = this.$store.getters['events/currentEvent'];
            this.name = currentEvent.venueName;
            this.logo = currentEvent.venueLogo;

            await this.$store.dispatch('merch/loadMerch');
            this.merchList = this.$store.getters['merch/merch'];

            // add quantity property and set it to stock
            this.merchList.forEach(merch => merch.quantity = merch.stock);
            // fetch all merch once and add the required ones via id to the assigned list
            currentEvent.merch.forEach(item => {
                this.merchList.forEach(merch => {
                    if (merch.id === item.id) {
                        // update the quantity from the assigned list
                        merch.quantity = item.quantity;
                        this.assignedMerchList.push(merch);
                    }
                })
            });

            await this.$store.dispatch('songs/loadSongs');
            this.songList = this.$store.getters['songs/songs'];
        }
    }
}
</script>

<style >
    .list-group {
        min-height: 100%;
        max-height: 400px;
        overflow-y: scroll;
    }

    .titles {
        display: flex;
        justify-content: space-between;
    }

    .merch {
        display: grid;
        grid-gap: 5px;
    }

    @media only screen and (max-width: 630px) {
        .merch {
            grid-template-rows: 1fr 1fr;
        }
    }

    @media only screen and (min-width: 630px) {
        .merch {
            grid-template-columns: 1fr 1fr;
        }
    }

    .merch-section {
        padding: 5px;
    }
</style>