<template>
    <v-row>
        <div style="width: 100px; height: 100px; maxWidth: 100px; maxHeight: 100px">
            <img :src="src" :alt="alt" style="width: 80px; objectFit: contain" class="rounded-lg mt-4 ml-4"/>
        </div>
        <v-btn name="remove" fab x-small class="ml-n4" @click="handleRemoveImage"><v-icon>clear</v-icon></v-btn>
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