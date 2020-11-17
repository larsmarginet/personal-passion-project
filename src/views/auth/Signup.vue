<template>
     <v-card max-width="600px" class="mx-auto my-10 px-15 pt-7 pb-15 rounded-xl" flat>
         <v-card-title class="justify-center mb-2">
            <h2 class="primary--text text-center">Sign up</h2>
        </v-card-title>
        <v-card-subtitle class="text-center">Welcome to Concery. Please chose one of the following options.</v-card-subtitle>
        <v-card-actions>
            <v-layout column justify-center align-center>
                <v-btn class="primary mb-2" depressed large href="/signupband">
                    <span>We are a band</span>
                    <v-icon right>arrow_forward_ios</v-icon>
                </v-btn>
                <v-btn class="primary" depressed large href="/signupvenue">
                     <span>We are a venue</span>
                    <v-icon right>arrow_forward_ios</v-icon>
                </v-btn>
            </v-layout>
        </v-card-actions>
     </v-card>
</template>