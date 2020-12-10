<template>
    <v-card class="my-2 mx-1">
        <v-card-title class="subtitle-1 text-sm-caption text-md-subtitle-1 mb-0">
            <p class="mb-0">{{song.title}}</p>
            <v-spacer></v-spacer>
            <v-btn fab text x-small link class="grey--text" v-if="!disabled" @click="handleDeleteSong" name="delete"><v-icon>delete</v-icon></v-btn>    
        </v-card-title>
    </v-card>
</template>

<script>
export default {
    props: {
        song: {
            required: true,
            type: Object
        },
        disabled: {
            required: true,
            type: Boolean
        },
    },
    methods: {
        handleDeleteSong() {
            this.$emit('deleteSong', this.song.id);
        },
    }
}
</script>