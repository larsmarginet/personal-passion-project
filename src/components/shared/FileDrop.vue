<template>
    <div>
        <v-sheet tabindex="0" title="Click to upload your logo" color="grey lighten-4" width="100%" height="200" class="pa-2 d-flex flex-column justify-center rounded-lg" @click="handleClickPicker" @dragover.prevent="dragover" @dragleave="dragleave" @drop.prevent="drop" v-if="!file">
            <label for="logo" style="display: none">
                Click to upload
                <input id="log" type="file" accept="image/png, image/jpeg" ref="picker" @change="handleChangePicker"/>
            </label>
            <v-icon x-large color="grey lighten-2" class="mx-auto">add_a_photo</v-icon>
            <p class="caption grey--text text--lighten-1 text-center mt-2">Drag your logo here or click to upload</p>
            <p class="caption error--text text-center" v-if="error">{{error}}</p>
        </v-sheet>
        <ImagePreview :src="preview" :alt="file.name" @removeImage="handleRemoveImage" v-else />
    </div>
</template>

<script>
import ImagePreview from './ImagePreview'
export default {
    name: 'FileDrop',
    components: {
        ImagePreview
    },
    props: {
        rules: {
            required: true,
            type: Array
        }
    },
    data()  {
        return {
            file: null,
            preview: null,
            error: null
        }
    },
    methods: {
        dragover(e) {
            if (e.currentTarget.classList.contains('grey')) {
                e.currentTarget.classList.remove('grey', 'lighten-4');
                e.currentTarget.classList.add('primary', 'lighten-1');
            }
        },
        dragleave(e) {
            this.normalise(e)
        },
        // Drag and drop file event
        drop(e) {
            this.vaildate(e.dataTransfer.files[0], e)
            if (this.error === null) {
                this.file = e.dataTransfer.files[0];
                this.preview = URL.createObjectURL(this.file);
                this.normalise(e);
                this.$emit('fileDropped', this.file);
            }
        },
        // Open file modal on click
        handleClickPicker() {
            this.$refs.picker.click();
        },
        // Set file when user choses file in modal
        handleChangePicker(e) {
            this.vaildate(e.currentTarget.files[0]);
            if (this.error === null) {
                this.file = e.currentTarget.files[0];
                this.preview = URL.createObjectURL(this.file);
                this.$emit('fileDropped', this.file);
            }
        },
        vaildate(file, e = false) {
            this.error = null;
            this.rules.forEach(rule => {
                if (rule(file) !== true) {
                    this.error = rule(file);
                    if (e) {
                        // normalising is only needed on drop, not on click
                        this.normalise(e);
                    }
                    return false;
                }
            }) 
        },
        // return sheet to normal colors after dropping, leaving or erroring
        normalise(e) {
            e.currentTarget.classList.add('grey', 'lighten-4');
            e.currentTarget.classList.remove('primary', 'lighten-1');
        },
        handleRemoveImage() {
            this.file = null;
            this.preview = null;
            this.$emit('fileRemoved');
        }
    }, 
}
</script>