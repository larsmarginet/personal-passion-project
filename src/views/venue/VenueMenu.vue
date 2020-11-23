<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="3" order-md="2" offset-md="12">
                <v-row justify="end" justify-md="start" class="px-4">
                    <v-btn href="/venue/menu/create" depressed color="primary">Add item</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" md="9" lg="6" order-md="1">
                <v-expand-transition>
                    <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
                </v-expand-transition>
                <v-container v-if="loading">
                    <v-skeleton-loader type="list-item-avatar" class="mb-4" v-for="n in 5" :key="n"></v-skeleton-loader>
                </v-container>
                <v-container class="pa-0" v-else>
                    <transition-group name="list">

                        <v-skeleton-loader type="list-item-avatar" class="mb-4" v-for="n in 5" :key="n"></v-skeleton-loader>
                    </transition-group>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Alert from '../../components/shared/Alert';
export default {
    components: {
        Alert
    },
    computed: {
        loading() {
            return this.$store.getters['menu/loadingMenu'];
        },
        error() {
            return this.$store.getters['menu/error'];
        },
        events() {
            return this.$store.getters['menu/menu'];
        },
    },
    methods: {
        onDismissed() {
            this.$store.dispatch('menu/clearError');
        },
    },
    mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        this.$store.dispatch('menu/loadMenu');
    }
}
</script>

<style scoped>
.rounded-avatar {
    border-radius: 50%;
}

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
    position: absolute;
}

.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>