<template>
    <v-container>
        <h2 style="display: none">Merchandise detail</h2>
        <v-row>
            <v-col cols="6" md="1" order-md="1">
                <BackButton link="/band/merch"/>
            </v-col>
            <v-col cols="6" sm="4" md="2" order-md="3">
                <v-row justify="end" justify-md="start" class="px-4">
                    <v-btn :disabled="save" depressed color="primary" @click="handleAddMerch" :loading="loadingAddMerch">save</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" sm="10" md="8" lg="6" order-md="1">
                <v-card flat class="mx-auto mb-10" rounded="xl" v-if="loadingMerch">
                    <v-skeleton-loader type="list-item" class="pt-2" style="maxWidth: 350px"></v-skeleton-loader>
                    <v-skeleton-loader type="image"  class="mx-4" style="maxWidth: 100px; maxHeight: 100px"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item-three-line" style="maxWidth: 250px"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item" style="maxWidth: 150px" class="mb-4"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item" style="maxWidth: 350px" class="mb-4"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item" style="maxWidth: 350px" class="mb-4"></v-skeleton-loader>
                    <v-skeleton-loader type="chip" class="mx-4 mb-4 pb-5"></v-skeleton-loader>
                </v-card>
                <v-card flat class="mx-auto pb-8 mb-10" rounded="xl" width="100%" v-else>
                    <v-expand-transition>
                        <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
                    </v-expand-transition>
                    <v-form @submit.prevent ref="form" class="px-4 pt-2 px-md-5 pt-md-3 pb-5">
                        <v-text-field validate-on-blur class="mx-2" style="maxWidth: 300px" v-model="name" label="Name" :rules="titleRules" clearable @input="checkIfUpdated"></v-text-field>
                        <p :class="`${imagesError ? 'error--text': 'grey--text text--darken-1'} mx-2 mb-1`">Images</p>
                        <!-- draggable=".item" only children with class item will be draggable (not uploadbox) -->
                        <draggable :list="images" class="draggable-grid" draggable=".item" @change="checkIfUpdated">
                            <v-col v-for="(image, i) in imagePreviews" :key="i" style="maxWidth: 120px; minWidth: 120px; maxHeight: 120px; minHeight: 120px" class="item">
                                <img :src="createPreview(image)" alt="image" width="100" height="100" class="rounded-lg" style="objectFit: cover"/>
                                <v-btn fab x-small style="marginTop: -235px; marginLeft: 80px" @click="handleRemoveImage(i)"><v-icon>clear</v-icon></v-btn>
                            </v-col>
                            <v-col max-width="80" v-if="images.length < 8">
                                <FileDropMini :rules="imageRules" @fileDropped="handleUploadFile"/>
                            </v-col>
                        </draggable>
                        <v-scroll-y-transition>
                            <p v-if="imagesError" class="error--text caption">{{imagesError}}</p>
                        </v-scroll-y-transition>
                        <v-textarea counter="280" class="mx-2" label="Description" :rules="descriptionRules" v-model="description" style="maxWidth: 300px" @input="checkIfUpdated"></v-textarea>
                        <v-text-field validate-on-blur class="mx-2" style="maxWidth: 150px" label="Price" type="number" min="0" v-model="price" prefix="€" :rules="priceRules" @input="checkIfUpdated"></v-text-field>
                        <v-select validate-on-blur class="mx-2" style="maxWidth: 300px" :items="categories" v-model="category" label="Category" :rules="categoryRules" @input="checkIfUpdated"></v-select>
                        <v-combobox v-model="options" class="mx-2" style="maxWidth: 300px" label="Options" multiple chips hint="x, m, l, xl, ..." deletable-chips @input="checkIfUpdated"></v-combobox>
                        <v-switch v-model="signable" class="mx-2" label="Signable" color="primary" hint="Can this product be signed?" persistent-hint inset @change="checkIfUpdated"></v-switch>
                        <v-row align="center" class="ml-1 mt-6">
                            <v-btn color="primary" depressed @click="decrementStock" fab small><v-icon small>remove</v-icon></v-btn>
                            <v-text-field class="px-2 text-center" style="maxWidth: 60px" label="Stock" type="number" min="0" v-model="stock" :rules="quantityRules" @input="checkIfUpdated"></v-text-field>
                            <v-btn color="primary" depressed @click="incrementStock" fab small><v-icon small>add</v-icon></v-btn>
                        </v-row>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import draggable from 'vuedraggable'
