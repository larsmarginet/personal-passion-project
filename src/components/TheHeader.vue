<template>
    <div>
        <v-app-bar app color="primary" flat>
            <v-progress-linear :active="loadingComponent" :indeterminate="loadingComponent" absolute bottom color="light-blue accent-4"></v-progress-linear>
            <v-app-bar-nav-icon class="grey--text text--lighten-5 hidden-lg-and-up" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <router-link to="/" v-show="!currentUser || !drawer">
                <v-toolbar-title >
                    <h1 class="headline grey--text text--lighten-5 font-weight-bold ml-3">Concery</h1>
                </v-toolbar-title>
            </router-link>
            <v-spacer></v-spacer>
            <div v-if="!currentUser">
                <v-btn href="/login" class="primary--text mr-2" depressed>login</v-btn>
                <v-btn href="/signup/choose" class="grey--text text--lighten-5" outlined depressed>signup</v-btn>  
            </div>
            <v-layout justify-end align-center v-else>
                <v-menu offset-y transition="slide-y-transition">
                    <template v-slot:activator="{ on, attrs }">
                        <v-avatar color="grey lighten-5" v-bind="attrs" v-on="on">
                            <img :src="avatar" :alt="currentUser" v-if="avatar">
                            <v-icon class="primary--text" large v-else>account_circle</v-icon>
                        </v-avatar>
                    </template>
                    <v-list>
                        <v-list-item :to="profile">
                            <v-icon class="mr-2">account_circle</v-icon>
                            <v-list-item-title>Profile</v-list-item-title>
                        </v-list-item>
                        <v-list-item link>
                            <v-icon class="mr-2">exit_to_app</v-icon>
                            <v-list-item-title @click="handleLogout">Log out</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-layout>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" app class="primary" v-if="currentUser" :permanent="$vuetify.breakpoint.lgAndUp">
            <v-layout column class="pt-4">
                <router-link to="/">
                    <span class="headline grey--text text--lighten-5 font-weight-bold px-5 mt-5">Concery</span>
                </router-link>
            </v-layout>
            <v-list class="mt-2">
                <v-list-item v-for="link in links" :key="link.text" :to="link.route">
                    <v-list-item-action>
                        <v-icon class="white--text">{{link.icon}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="white--text">{{link.text}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            drawer: false,
            venueLinks: [
                { icon: 'event', text: 'Events', route: '/venue/events' },
                { icon: 'fastfood', text: 'Food & drinks', route: '/venue/menu' },
                { icon: 'room', text: 'Rooms', route: '/venue/rooms' },
            ],
            bandLinks: [
                { icon: 'event', text: 'Events', route: '/band/events' },
                { icon: 'checkroom', text: 'Merchandise', route: '/band/merch' },
                { icon: 'album', text: 'Songs', route: '/band/songs' },
            ]
        }
    },
    computed: {
        user() {
            return this.$store.getters['auth/user'] ? this.$store.getters['auth/user'] : null;
        },
        currentUser() {
            return this.user ? this.user.name : null;
        },
        loading () {
            return this.$store.getters['auth/loading'];
        },
        loadingComponent() {
            return this.$store.getters['loadingComponent'];
        },
        links() {
            return this.user ? this.user.type === 'venue' ? this.venueLinks : this.bandLinks : [];
        },
        avatar() {
            return this.user ? this.user.logoUrl : null;
        },
        profile() {
            return this.user ? this.user.type === 'venue' ? '/venue/profile' : '/venue/profile' : '/';
        }
    }, 
    methods: {
        handleLogout() {
            this.$store.dispatch('auth/logout')
        }
    }
}
</script>