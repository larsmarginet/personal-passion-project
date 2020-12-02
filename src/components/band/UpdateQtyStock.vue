<template>
    <v-row align="center" class="ml-1">
        <v-btn color="primary" depressed fab x-small @click="decrementQuantity" :disabled="quantity <= 1"><v-icon small>remove</v-icon></v-btn>
        <p class="caption mb-0 mx-1">{{quantity}}</p>
        <v-btn color="primary" depressed fab x-small @click="incrementQuantity" :disabled="quantity >= stock"><v-icon small>add</v-icon></v-btn>
    </v-row>
</template>

<script>
export default {
    props: {
        amount: {
            required: true,
            type: Number
        },
        stock: {
            required: true,
            type: Number
        }
    },
    data() {
        return {
            quantity: this.amount
        }
    },
    methods: {
        incrementQuantity() {
            if (this.quantity < this.stock) {
                this.quantity++;
                this.$emit('incrementQuantity');
            } 
        },
        decrementQuantity() {
            if (this.quantity > 1) {
                this.quantity--;
                this.$emit('decrementQuantity');
            }
        }
    }
}
</script>