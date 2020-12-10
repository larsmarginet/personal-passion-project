<template>
    <article>
        <v-card class="px-3 mb-4" rounded="lg" flat>
            <DeleteModal :dialog="dialog" @continue="handleDeleteSong" @cancel="cancelDeleteSong"/>
            <v-row justify="start" align="center" style="lineHeight: 0">
                <v-col cols="11" sm="4" order="2" order-sm="1">
                    <h3 class="subtitle-1 font-weight-bold line-height">{{song.title}}</h3>
                </v-col>
                <v-col cols="12" sm="7" order="3" order-sm="2">
                    <v-row justify="center" justify-sm="start">
                        <a :href="song.itunes" target="_blank" :class="{'transparant' : !song.itunes}" class="mr-2"><span class="assitive-text">Apple Music</span><v-img src="@/assets/itunes.svg" width="32" alt="apple music logo"></v-img></a>
                        <a :href="song.spotify" target="_blank" :class="{'transparant' : !song.spotify}" class="mr-2"><span class="assitive-text">Spotify</span><v-img src="@/assets/spotify.svg" width="32" alt="spotify logo"></v-img></a>
                        <a :href="song.youtube" target="_blank" :class="{'transparant' : !song.youtube}" class="mr-2"><span class="assitive-text">Youtube</span><v-img src="@/assets/youtube.svg" width="32" alt="youtube logo"></v-img></a>
                        <a :href="song.soundcloud" target="_blank" :class="{'transparant' : !song.soundcloud}" class="mr-2"><span class="assitive-text">SoundCloud</span><v-img src="@/assets/soundcloud.svg" width="32" alt="soundcloud logo"></v-img></a>
                        <a :href="song.shop" target="_blank" :class="{'transparant' : !song.shop}" class="mr-2"><span class="assitive-text">Shop</span><v-img src="@/assets/shop.svg" width="32" alt="webshop icon"></v-img></a>
                    </v-row>
                </v-col>
                <v-col cols="1" order="2" order-sm="3" class="pa-0">
                    <v-menu offset-y left>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on" aria-label="menu">
                                <v-icon color="grey--text">more_vert</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item :to="`/band/songs/${song.id}`">
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
            </v-row>
        </v-card>
    </article>
</template>

<script>
import DeleteModal from '../shared/DeleteModal';
export default {
    props: {
        song: {
            required: true,
            type: Object
        }
    },
    components: {
        DeleteModal
    },
    data() {
        return {
            dialog: false
        }
    },
    methods: {
        openModal() {
            this.dialog = true;
        },
        cancelDeleteSong() {
            this.dialog = false;
        },
        handleDeleteSong() {
            this.dialog = false;
            this.$store.dispatch('songs/deleteSong', this.song.id);
        }
    }
}
</script>

<style scoped>
.line-height {
    line-height: 1;
    margin: 0;
}

.transparant {
    opacity: .5;
    pointer-events: none;
}

.assitive-text {
    height: 1px;
    width: 1px; 
    position: absolute; 
    overflow: hidden; 
    top: -10px;
}
</style>