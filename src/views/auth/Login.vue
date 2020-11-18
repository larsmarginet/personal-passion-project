<template>
    <v-card max-width="600px" flat class="mx-auto my-10" rounded="xl">
        <v-card-title class="justify-center">
            <h2 class="primary--text mt-5 mb-2">Login</h2>
        </v-card-title>
         <v-form ref="form" class="px-8 pb-5">
            <v-text-field validate-on-blur label="Email" v-model="email" prepend-icon="email" :rules="emailRules" clearable></v-text-field>
            <v-text-field validate-on-blur :append-icon="show ? 'visibility' : 'visibility_off'" :type="show ? 'text' : 'password'" label="Password" v-model="password" prepend-icon="vpn_key" :rules="passwordRules" clearable @click:append="show = !show"></v-text-field>
            <v-btn color="primary" class="mt-2" @click="handleLogin" depressed>Continue</v-btn>
        </v-form>
        <v-divider></v-divider>
        <v-card-text>
            <p class="text-center">Don't have an account yet? <router-link to="/signup">Signup</router-link></p>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: 'Signup',
    data() {
        return {
            email: '',
            password: '',
            show: false,
            emailRules: [ 
                v => !!v || 'Please enter an email', 
                v => /.+@.+/.test(v) || 'E-mail must be valid' 
            ],
            passwordRules: [ 
                v => !!v || 'Please enter a password',
            ]
        }
    }, methods: {
        handleLogin() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('login', {email: this.email, password: this.password})
            }
        }
    }
}
</script>