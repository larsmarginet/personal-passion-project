<template>
    <section>
        <h2 style="visibility: hidden; fontSize: 0">Merchandise</h2>
        <v-row>
            <v-col cols="12" md="3" order-md="2" offset-md="12">
                <v-row justify="end" justify-md="start" class="px-4">
                    <v-btn aria-label="add merch" href="/band/merch/create" depressed color="primary">Add merch</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" md="9" order-md="1">
                <v-expand-transition>
                    <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
                </v-expand-transition>
                <v-container v-if="loading">
                    <v-skeleton-loader type="list-item-avatar" class="mb-4" v-for="n in 5" :key="n"></v-skeleton-loader>
                </v-container>
                <v-container class="pa-0" v-else-if="!loading && merch">
                    <div is="transition-group" name="list">
                        <MerchCard v-for="item in merch" :key="item.id" :item="item"/>
                    </div>
                </v-container>
            </v-col>
        </v-row>
    </section>
</template>

<script>
import MerchCard from '../../components/band/MerchCard';
import Alert from '../../components/shared/Alert';
export default {
    components: {
        Alert,
        MerchCard,
    },
    computed: {
        loading() {
            return this.$store.getters['merch/loadingMerch'];
        },
        error() {
            return this.$store.getters['merch/error'];
        },
        merch() {
            return this.$store.getters['merch/merch'];
        },
    },
    methods: {
        onDismissed() {
            this.$store.dispatch('merch/clearError');
        }
    },
    mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        this.$store.dispatch('merch/loadMerch');
    }
}
</script>

<style scoped>
.list-enter {
    opacity: 0;
    transform: translateY(-30px);
}

.list-enter-active {
    transition: all 500ms ease-out;
}

.list-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.list-leave{
    opacity: 1;
    transform: translateY(0);
}

.list-leave-active {
    transition: all 500ms ease-in;
}

.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>