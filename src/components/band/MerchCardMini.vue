<template>
    <v-card class="my-2 mx-1 card-grid pa-2">
        <v-responsive :aspect-ratio="1/1" class="card-grid-img">
            <img :src="item.image.image" :alt="item.name" class="rounded-lg" style="objectFit: cover; width: 100%; height: 100%" />
        </v-responsive>
        <div class="card-grid-wrapper">
            <div class="card-grid-info">
                <p class="subtitle-1 text-sm-caption text-md-subtitle-1 mt-1 mb-2" style="lineHeight: 1.1;">{{item.name}}</p>
                <v-btn aria-label="delete" fab text x-small link class="grey--text" v-if="!disabled" @click="handleDeleteMerch"><v-icon>delete</v-icon></v-btn>
            </div>
            <div class="card-grid-info">
                <p class="subtitle-1 text-sm-caption text-md-subtitle-1 mb-0" v-if="disabled">{{item.stock}}</p>
                <div v-else>
                    <v-row align="center" class="ml-1" v-if="item.options.length < 1">
                        <v-btn color="primary" aria-label="decrement" depressed fab x-small @click="decrementQuantity" :disabled="item.quantity <= 1"><v-icon small>remove</v-icon></v-btn>
                        <p class="caption mb-0 mx-1">{{quantity ? quantity : item.quantity}}</p>
                        <v-btn color="primary" aria-label="increment" depressed fab x-small @click="incrementQuantity" :disabled="item.quantity >= item.stock"><v-icon small>add</v-icon></v-btn>
                    </v-row>
                    <v-row class="ml-1" v-else>
                        <v-dialog v-model="dialog" max-width="350px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn small class="primary" @click="dialog = !dialog" depressed v-bind="attrs" v-on="on" aria-label="options">options</v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span>Options</span>
                                    <v-spacer></v-spacer>
                                    <v-btn fab small text><v-icon class="primary--text" @click="dialog = !dialog" aria-label="close">close</v-icon></v-btn>    
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text class="mt-4">
                                    <div v-for="(option, i) in item.options" :key="i" >
                                        <UpdateQtyMerchCardMini :option="option" :index="i" @incrementOptionQuantity="incrementOptionQuantity" @decrementOptionQuantity="decrementOptionQuantity"/>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                    </v-row>
                </div>
                <p class="subtitle-1 text-sm-caption text-md-subtitle-1 mb-0">€{{item.price}}</p>
            </div>
        </div>
    </v-card>
</template>

<script>
import UpdateQtyMerchCardMini from './UpdateQtyMerchCardMini';
export default {
    props: {
        item: {
            required: true,
            type: Object
        },
        disabled: {
            required: true,
            type: Boolean
        },
    },
    components: {
        UpdateQtyMerchCardMini,
    },
    data() {
        return {
            dialog: false,
            quantity: null,
        }
    },
    methods: {
        handleDeleteMerch() {
            this.$emit('deleteMerch', this.item.id);
        },
        incrementOptionQuantity(index) {
            this.$emit('incrementOptionQuantity', {id: this.item.id, index});
        },
        decrementOptionQuantity(index) {
            this.$emit('decrementOptionQuantity', {id: this.item.id, index});
        },
        incrementQuantity() {
            if (this.item.quantity < this.item.stock) {
                this.$emit('incrementQuantity', this.item.id);
                // little hack to make sure the quantity updates when there is a new item added to the list 
                // Vue's reactivity system won't update when there is a new item added to the list (https://vuejs.org/v2/guide/reactivity.html)
                this.quantity = this.item.quantity;
                this.quantity = null;
            }
        },
        decrementQuantity() {
            if (this.item.quantity > 0) {
                this.$emit('decrementQuantity', this.item.id);
                this.quantity = this.item.quantity;
                this.quantity = null;
            }
        }
    }
}
</script>

<style>
    .card-grid {
        display: flex;
    }

    .card-grid:hover {
        cursor: pointer;
    }

    .card-grid-img {
        max-width: 80px;
        margin-right: 10px;
    }

    .card-grid-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .card-grid-info {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
</style>