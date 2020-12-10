<template>
    <article>
        <v-card class="mb-4" rounded="lg" flat max-width="100%">
            <DeleteModal :dialog="dialog" @continue="handleDeleteRoom" @cancel="cancelDeleteRoom"/>
            <v-card-title>
                <h3 class="ml-5 headline font-weight-bold">{{ room.name }}</h3>   
                <v-spacer></v-spacer>
                <span class="subtitle-1">{{ room.bubbles }} bubbles</span>
                <v-spacer></v-spacer>
                <v-menu offset-y left>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" aria-label="menu">
                            <v-icon color="grey--text">more_vert</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item :to="`/venue/rooms/${room.id}`">
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
        </v-card>
    </article>
</template>

<script>
import DeleteModal from '../shared/DeleteModal';
export default {
    props: {
        room: {
            required: true,
            type: Object
        }
    },
    components: {
        DeleteModal
    },
    data() {
        return {
            dialog: false,
        }
    },
    methods: {
        openModal() {
            this.dialog = true;
        },
        cancelDeleteRoom() {
            this.dialog = false;
        },
        handleDeleteRoom() {
            this.dialog = false;
            this.$store.dispatch('rooms/deleteRoom', this.room.id);
        }
    },
}
</script>

