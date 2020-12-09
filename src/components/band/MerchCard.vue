<template>
    <article>
        <v-card class="px-3 mb-4" rounded="lg" flat>
            <DeleteModal :dialog="dialog" @continue="handleDeleteItem" @cancel="cancelDeleteItem"/>
            <v-row justify="start" align="center" style="lineHeight: 0">
                <v-col cols="4" style="maxWidth: 120px" sm="2" order="1" order-sm="1">
                    <v-responsive :aspect-ratio="1/1">
                        <img :src="item.image.image" :alt="item.name" class="rounded-lg" style="objectFit: cover; width: 100%; height: 100%" />
                    </v-responsive>
                </v-col>
                <v-col cols="6" sm="5" order="2" order-sm="2">
                    <h3 class="subtitle-1 font-weight-bold line-height">{{item.name}}</h3>
                </v-col>
                <v-col cols="4" order="5" class="hidden-sm-and-up"></v-col>
                <v-col cols="3" sm="2" order="5" order-sm="3">
                    <p class="subtitle-1 line-height">{{item.category}}</p>
                </v-col>
                <v-col cols="3" sm="2" order="5" order-sm="4">
                    <p class="subtitle-1 line-height"><span class="grey--text">Qty:</span> {{item.stock}}</p>
                </v-col>
                <v-col cols="1" order="3" order-sm="5">
                    <v-menu offset-y left>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on" >
                                <v-icon color="grey--text">more_vert</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item :to="`/band/merch/${item.id}`">
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
    </article>
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
            dialog: false
        }
    },
    methods: {
        openModal() {
            this.dialog = true;
        },
        cancelDeleteItem() {
            this.dialog = false;
        },
        handleDeleteItem() {
            this.dialog = false;
            this.$store.dispatch('merch/deleteItem', this.item.id);
        }
    }
}
</script>

<style scoped>
.line-height {
    line-height: 1;
    margin: 0;
}
</style>