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
                <v-form v-else>
                    <v-row align="center" class="ml-1">
                        <v-btn color="primary" depressed fab x-small @click="decrementQuantity" :disabled="quantity <= 1"><v-icon small>remove</v-icon></v-btn>
                        <p class="caption mb-0 mx-1">{{quantity}}</p>
                        <v-btn color="primary" depressed fab x-small @click="incrementQuantity" :disabled="quantity >= item.stock"><v-icon small>add</v-icon></v-btn>
                    </v-row>
                </v-form>
                <p class="subtitle-1 text-sm-caption text-md-subtitle-1 mb-0">€{{item.price}}</p>
            </div>
        </div>
    </v-card>
</template>

<script>
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
    data() {
        return {
            quantity: this.item.quantity
        }
    },
    methods: {
        handleDeleteMerch() {
            this.$emit('deleteMerch', this.item.id);
        },
        incrementQuantity() {
            if (this.quantity < this.item.stock) {
                this.quantity++;
                this.$emit('incrementQuantity', this.item.id);
            } 
        },
        decrementQuantity() {
            if (this.quantity > 1) {
                this.quantity--;
                this.$emit('decrementQuantity', this.item.id);
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