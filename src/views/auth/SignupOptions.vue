<template>
    <v-card max-width="600px" flat class="mx-auto my-10" rounded="xl">
        <v-card-title class="justify-center mb-2">
           <h2 class="primary--text text-center">Sign up</h2>
       </v-card-title>
       <v-card-subtitle class="text-center">Welcome to Concery. Please chose one of the following options.</v-card-subtitle>
       <v-card-actions>
           <v-layout column justify-center align-center>
               <v-btn name="band" class="primary mb-2" depressed large href="/signup/band">
                   <span>We are a band</span>
                   <v-icon right>arrow_forward_ios</v-icon>
               </v-btn>
               <v-btn name="venue" class="primary mb-8" depressed large href="/signup/venue">
                    <span>We are a venue</span>
                   <v-icon right>arrow_forward_ios</v-icon>
               </v-btn>
           </v-layout>
       </v-card-actions>
       <v-divider></v-divider>
       <v-card-text>
           <p class="text-center">Allready have an account? <router-link to="/login">Login</router-link></p>
       </v-card-text>
    </v-card>
</template>

<script>
export default {
    mounted() {
        this.$store.dispatch('setLoadingComponent', false)
    }
}
</script>