import { titleRules, imageRules, priceRules, categoryRules, quantityRules, descriptionRules } from '../../helpers/validationRules';
import BackButton from '../../components/shared/BackButton';
import Alert from '../../components/shared/Alert';
import FileDropMini from '../../components/shared/FileDropMini';
export default {
    props: {
        id: {
            required: false,
            type: String
        }
    },
    components: {
        BackButton,
        Alert,
        FileDropMini,
        draggable
    },
    data() {
        return {
            save: false,
            name: '',
            images: [],
            description: '',
            price: 0.00,
            category: '',
            options: [],
            signable: false,
            stock: 0,
            categories: ['clothing', 'album', 'accessories', 'print'],
            titleRules,
            imageRules,
            priceRules,
            categoryRules,
            quantityRules,
            descriptionRules,
            imagesError: null,
        }
    },
    computed: {
        imagePreviews() {
            return this.images;
        },
        currentMerch() {
            return this.$store.getters['merch/currentMerch'];
        },
        loadingMerch() {
            return this.$store.getters['merch/LoadingMerch'];
        },
        loadingAddMerch() {
            return this.$store.getters['merch/loadingAddMerch'];
        },
        error() {
            return this.$store.getters['merch/error'];
        }
    },
    methods: {
        handleUploadFile(file) {
            this.imagesError = null;
            this.images.push(file);
            this.checkIfUpdated();
        },
        createPreview(image) {
            // check if newly uploaded file or existing url for update
            return image instanceof File ? URL.createObjectURL(image) : image.image;
        },
        handleRemoveImage(index) {
            this.images.splice(index, 1);
            this.checkIfUpdated();
        }, 
        decrementStock() {
            if (this.stock <= 0) {
                this.stock = 0;
            } else {
                this.stock--;
            }
            this.checkIfUpdated();
        },
        incrementStock() {
            this.stock++;
            this.checkIfUpdated();
        },
        checkIfUpdated() {
            if (this.id && this.currentMerch && (
                this.name !== this.currentMerch.name ||
                this.images !== this.currentMerch.images ||
                this.price !== this.currentMerch.price ||
                this.options !== this.currentMerch.options ||
                this.signable !== this.currentMerch.signable ||
                this.description !== this.currentMerch.description ||
                this.stock !== this.currentMerch.stock ||
                this.category !== this.currentMerch.category)) {
                this.save = false;
            }
        },
        handleAddMerch() {
            this.imagesError = null;
            if (this.images.length <= 0) {
                this.imagesError = 'At least one image is required';
                this.$refs.form.validate();
                return;
            }
            if (this.$refs.form.validate()) {
                const merchObj = {
                    name: this.name,
                    images: this.images,
                    description: this.description,
                    price: this.price,
                    category: this.category,
                    options: this.options,
                    signable: this.signable,
                    stock: this.stock
                }
                if (this.id) {
                    this.$store.dispatch('merch/updateMerch', {
                        id: this.id,
                        ...merchObj
                    })
                } else {
                    this.$store.dispatch('merch/addMerch', merchObj)
                }
            }
        },
        onDismissed() {
            this.$store.dispatch('merch/clearError');
        }
    },
    async mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        if (this.id) {
            this.save = true;
            await this.$store.dispatch('merch/getMerchById', this.id);
            const currentMerch = this.$store.getters['merch/currentMerch'];
            this.name = currentMerch.name;
            // create new array to make sure changes are picked up
            this.images = [...currentMerch.images];
            this.description = currentMerch.description;
            this.price = currentMerch.price;
            this.category = currentMerch.category;
            this.options = currentMerch.options;
            this.signable = currentMerch.signable;
            this.stock = currentMerch.stock;
        }
    }
}
</script>

<style  scoped>
.draggable-grid {
    display: flex;
    flex-wrap: wrap;
}
</style>