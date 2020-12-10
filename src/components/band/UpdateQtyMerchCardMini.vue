<template>
    <v-row align="center" class="mb-3" justify="center">
        <p class="mb-0 subtitle-1" style="width: 35px">{{option.option}}</p>
        <v-btn aria-label="decrement" color="primary" depressed fab x-small @click="decrementOptionQuantity" :disabled="quantity<= 1"><v-icon small>remove</v-icon></v-btn>
        <p class="caption mb-0 mx-1 text-center" style="width: 25px">{{quantity}}</p>
        <v-btn aria-label="increment" color="primary" depressed fab x-small @click="incrementOptionQuantity" :disabled="quantity >= option.stock"><v-icon small>add</v-icon></v-btn>
    </v-row>
</template>

<script>
export default {
    props: {
        option: {
            required: true,
            type: Object
        },
        index: {
            required: true,
            type: Number
        }
    },
    data() {
        return {
            quantity: this.option.quantity
        }
    },
    methods: {
        incrementOptionQuantity() {
            this.quantity++;
            this.$emit('incrementOptionQuantity', this.index);
        },
        decrementOptionQuantity() {
             this.quantity--;
            this.$emit('decrementOptionQuantity', this.index);
        }
    }
}
</script>