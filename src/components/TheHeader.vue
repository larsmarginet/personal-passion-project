<template>
    <v-app-bar app color="primary" flat>
        <router-link to="/">
            <v-toolbar-title class="headline grey--text text--lighten-5 font-weight-bold">
                Concery
            </v-toolbar-title>
        </router-link> 
        <v-spacer></v-spacer>
        <v-btn href="/login" class="primary--text mr-2" depressed>login</v-btn>
        <v-btn href="/signup" class="grey--text text--lighten-5" outlined depressed>signup</v-btn>
    </v-app-bar>
</template>