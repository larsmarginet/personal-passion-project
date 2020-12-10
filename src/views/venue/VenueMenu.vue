<template>
    <section>
        <h2 style="display: none">Food &amp; drinks</h2>
        <v-row>
            <v-col cols="12" md="3" order-md="2" offset-md="12">
                <v-row justify="end" justify-md="start" class="px-4">
                    <v-btn name="add item" href="/venue/menu/create" depressed color="primary">Add item</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" md="9" lg="6" order-md="1">
                <v-expand-transition>
                    <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
                </v-expand-transition>
                <v-container v-if="loading">
                    <v-skeleton-loader type="list-item-avatar" class="mb-4" v-for="n in 5" :key="n"></v-skeleton-loader>
                </v-container>
                <v-container class="pa-0" v-else-if="!loading && menu">
                    <div is="transition-group" name="list">
                        <MenuCard v-for="item in menu" :key="item.id" :item="item"/>
                    </div >
                </v-container>
            </v-col>
        </v-row>
    </section>
</template>

<script>
import Alert from '../../components/shared/Alert';
import MenuCard from '../../components/venue/MenuCard';
export default {
    components: {
        Alert,
        MenuCard
    },
    computed: {
        loading() {
            return this.$store.getters['menu/loadingMenu'];
        },
        error() {
            return this.$store.getters['menu/error'];
        },
        menu() {
            return this.$store.getters['menu/menu'];
        },
    },
    methods: {
        onDismissed() {
            this.$store.dispatch('menu/clearError');
        }
    },
    mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        this.$store.dispatch('menu/loadMenu');
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