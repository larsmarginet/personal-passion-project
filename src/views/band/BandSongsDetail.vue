<template>
    <v-container>
        <h2 style="display: none">Songs detail</h2>
        <v-row>
            <v-col cols="6" md="1" order-md="1">
                <BackButton link="/band/songs"/>
            </v-col>
            <v-col cols="6" sm="2" order-md="3">
                <v-row justify="end" justify-md="start" class="px-4">
                    <v-btn :disabled="save" depressed color="primary" @click="handleAddSong" :loading="loadingAddSong">save</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" sm="8" md="6" lg="4" order-md="1">
                <v-card flat class="mx-auto mb-10" rounded="xl" v-if="loadingSong">
                    <v-skeleton-loader type="list-item" class="mb-4 pt-5"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item-avatar" style="maxWidth: 300px" class="mb-4"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item-avatar" style="maxWidth: 300px" class="mb-4"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item-avatar" style="maxWidth: 300px" class="mb-4"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item-avatar" style="maxWidth: 300px" class="mb-4"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item-avatar" style="maxWidth: 300px" class="mb-4 pb-5"></v-skeleton-loader>
                </v-card>
                <v-card flat class="mx-auto mb-10" rounded="xl" width="100%" v-else>
                    <v-expand-transition>
                        <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
                    </v-expand-transition>
                    <v-form @submit.prevent ref="form" class="px-4 pt-2 px-md-5 pt-md-3 pb-5">
                        <v-text-field validate-on-blur class="mx-2" style="maxWidth: 350px" v-model="title" label="Title" :rules="titleRules" clearable @input="checkIfUpdated"></v-text-field>
                        <v-row align="center" class="mx-2">
                            <v-img class="mr-2" src="@/assets/itunes.svg" alt="itunes logo" max-width="35" height="35"></v-img>
                            <v-text-field validate-on-blur type="url" label="Apple Music" v-model="itunes" :rules="linkRules" style="maxWidth: 300px" @input="checkIfUpdated" clearable></v-text-field>
                        </v-row>
                        <v-row align="center" class="mx-2">
                            <v-img class="mr-2" src="@/assets/spotify.svg" alt="spotify logo" max-width="35" height="35"></v-img>
                            <v-text-field validate-on-blur type="url" label="Spotify" v-model="spotify" :rules="linkRules" style="maxWidth: 300px" @input="checkIfUpdated" clearable></v-text-field>
                        </v-row>
                        <v-row align="center" class="mx-2">
                            <v-img class="mr-2" src="@/assets/youtube.svg" alt="youtube logo" max-width="35" height="35"></v-img>
                            <v-text-field validate-on-blur type="url" label="YouTube" v-model="youtube" :rules="linkRules" style="maxWidth: 300px" @input="checkIfUpdated" clearable></v-text-field>
                        </v-row>
                        <v-row align="center" class="mx-2">
                            <v-img class="mr-2" src="@/assets/soundcloud.svg" alt="soundcloud logo" max-width="35" height="35"></v-img>
                            <v-text-field validate-on-blur type="url" label="Soundcloud" v-model="soundcloud" :rules="linkRules" style="maxWidth: 300px" @input="checkIfUpdated" clearable></v-text-field>
                        </v-row>
                        <v-row align="center" class="mx-2">
                            <v-img class="mr-2" src="@/assets/shop.svg" alt="shop icon" max-width="35" height="35"></v-img>
                            <v-text-field validate-on-blur type="url" label="Webshop" v-model="shop" :rules="linkRules" style="maxWidth: 300px" @input="checkIfUpdated" clearable></v-text-field>
                        </v-row>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { titleRules, linkRules } from '../../helpers/validationRules';
import BackButton from '../../components/shared/BackButton';
import Alert from '../../components/shared/Alert';
export default {
    components: {
        BackButton,
        Alert,
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
            title: '',
            itunes: '',
            spotify: '',
            youtube: '',
            soundcloud: '',
            shop: '',
            titleRules,
            linkRules
        }
    },
    computed: {
        currentSong() {
            return this.$store.getters['songs/currentSong'];
        },
        loadingSong() {
            return this.$store.getters['songs/loadingSong'];
        },
        loadingAddSong() {
            return this.$store.getters['songs/LoadingAddSong'];
        },
        error() {
            return this.$store.getters['songs/error'];
        }
    },
    methods: {
        onDismissed() {
            this.$store.dispatch('songs/clearError');
        },
        checkIfUpdated() {
            if (this.id && this.currentSong && (
                this.title !== this.currentSong.title ||
                this.itunes !== this.currentSong.itunes ||
                this.spotify !== this.currentSong.spotify ||
                this.youtube !== this.currentSong.youtube ||
                this.shop !== this.currentSong.shop ||
                this.soundcloud !== this.currentSong.soundcloud)) {
                this.save = false;
            }
        },
        handleAddSong() {
            if (this.$refs.form.validate()) {
                const songObj = {
                    title: this.title,
                    itunes: this.itunes,
                    spotify: this.spotify,
                    youtube: this.youtube,
                    soundcloud: this.soundcloud,
                    shop: this.shop,
                }; 
                if (this.id) {
                    this.$store.dispatch('songs/updateSong', {
                        id: this.id,
                        ...songObj
                    });
                } else {
                    this.$store.dispatch('songs/addSong', songObj);
                }
            }
        }
    },
    async mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        if (this.id) {
            this.save = true;
            await this.$store.dispatch('songs/getSongById', this.id);
            const currentSong = this.$store.getters['songs/currentSong'];
            this.title = currentSong.title;
            this.itunes = currentSong.itunes;
            this.spotify = currentSong.spotify;
            this.youtube = currentSong.youtube;
            this.soundcloud = currentSong.soundcloud;
            this.shop = currentSong.shop;
        }
    }
}
</script>