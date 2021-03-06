<template>
    <section>
        <MusicPlayer v-if="!loading && type === 'band'" :id="id"/>
        <h2 style="visibility: hidden; fontSize: 0">Orders</h2>
        <div v-if="loading">
            <v-skeleton-loader v-for="n in 5" :key="n" type="table-thead" class="mb-4"></v-skeleton-loader>
        </div>
        <v-expansion-panels flat v-else-if="!loading && orders" role="list">
            <v-row class="px-4 pb-4" style="width: 100%">
                <v-icon class="primary--text">filter_list</v-icon>
                <v-btn aria-label="all" text :class="{'primary--text': filter === 'all'}" @click="setFilter('all')">All</v-btn>
                <v-btn aria-label="signed" text :class="{'primary--text': filter === 'signed'}" @click="setFilter('signed')" v-if="type === 'band'">Signed</v-btn>
                <v-btn aria-label="uncompleted" text :class="{'primary--text': filter === 'uncompleted'}" @click="setFilter('uncompleted')">Uncompleted</v-btn>
                <v-btn aria-label="processing" text :class="{'primary--text': filter === 'processing'}" @click="setFilter('processing')">Processing</v-btn>
            </v-row>
            <v-row style="maxWidth: 96%; marginLeft: -4%" justify="start">
                <v-col cols="6" sm="3" md="2">
                    <p class="mb-0 caption">TIME</p>
                </v-col>
                <v-col cols="3" sm="1" md="2">
                    <p class="mb-0 caption">QTY</p>
                </v-col>
                <v-col cols="3" sm="1" md="2" class="pl-6">
                   <p class="mb-0 caption">TOTAL</p>
                </v-col>
                <v-col cols="2" class="pl-6" v-if="type === 'band'">
                    <p class="mb-0 caption">SIGNED</p>
                </v-col>
                <v-col cols="2" class="pl-6">
                    <p class="mb-0 caption">TABLE</p>
                </v-col>
                <v-col cols="2" class="pl-6">
                    <p class="mb-0 caption">STATUS</p>
                </v-col>
            </v-row>
            <v-expansion-panel v-for="order in filteredOrders" :key="order.id" role="listitem">
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
                            <v-btn :aria-label="`${order.signed ? 'yes' : 'no'}`" depressed class="orange white--text" :class="{'primary': order.signed}">{{order.signed ? 'yes' : 'no'}}</v-btn>
                        </v-col>
                        <v-col cols="2">
                            <p class="mb-0 body-1 font-weight-bold">#{{order.bubble}}</p>
                        </v-col>
                        <v-col cols="2">
                            <v-btn :aria-label="`${order.status === 'uncompleted' ? 'uncompleted' : order.status === 'processing' ? 'processing' : 'completed' }`" depressed @click.native.stop="handleUpdateStatus({id: order.id, status: order.status})" class="white--text" :class="`${order.status === 'uncompleted' ? 'error' : order.status === 'processing' ? 'orange' : 'primary' }`">
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
                                <img :src="item.image" :alt="item.name" width="30" height="30" class="rounded-sm mr-2 mr-sm-4" style="objectFit: cover">
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
import MusicPlayer from '../components/band/MusicPlayer';
export default {
    props: {
        id: {
            required: true,
            type: String
        }
    },
    components: {
        MusicPlayer
    },
    data() {
        return {
            filter: 'all',
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
        },
        filteredOrders() {
            if (this.filter === 'all') {
                return this.orders;
            } else if (this.filter === 'signed') {
                return this.orders.filter(order => order.signed == true);
            } else if (this.filter === 'uncompleted') {
                return this.orders.filter(order => order.status === 'uncompleted');
            } else if (this.filter === 'processing') {
                return this.orders.filter(order => order.status === 'processing');
            } else {
                return this.orders;
            }
        }
    },
    methods: {
        setFilter(val) {
            this.filter !== val ? this.filter = val : this.filter = '';
        },
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