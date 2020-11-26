<template>
    <v-card class="px-3 mb-4" rounded="lg" flat>
        <DeleteModal :dialog="dialog" @continue="handleDeleteSong" @cancel="cancelDeleteSong"/>
        <v-row justify="start" align="center" style="lineHeight: 0">
            <v-col cols="11" sm="4" order="2" order-sm="1">
                <p class="subtitle-1 font-weight-bold line-height">{{song.title}}</p>
            </v-col>
            <v-col cols="12" sm="7" order="3" order-sm="2">
                <v-row justify="center" justify-sm="start">
                    <v-btn fab depressed x-small :href="song.itunes" :disabled="song.itunes ? false : true" target="_blank" text :class="{'transparant' : !song.itunes}" class="mr-2"><v-img src="@/assets/itunes.svg" width="32" alt="apple music logo"></v-img></v-btn>
                    <v-btn fab depressed x-small :href="song.spotify" :disabled="song.spotify ? false : true" target="_blank" text :class="{'transparant' : !song.spotify}" class="mr-2"><v-img src="@/assets/spotify.svg" width="32" alt="spotify logo"></v-img></v-btn>
                    <v-btn fab depressed x-small :href="song.youtube" :disabled="song.youtube ? false : true" target="_blank" text :class="{'transparant' : !song.youtube}" class="mr-2"><v-img src="@/assets/youtube.svg" width="32" alt="youtube logo"></v-img></v-btn>
                    <v-btn fab depressed x-small :href="song.soundcloud" :disabled="song.soundcloud ? false : true" target="_blank" text :class="{'transparant' : !song.soundcloud}" class="mr-2"><v-img src="@/assets/soundcloud.svg" width="32" alt="soundcloud logo"></v-img></v-btn>
                    <v-btn fab depressed x-small :href="song.shop" :disabled="song.shop ? false : true" target="_blank" text :class="{'transparant' : !song.shop}" class="mr-2"><v-img src="@/assets/shop.svg" width="32" alt="webshop icon"></v-img></v-btn>
                </v-row>
            </v-col>
             <v-col cols="1" order="2" order-sm="3" class="pa-0">
                <v-menu offset-y left>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" >
                            <v-icon color="grey--text">more_vert</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item :to="`/band/song/${song.id}`">
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
}
</style>