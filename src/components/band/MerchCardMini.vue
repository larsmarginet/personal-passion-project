<template>
    <v-card class="my-2 mx-1 card-grid pa-2">
        <v-responsive :aspect-ratio="1/1" class="card-grid-img">
            <img width="100%" height="100%" :src="item.image.image" :alt="item.name" class="rounded-lg" style="objectFit: cover" />
        </v-responsive>
        <div class="card-grid-wrapper">
            <div class="card-grid-info">
                <p class="subtitle-1 text-sm-caption text-md-subtitle-1 mt-1 mb-2" style="lineHeight: 1.1;">{{item.name}}</p>
                <v-btn fab text x-small link class="grey--text" v-if="!disabled" @click="handleDeleteMerch"><v-icon>delete</v-icon></v-btn>
            </div>
            <div class="card-grid-info">
                <p class="subtitle-1 text-sm-caption text-md-subtitle-1 mb-0" v-if="disabled">{{item.stock}}</p>
                <v-form @submit.prevent v-else>
                    <div  v-if="item.options.length < 1">
                        <!-- create a seperate component, beacuse vue's reactivity system is weird when arrays change -->
                        <!-- this card would display the quantity of the item that had this index before the update -->
                       <UpdateQtyStock :amount="item.quantity" :stock="item.stock" @incrementQuantity="incrementQuantity" @decrementQuantity="decrementQuantity"/>
                    </div>
                    <v-row class="ml-1" v-else>
                        <v-dialog v-model="dialog" max-width="350px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn small class="primary" @click="dialog = !dialog" depressed v-bind="attrs" v-on="on">options</v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span>Options</span>
                                    <v-spacer></v-spacer>
                                    <v-btn fab small text><v-icon class="primary--text" @click="dialog = !dialog">close</v-icon></v-btn>    
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
                </v-form>
                <p class="subtitle-1 text-sm-caption text-md-subtitle-1 mb-0">€{{item.price}}</p>
            </div>
        </div>
    </v-card>
</template>

<script>
import UpdateQtyMerchCardMini from './UpdateQtyMerchCardMini';
import UpdateQtyStock from './UpdateQtyStock';
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
        UpdateQtyStock
    },
    data() {
        return {
            dialog: false,
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
            this.$emit('incrementQuantity', this.item.id);
        },
        decrementQuantity() {
            this.$emit('decrementQuantity', this.item.id)
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