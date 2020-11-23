<template>
    <v-card class="mb-4" rounded="lg" flat max-width="100%">
        <DeleteModal :dialog="dialog" @continue="handleDeleteItem" @cancel="cancelDeleteItem"/>
        <v-card-title :class="{'text--disabled': !active}">
            <v-form @submit.prevent>
                <v-checkbox v-model="active" ></v-checkbox>
            </v-form>
            <v-avatar size="48" :color="`${item.name ? 'primary' : 'error'}`" :class="{'transparant': !active}">
                <img class="rounded-avatar" :src="item.image" :alt="item.name" v-if="item.image"/>
                <v-icon v-else large dark>error</v-icon>
            </v-avatar>
            <span class="ml-5 headline font-weight-bold">{{item.name}}</span>   
            <v-spacer></v-spacer>
            <span class="subtitle-1" >{{ item.category }}</span>
            <v-spacer></v-spacer>
            <span class="subtitle-1">€{{ item.price }}</span>
            <v-spacer></v-spacer>
            <v-menu offset-y left>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" >
                        <v-icon color="grey--text">more_vert</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item :to="`/venue/menu/${item.id}`">
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
</template>

<script>
import DeleteModal from '../shared/DeleteModal';
export default {
    props: {
        item: {
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
            active: this.item.active
        }
    },
    methods: {
        updateActiveStatus() {
            this.active = !this.active;
            // write update logic for firestore
        },
        onDismissed() {
            this.$store.dispatch('menu/clearError');
        },
        openModal() {
            this.dialog = true;
        },
        cancelDeleteItem() {
            this.dialog = false;
        },
        handleDeleteItem() {
            this.dialog = false;
            this.$store.dispatch('menu/deleteItem', this.item.id);
        }
    },
}
</script>

<style scoped>
.transparant {
    opacity: .7;
}
</style>
