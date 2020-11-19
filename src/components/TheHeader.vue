<template>
    <v-app-bar app color="primary" flat>
        <router-link to="/">
            <v-toolbar-title class="headline grey--text text--lighten-5 font-weight-bold">
                Concery
            </v-toolbar-title>
        </router-link> 
        <v-spacer></v-spacer>
        <div v-if="!user">
            <v-btn href="/login" class="primary--text mr-2" depressed>login</v-btn>
            <v-btn href="/signup" class="grey--text text--lighten-5" outlined depressed>signup</v-btn>  
        </div>
        <v-btn @click="handleLogout" class="primary--text" depressed v-else :loading="loading">logout</v-btn>
    </v-app-bar>
</template>

<script>
export default {
    computed: {
        user() {
            return this.$store.getters.user ? this.$store.getters.user.name : null;
        },
        loading () {
            return this.$store.getters.loading;
        }
    }, 
    methods: {
        handleLogout() {
            this.$store.dispatch('logout')
        }
    }
}
</script>