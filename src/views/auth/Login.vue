<template>
    <v-card max-width="600px" flat class="mx-auto my-10" rounded="xl">
        <v-expand-transition>
            <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
        </v-expand-transition>
        <v-card-title class="justify-center">
            <h2 class="primary--text mt-5 mb-2">Login</h2>
        </v-card-title>
         <v-form ref="form" class="px-8 pb-5">
            <v-text-field validate-on-blur label="Email" v-model="email" prepend-icon="email" :rules="emailRules" clearable></v-text-field>
            <v-text-field validate-on-blur :append-icon="show ? 'visibility' : 'visibility_off'" :type="show ? 'text' : 'password'" label="Password" v-model="password" prepend-icon="vpn_key" :rules="passwordRules" clearable @click:append="show = !show"></v-text-field>
            <v-btn color="primary" class="mt-2 ml-8" @click="handleLogin" depressed :loading="loading">Continue</v-btn>
        </v-form>
        <v-divider></v-divider>
        <v-card-text>
            <p class="text-center">Don't have an account yet? <router-link to="/signup">Signup</router-link></p>
        </v-card-text>
    </v-card>
</template>

<script>
import Alert from '../../components/shared/Alert'
export default {
    name: 'Login',
     components: {
        Alert
    },
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
    }, 
    computed: {
        loading () {
            return this.$store.getters.loading;
        },
        error() {
            return this.$store.getters.error;
        }
    },
    methods: {
        handleLogin() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('login', {email: this.email, password: this.password})
            }
        }, 
        onDismissed() {
            this.$store.dispatch('clearError');
        }
    }
}
</script>