<template>
    <v-container>
        <h2 style="visibility: hidden; fontSize: 0">Event detail</h2>
        <v-row>
            <v-col cols="6" lg="1" order-lg="1">
                <BackButton link="/band/events"/>
            </v-col>
            <v-col cols="6" lg="2" order-lg="3">
                <v-row justify="end" justify-lg="start" class="px-4">
                    <v-btn aria-label="save" :disabled="save" depressed color="primary" @click="handleUpdateEvent" :loading="loadingAddEvent">save</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" lg="8" order-lg="1">
                <v-card flat class="mx-auto mb-10" rounded="xl" v-if="loadingEvent">
                    <v-skeleton-loader max-width="290" type="list-item-avatar" class="mb-4"></v-skeleton-loader>
                    <v-skeleton-loader max-width="290" type="image" class="mb-4 mx-4"></v-skeleton-loader>
                    <v-skeleton-loader type="chip" class="mb-4 mx-4"></v-skeleton-loader>
                    <v-skeleton-loader type="chip" class="mb-4 mx-4"></v-skeleton-loader>
                    <v-skeleton-loader max-width="290" type="image" class="mb-4 mx-4"></v-skeleton-loader>
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
                            <v-btn aria-label="add all" small text class="subtitle-2 mb-0 primary--text" @click="handleAddAllMerch">Add all</v-btn>
                        </div>
                        <div class="sheets">
                            <div class="grey lighten-4 rounded-lg sheets-section py-0">
                                <draggable class="list-group" :list="assignedMerchList" group="merch" @change="checkIfUpdated">
                                   <MerchCardMini v-for="(item, i) in listTwo" :key="i" :item="item" class="list-group-item" :disabled="false" @deleteMerch="handleDeleteMerch" @incrementQuantity="handleIncrementQuantity" @decrementQuantity="handleDecrementQuantity" @incrementOptionQuantity="handleIncrementOptionQuantity" @decrementOptionQuantity="handleDecrementOptionQuantity"/>
                                </draggable>
                            </div>
                            <div class="grey lighten-4 rounded-lg sheets-section py-0">
                                <draggable class="list-group" :list="merchList" :group="{ name: 'merch', pull: 'clone', put: false }">
                                    <MerchCardMini v-for="item in listOne" :key="item.id" :item="item" class="list-group-item" :disabled="true"/>
                                </draggable>
                            </div>
                        </div>
                        <v-switch v-model="signing" class="ml-1" label="Signing session" color="primary" hint="Will you be signing merch at this event?" persistent-hint inset @change="checkIfUpdated"></v-switch>
                        <v-row align="center" class="ml-1 mt-2">
                            <v-btn aria-label="decrement" color="primary" depressed @click="decrementSigningAmount" fab small :disabled="!signing"><v-icon small>remove</v-icon></v-btn>
                            <v-text-field class="px-2 text-center" :disabled="!signing" style="maxWidth: 100px" label="Signing amount" type="number" min="0" v-model="signingAmount" :rules="[v => v>=0 || 'amount can not be less than 0']" @input="checkIfUpdated"></v-text-field>
                            <v-btn aria-label="increment" color="primary" depressed @click="incrementSigningAmount" fab small :disabled="!signing"><v-icon small>add</v-icon></v-btn>
                        </v-row>
                        <div class="titles mx-1 mt-8">
                            <p class="subtitle-2 mb-0">Setlist</p>
                            <v-btn aria-label="add all" small text class="subtitle-2 mb-0 primary--text" @click="handleAddAllSongs">Add all</v-btn>
                        </div>
                        <div class="sheets">
                            <div class="grey lighten-4 rounded-lg sheets-section py-0">
                                <draggable class="list-group" :list="setList" group="songs" @change="checkIfUpdated">
                                    <SongCardMini v-for="(song, i) in listFour" :key="i" :song="song" class="list-group-item" :disabled="false" @deleteSong="handleDeleteSong"/>
                                </draggable>
                            </div>
                            <div class="grey lighten-4 rounded-lg sheets-section py-0">
                                <draggable class="list-group" :list="songList" :group="{ name: 'songs', pull: 'clone', put: false }">
                                    <SongCardMini v-for="song in listThree" :key="song.id" :song="song" class="list-group-item" :disabled="true"/>
                                </draggable>
                            </div>
                        </div>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import draggable from "vuedraggable";
