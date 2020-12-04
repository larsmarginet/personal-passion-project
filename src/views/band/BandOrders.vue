<template>
    <section>
        <h2 style="display: none;">Orders</h2>
        <v-expansion-panels flat>
            <v-expansion-panel v-for="order in orders" :key="order.id" >
                <v-expansion-panel-header>
                    <v-row class="font-weight-bold" align="center">
                        <v-col cols="6" sm="3" md="2">
                            {{getHours(order.created)}}
                        </v-col>
                        <v-col cols="3" sm="1" md="2">
                            {{getTotalItems(order)}}
                        </v-col>
                        <v-col cols="3" sm="1" md="2">
                            €{{getTotalPrice(order)}}
                        </v-col>
                        <v-col cols="2" class="pt-4">
                            <v-btn depressed medium class="orange white--text" :class="{'primary': order.signed}">{{order.signed ? 'yes' : 'no'}}</v-btn>
                        </v-col>
                        <v-col cols="2">
                            #{{order.bubble}}
                        </v-col>
                        <v-col cols="2">
                            <v-btn depressed medium @click.native.stop="test" class="white--text" :class="`${order.status === 'uncompleted' ? 'error' : order.status === 'processing' ? 'orange' : 'primary' }`">
                                {{order.status}}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-divider class="mb-4"></v-divider>
                    <v-row>
                        <v-col cols="12" sm="7" md="4">
                            <p class="ml-8 mb-0 caption">ITEM</p>
                        </v-col>
                        <v-col cols="2" sm="1">
                            <p class="text-center mb-0 caption">OPTION</p>
                        </v-col>
                        <v-col cols="1" sm="1">
                           <p class="text-center mb-0 caption">QTY</p>
                        </v-col>
                        <v-col cols="2" sm="1">
                            <p class="text-center mb-0 caption">TOTAL</p>
                        </v-col>
                    </v-row>
                    <v-row v-for="item in order.orders" :key="`${item.id}-${item.option}`" >
                        <v-col cols="12" sm="7" md="4">
                            <v-row class="ml-2 line-height">
                                <img :src="item.image" :alt="item.name" width="30" height="30" class="rounded-sm mr-2 mr-sm-4">
                                <p class="font-weight-bold mb-0">{{item.name}}</p>
                            </v-row>
                        </v-col>
                        <v-col cols="2" sm="1">
                            <p class="text-center mb-0">{{item.option}}</p>
                        </v-col>
                        <v-col cols="1" sm="1">
                            <p class="text-center mb-0">{{item.quantity}}</p>
                        </v-col>
                        <v-col cols="2" sm="1">
                            <p class="text-center mb-0">€{{(Math.round(item.quantity * item.price * 100) / 100).toFixed(2)}}</p>
                        </v-col>
                    </v-row>
                    <p class="caption mt-4">ID: {{order.id}}</p>
                </v-expansion-panel-content>
                <v-divider></v-divider>
            </v-expansion-panel>
        </v-expansion-panels>
    </section>
</template>

<script>
import { format } from 'date-fns';
export default {
    props: {
        id: {
            required: true,
            type: String
        }
    },
    computed: {
        orders() {
            return this.$store.getters['orders/orders'];
        },
    },
    methods: {
        getHours(timestamp) {
            return format(timestamp, 'HH:mm')
        },
        getTotalItems(order) {
            let total = 0;
            order.orders.forEach(item => total += item.quantity);
            return total;
        },
        getTotalPrice(order) {
            let total = 0;
            order.orders.forEach(item => total += (item.price * item.quantity));
            return total;
        },
        test() {
            console.log('test')
        }
    },
    mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        this.$store.dispatch('orders/loadOrdersForBand', this.id);
    }
}
</script>

<style scoped>
.line-height {
    line-height: 2;
}
</style>