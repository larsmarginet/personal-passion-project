<template>
    <v-container>
        <h2 hidden>Event detail</h2>
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
                <v-card flat class="mx-auto mb-10" rounded="xl" v-if="loadingEvent">
                    <v-skeleton-loader max-width="290" type="table-heading, date-picker-days" class="mb-4"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item-avatar" class="mb-4"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item-avatar" class="mb-4 pb-5"></v-skeleton-loader>
                </v-card>
                <v-card flat class="mx-auto mb-10" rounded="xl" v-else>
                    <v-expand-transition>
                        <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
                    </v-expand-transition>
                    <v-form @submit.prevent ref="form" class="px-4 pt-2 px-md-5 pt-md-3 pb-5">
                        <v-text-field class="mx-2" v-model="name" label="Name" :rules="nameRules"></v-text-field>
                        <v-container>
                            <p :class="`${fileError ? 'error--text': 'grey--text text--darken-1'} mb-1`">Image</p>
                            <FileDrop @fileDropped="handleUploadFile" @fileRemoved="handleRemoveFile" :rules="imageRules"/>
                            <p v-if="fileError" class="error--text caption">{{fileError}}</p>
                        </v-container>
                        <v-text-field class="mx-2" style="maxWidth: 150px" label="Price" type="number" min="0" v-model="price" prefix="€" :rules="priceRules"></v-text-field>
                        <v-select class="mx-2" style="maxWidth: 250px" :items="categories" v-model="category" label="Categories" :rules="categoryRules"></v-select>
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
export default {
     components: {
        BackButton,
        FileDrop,
        Alert
    },
    data() {
        return {
            save: false,
            name: '',
            image: null,
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
        loadingEvent() {
            return this.$store.getters['menu/loadingItem'];
        },
        loadingAddItem() {
            return this.$store.getters['menu/loadingAddItem'];
        },
        error() {
            return this.$store.getters['menu/error'];
        }
    },
    methods: {
        onDismissed() {
            this.$store.dispatch('menu/clearError');
        },
        handleUploadFile(file) {
            this.fileError = null;
            this.image = file;
        },
        handleRemoveFile() {
            this.image = null;
        },
        handleAddItem() {
            if (!this.image) {
                this.fileError = 'You are required to upload a logo';
                this.$refs.form.validate();
                return;
            }
            if (this.$refs.form.validate()) {
                this.$store.dispatch('menu/addItem', {
                    name: this.name,
                    image: this.image,
                    price: this.price, 
                    category: this.category
                });
            }
        }
    },
    mounted() {
        this.$store.dispatch('setLoadingComponent', false);
    }
}
</script>