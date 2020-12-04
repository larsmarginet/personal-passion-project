<template>
     <section>
        <h2 style="display: none;">Orders</h2>
        <div v-if="loading">
            <v-skeleton-loader v-for="n in 5" :key="n" type="table-thead" class="mb-4"></v-skeleton-loader>
        </div>
        <v-expansion-panels flat v-else-if="!loading && orders">
            <v-row style="maxWidth: 98%" justify="start">
                <v-col cols="6" sm="3" md="2">
                    <p class="mb-0 caption">TIME</p>
                </v-col>
                <v-col cols="3" sm="1" md="2">
                    <p class="mb-0 caption">QTY</p>
                </v-col>
                <v-col cols="3" sm="1" md="2">
                   <p class="mb-0 caption">TOTAL</p>
                </v-col>
                <v-col cols="2" v-if="type === 'band'">
                    <p class="mb-0 caption">SIGNED</p>
                </v-col>
                <v-col cols="2" >
                    <p class="mb-0 caption">TABLE</p>
                </v-col>
                <v-col cols="2">
                    <p class="mb-0 caption">STATUS</p>
                </v-col>
            </v-row>
                <v-expansion-panel v-for="order in orders" :key="order.id">
                    <v-expansion-panel-header>
                        <v-row align="center">
                            <v-col cols="6" sm="3" md="2">
                                <p class="mb-0 body-1 font-weight-bold">{{getHours(order.created)}}</p>
                            </v-col>
                            <v-col cols="3" sm="1" md="2">
                                <p class="mb-0 body-1 font-weight-bold">{{getTotalItems(order)}}</p>
                            </v-col>
                            <v-col cols="3" sm="1" md="2">
                                <p class="mb-0 body-1 font-weight-bold">€{{getTotalPrice(order)}}</p>
                            </v-col>
                            <v-col cols="2" v-if="type === 'band'">
                                <v-btn depressed medium class="orange white--text" :class="{'primary': order.signed}">{{order.signed ? 'yes' : 'no'}}</v-btn>
                            </v-col>
                            <v-col cols="2">
                                <p class="mb-0 body-1 font-weight-bold">#{{order.bubble}}</p>
                            </v-col>
                            <v-col cols="2">
                                <v-btn depressed medium @click.native.stop="handleUpdateStatus({id: order.id, status: order.status})" class="white--text" :class="`${order.status === 'uncompleted' ? 'error' : order.status === 'processing' ? 'orange' : 'primary' }`">
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
                            <v-col cols="2" sm="1" v-if="type === 'band'">
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
                                    <img :src="item.image" :alt="item.name" width="30" height="30" class="rounded-sm mr-2 mr-sm-4" cover>
                                    <p class="font-weight-bold mb-0 pt-1 body-1">{{item.name}}</p>
                                </v-row>
                            </v-col>
                            <v-col cols="2" sm="1" v-if="type === 'band'">
                                <p class="text-center mb-0 body-1">{{item.option}}</p>
                            </v-col>
                            <v-col cols="1" sm="1">
                                <p class="text-center mb-0 body-1">{{item.quantity}}</p>
                            </v-col>
                            <v-col cols="2" sm="1">
                                <p class="text-center mb-0 body-1">€{{(Math.round(item.quantity * item.price * 100) / 100).toFixed(2)}}</p>
                            </v-col>
                        </v-row>
                        <p class="caption mt-4">ID: {{order.id}}</p>
                    </v-expansion-panel-content>    
                    <v-divider></v-divider>
                </v-expansion-panel>
        </v-expansion-panels>
        <v-row v-else justify="center">
            <p class="body-1 mt-10">No orders yet...</p>
        </v-row>
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
        loading() {
            return this.$store.getters['orders/loading'];
        },
        type() {
            return this.$route.path.includes('venue') ? 'venue' : 'band';
        }
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
            return (Math.round(total * 100) / 100).toFixed(2);
        },
        handleUpdateStatus({id, status}) {
            if (status === 'uncompleted') {
                status = 'processing';
            } else if (status === 'processing') {
                status = 'complete';
            } else if (status === 'complete') {
                status = 'uncompleted';
            }
            this.$store.dispatch('orders/updateOrderStatus', {eventId: this.id, id, status, type: `${this.type}Orders`});
        }
    },
    mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        this.$store.dispatch('orders/loadOrders', {id: this.id, type: `${this.type}Orders`});
    }
}
</script>

<style scoped>
.line-height {
    line-height: 2;
}
</style>