import BackButton from '../../components/shared/BackButton';
import MerchCardMini from '../../components/band/MerchCardMini';
import SongCardMini from '../../components/band/SongCardMini';
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
        MerchCardMini,
        SongCardMini
    },
    data() {
        return {
            save: false,
            name: '',
            logo: '',
            signing: false,
            signingAmount: 0,
            merchList: [],
            assignedMerchList: [],
            songList: [],
            setList: [],
            signingRules: []
        }
    },
    computed: {
        listOne() {
            return this.merchList;
        },
        listTwo() {
            return this.assignedMerchList;
        },
        listThree() {
            return this.songList;
        },
        listFour() {
            return this.setList;
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
        checkIfUpdated() {
            if (this.currentEvent && (
                this.signing !== this.currentEvent.signing ||
                this.signingAmount !== this.currentEvent.signingAmount ||
                this.setList !== this.currentEvent.setList ||
                this.assignedMerchList !== this.currentEvent.merch)
            ) {
                this.save = false;
            }
        },
        onDismissed() {
            this.$store.dispatch('rooms/clearError');
        },
        handleAddAllMerch() {
            this.assignedMerchList = [...this.merchList];
            this.checkIfUpdated();
        },
        handleAddAllSongs() {
            this.setList = [...this.songList];
            this.checkIfUpdated();
        },
        handleDeleteMerch(id) {
            const index = this.assignedMerchList.map(merch => merch.id).indexOf(id);
            this.assignedMerchList.splice(index, 1);
            this.checkIfUpdated()
        },
        handleDeleteSong(id) {
            const index = this.setList.map(merch => merch.id).indexOf(id);
            this.setList.splice(index, 1);
            this.checkIfUpdated()
        },
        handleIncrementQuantity(id) {
            const item = this.assignedMerchList.find(merch => merch.id === id);
            item.quantity++;
            this.checkIfUpdated();
        },
        handleDecrementQuantity(id) {
            const item = this.assignedMerchList.find(merch => merch.id === id);
            item.quantity--; 
            this.checkIfUpdated();
        },
        handleIncrementOptionQuantity({id, index}) {
            const item = this.assignedMerchList.find(merch => merch.id === id);
            item.options[index].quantity++;
            item.quantity = 0;
            item.options.forEach(option => item.quantity += option.quantity);
            this.checkIfUpdated();
        },
        handleDecrementOptionQuantity({id, index}) {
            const item = this.assignedMerchList.find(merch => merch.id === id);
            item.options[index].quantity--;
            item.quantity = 0;
            item.options.forEach(option => item.quantity += option.quantity);
            this.checkIfUpdated();
        },
        decrementSigningAmount() {
            if (this.signingAmount > 0) {
                this.signingAmount--;
                this.checkIfUpdated();
            }
        },
        incrementSigningAmount() {
            this.signingAmount++
            this.checkIfUpdated();
        },
        handleUpdateEvent() {
            this.$store.dispatch('events/updateBandEvent', {
                id: this.id, 
                merch: this.assignedMerchList, 
                setList: this.setList,
                signing: this.signing,
                signingAmount: this.signingAmount
            });
        },
    },
    async mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        if (this.id) {
            this.save = true;
            await this.$store.dispatch('events/getBandEventById', this.id);
            const currentEvent = this.$store.getters['events/currentEvent'];
            this.name = currentEvent.venueName;
            this.logo = currentEvent.venueLogo;
            this.signing = currentEvent.signing;
            this.signingAmount = currentEvent.signingAmount;

            await this.$store.dispatch('merch/loadMerch');
            this.merchList = this.$store.getters['merch/merch'];
            this.merchList.forEach(merch => {
                merch.quantity = merch.stock;
                merch.options.forEach(option => {
                    option.quantity = option.stock;
                });
            });
            this.assignedMerchList = currentEvent.merchList;

            await this.$store.dispatch('songs/loadSongs');
            this.songList = this.$store.getters['songs/songs'];
            currentEvent.setList.forEach(songId => {
                this.songList.forEach(song => {
                    if (song.id === songId) {
                        this.setList.push(song);
                    }
                })
            });
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

    .sheets {
        display: grid;
        grid-gap: 5px;
    }

    @media only screen and (max-width: 630px) {
        .sheets {
            grid-template-rows: 1fr 1fr;
        }
    }

    @media only screen and (min-width: 630px) {
        .sheets {
            grid-template-columns: 1fr 1fr;
        }
    }

    .sheets-section {
        padding: 5px;
    }
</style>