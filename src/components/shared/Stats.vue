<template>
    <v-card height="80vh" style="overflowY: scroll">
        <v-card-title class="primary pa-2">
            <v-spacer></v-spacer>
            <span class="mx-auto white--text">Statistics</span>
            <v-spacer></v-spacer>
            <v-btn small fab depressed text><v-icon class="white--text" @click="closeModal">close</v-icon></v-btn>
        </v-card-title>
        <v-card-text class="px-4 pt-4">
            <v-row v-if="orders && orders.length > 0">
                <v-col cols="12">
                    <LineChart :labels="labels" :data="data" v-if="labels && data"/>
                    <v-divider class="my-4"></v-divider>
                </v-col>
                <v-col cols="5" class="mx-4">
                    <p class="subtitle-1 font-weight-bold mb-2">Revenue:</p>
                    <p class="display-2 mb-0">€<NumberCounter ref="revenue" :from="2" :format="theFormat" :to="revenue" :duration="1" easing="Power4.easeOut" v-if="revenue"/></p>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col cols="6" class="mx-4">
                    <p class="subtitle-1 font-weight-bold mb-2">Top selling products:</p>
                    <div is="transition-group" name="products">
                        <v-row v-for="(product, i) in topSelling" :key="product.id" align="center" class="mb-2 mx-1">
                            <span class="mr-4">{{i+1}}.</span>
                            <img :src="product.image" :alt="product.name" style="objectFit: cover; width: 35px; height: 35px" class="mr-4 rounded-lg">
                            <span class="mr-4 body-1 grey--text text--darken-4">{{product.name}} </span>
                            <span>Qty: {{product.quantity}}</span>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
            <v-row v-else justify="center" align="center">
                <p class="mt-8">Oops... There don't seem to be any orders for this event.</p>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { format } from 'date-fns';
import NumberCounter from "./NumberCounter";
import LineChart from './LineChart.js';
export default {
    props: {
        id: {
            required: true,
            type: String
        },
        type: {
            required: true,
            type: String
        }
    },
    components: {
        LineChart,
        NumberCounter
    },
    computed: {
        orders() {
            return [...this.$store.getters['orders/orders']].sort((a,b) => a.created < b.created ? -1 : 1);
        },
        event () {
            return this.$store.getters['events/currentEvent'];
        },
        labels() {
            if (this.event) {
                const timeDifference = this.event.end - this.event.start;
                const timeJump = timeDifference / 10;
                const labels = [];
                for (let i = 0; i < 10; i++) {
                    labels.push(format(this.event.start + (timeJump * i), 'HH:mm'));
                }
                return labels;
            } else {
                return null;
            }
        },
        data() {
            if (this.event && this.orders.length > 0) {
               const timeDifference = this.event.end - this.event.start;
                const timeJump = timeDifference / 10;
                const sales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                this.orders.forEach(order => {
                    for (let i = 0; i < 10; i++) {
                        if (order.created >= this.event.start + (timeJump * i) && order.created <= this.event.start + (timeJump * (i + 1))) {
                            order.orders.forEach(item => {
                                sales[i] += (parseFloat(item.price) * item.quantity);
                                sales[i] = (Math.round(sales[i] * 100) / 100);
                            });
                        }
                    }
                });
                return sales;
            } else {
                return null
            }
        },
        revenue() {
            if (this.orders.length > 0) {
                let revenue = 0;
                this.orders.forEach(order => order.orders.forEach(item => revenue += (item.price * item.quantity)));
                return revenue;
            } else {
                return null;
            }
        },
        topSelling() {
            if (this.orders.length > 0) {
                const products = [];
                this.orders.forEach(order => order.orders.forEach(item => {
                    if (products.some(e => e.id === item.id)) {
                        const product = products.find(y => y.id === item.id);
                        product.quantity += item.quantity;
                    } else {
                        products.push(item);
                    }
                }));
                products.sort((a,b) => a.quantity > b.quantity ? -1 : 1);
                return products.length >= 3 ? products.slice(0, 3) : products;
            } else {
                return null;
            }
        }
    },
    methods: {
        theFormat(number) {
            return number.toFixed(2);
        },
        closeModal() {
            this.$emit('closeModal');
        }
    },
    async mounted() {
        await this.$store.dispatch('events/getEventById', this.id);
        await this.$store.dispatch('orders/loadOrders', {id: this.id, type: `${this.type}Orders`});
    }
}
</script>

<style scoped>
.products-enter {
    opacity: 0;
    transform: translateY(-30px);
}

.products-enter-active {
    transition: all 500ms ease-out;
}

.products-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.products-leave {
    opacity: 1;
    transform: translateY(0);
}

.products-leave-active {
    transition: all 500ms ease-in;
}

.products-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>