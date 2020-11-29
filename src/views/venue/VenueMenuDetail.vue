<template>
    <v-container>
        <h2 style="display: none">Food &amp; drinks detail</h2>
        <v-row>
            <v-col cols="6" md="1" order-md="1">
                <BackButton link="/venue/menu"/>
            </v-col>
            <v-col cols="6" sm="4" md="2" order-md="3">
                <v-row justify="end" justify-md="start" class="px-4">
                    <v-btn :disabled="save" depressed color="primary" @click="handleAddItem" :loading="loadingAddItem">save</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" sm="10" md="8" lg="6" order-md="1">
                <v-card flat class="mx-auto mb-10" rounded="xl" v-if="loadingItem">
                    <v-skeleton-loader type="list-item" class="mb-4 pt-5"></v-skeleton-loader>
                    <v-skeleton-loader type="image" class="mb-4 mx-4"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item" style="maxWidth: 150px" class="mb-4"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item" style="maxWidth: 250px" class="mb-4 pb-5"></v-skeleton-loader>
                </v-card>
                <v-card flat class="mx-auto mb-10" rounded="xl" width="100%" v-else>
                    <v-expand-transition>
                        <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
                    </v-expand-transition>
                    <v-form @submit.prevent ref="form" class="px-4 pt-2 px-md-5 pt-md-3 pb-5">
                        <v-text-field validate-on-blur class="mx-2" v-model="name" label="Name" :rules="nameRules" @input="checkIfUpdated"></v-text-field>
                        <v-container>
                            <p :class="`${fileError ? 'error--text': 'grey--text text--darken-1'} mb-1`">Image</p>
                            <FileDrop @fileDropped="handleUploadFile" @fileRemoved="handleRemoveFile" :rules="imageRules" v-if="!imageUrl"/>
                            <ImagePreview :src="imageUrl" :alt="name" @removeImage="handleRemoveFile" v-else/>
                            <v-scroll-y-transition>
                                <p v-if="fileError" class="error--text caption">{{fileError}}</p>
                            </v-scroll-y-transition>
                        </v-container>
                        <v-text-field validate-on-blur class="mx-2" style="maxWidth: 150px" label="Price" type="number" min="0" v-model="price" prefix="€" :rules="priceRules" @input="checkIfUpdated"></v-text-field>
                        <v-select validate-on-blur class="mx-2" style="maxWidth: 250px" :items="categories" v-model="category" label="Categories" :rules="categoryRules" @change="checkIfUpdated"></v-select>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { nameRules, imageRules, priceRules, categoryRules } from '../../helpers/validationRules';
import BackButton from '../../components/shared/BackButton';
import Alert from '../../components/shared/Alert';
import FileDrop from '../../components/shared/FileDrop';
import ImagePreview from '../../components/shared/ImagePreview';
export default {
    components: {
        BackButton,
        FileDrop,
        Alert,
        ImagePreview
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
            active: true,
            name: '',
            image: null,
            imageUrl: null,
            price: 0.00,
            category: '',
            categories: ['soda', 'beer', 'wine', 'liquor', 'hot', 'snacks'],
            fileError: null,
            nameRules,
            imageRules,
            priceRules,
            categoryRules
        }
    },
    computed: {
        currentItem() {
            return this.$store.getters['menu/currentItem'];
        },
        loadingItem() {
            return this.$store.getters['menu/loadingItem'];
        },
        loadingAddItem() {
            return this.$store.getters['menu/LoadingAddItem'];
        },
        error() {
            return this.$store.getters['menu/error'];
        }
    },
    methods: {
        checkIfUpdated() {
            if (this.id && this.currentItem && (
                this.name !== this.currentItem.name ||
                this.imageUrl == null ||
                this.price !== this.currentItem.price ||
                this.category !== this.currentItem.category)) {
                this.save = false;
            }
        },
        onDismissed() {
            this.$store.dispatch('menu/clearError');
        },
        handleUploadFile(file) {
            this.fileError = null;
            this.image = file;
        },
        handleRemoveFile() {
            this.imageUrl = null;
            this.image = null;
            this.checkIfUpdated();
        },
        handleAddItem() {
            if (!this.image && !this.imageUrl) {
                this.fileError = 'You are required to upload an image';
                this.$refs.form.validate();
                return;
            }
            if (this.$refs.form.validate()) {
                const itemObj = {
                    name: this.name,
                    active: this.active,
                    image: this.imageUrl ? this.imageUrl : this.image,
                    price: this.price, 
                    category: this.category
                }
                if (this.id) {
                    this.$store.dispatch('menu/updateItem', {
                        id: this.id,
                        ...itemObj
                    })
                } else {
                    this.$store.dispatch('menu/addItem', itemObj);
                }
            }
        }
    },
    async mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        if (this.id) {
            this.save = true;
            await this.$store.dispatch('menu/getItemById', this.id);
            const currentItem = this.$store.getters['menu/currentItem'];
            this.active = currentItem.active;
            this.name = currentItem.name;
            this.imageUrl = currentItem.image;
            this.price = currentItem.price;
            this.category = currentItem.category;
        } 
    }
}
</script>