<template>
    <v-row row>
        <v-img :src="src" :alt="alt" max-width="100px" contain class="rounded-lg mt-4 ml-4" elevation="5"></v-img>
        <v-btn fab x-small class="ml-n4" @click="handleRemoveImage"><v-icon>clear</v-icon></v-btn>
    </v-row>
</template>

<script>
export default {
    name: 'ImagePreview',
    props: {
        src: {
            required: true
        },
        alt: {
            required: true,
            type: String
        }
    },
    methods: {
        handleRemoveImage() {
            this.$emit('removeImage')
        }
    }
}
</script>