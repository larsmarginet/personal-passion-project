<template>
    <v-container>
        <h2 hidden>Rooms</h2>
        <v-row>
            <v-col cols="12" md="3" order-md="2" offset-md="12">
                <v-row justify="end" justify-md="start" class="px-4">
                    <v-btn href="/band/songs/create" depressed color="primary">Add song</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" md="9" lg="6" order-md="1">
                <v-expand-transition>
                    <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
                </v-expand-transition>
                <v-container v-if="loading">
                    <v-skeleton-loader type="list-item-avatar" class="mb-4" v-for="n in 5" :key="n"></v-skeleton-loader>
                </v-container>
                <v-container class="pa-0" v-else-if="!loading && songs">
                    <transition-group name="list">
                      
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
        Alert,
    },
    computed: {
        loading() {
            return this.$store.getters['songs/loadingSongs'];
        },
        error() {
            return this.$store.getters['songs/error'];
        },
        songs() {
            return this.$store.getters['songs/songs'];
        },
    },
    methods: {
        onDismissed() {
            this.$store.dispatch('songs/clearError');
        }
    },
    mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        this.$store.dispatch('songs/loadSongs');
    }
}
</script>