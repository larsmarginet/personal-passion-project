<template>
    <v-card max-width="600px" flat class="mx-auto my-10" rounded="xl">
        <v-expand-transition>
            <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
        </v-expand-transition>
        <v-card-title class="justify-center">
            <h2 class="primary--text mt-5 mb-2">Sign up</h2>
        </v-card-title>
        <v-form ref="form" class="px-8 pb-5">
            <v-container>
                <p :class="`${fileError ? 'error--text': 'grey--text text--darken-1'} mb-1`">Logo</p>
                <FileDrop @fileDropped="handleUploadFile" @fileRemoved="handleRemoveFile" :rules="logoRules"/>
                <p v-if="fileError" class="error--text caption">{{fileError}}</p>
            </v-container>
            <v-text-field validate-on-blur label="Venue name" v-model="name" prepend-icon="storefront" :rules="nameRules" clearable counter="25"></v-text-field>
            <v-text-field validate-on-blur label="Email" v-model="email" prepend-icon="email" :rules="emailRules" clearable></v-text-field>
            <v-text-field validate-on-blur :append-icon="show ? 'visibility' : 'visibility_off'" :type="show ? 'text' : 'password'" label="Password" v-model="password" prepend-icon="vpn_key" :rules="passwordRules" clearable @click:append="show = !show"></v-text-field>
            <v-text-field validate-on-blur :append-icon="show ? 'visibility' : 'visibility_off'" :type="show ? 'text' : 'password'"  label="Password Confirm" v-model="passwordConfirm" prepend-icon="vpn_key" :rules="passwordConfirmRules" clearable @click:append="show = !show"></v-text-field>
            <v-btn color="primary" class="mt-2 ml-8" @click="handleSignup" depressed :loading="loading">Continue</v-btn>
        </v-form>
        <v-divider></v-divider>
        <v-card-text>
            <p class="text-center">Already have an account? <router-link to="/login">Login</router-link></p>
        </v-card-text>
    </v-card>
</template>

<script>
import { nameRules, logoRules, emailRules, passwordRules } from '../../helpers/signupRules'
import Alert from '../../components/shared/Alert';
import FileDrop from '../../components/shared/FileDrop';
export default {
    name: 'SignupVenue',
    components: {
        Alert,
        FileDrop
    },
    data() {
        return {
            name: '',
            logo: null,
            email: '',
            password: '',
            passwordConfirm: '',
            show: false,
            fileError: null,
            nameRules,
            logoRules,
            emailRules,
            passwordRules,
            passwordConfirmRules: [
                v => !!v || 'Please confirm your password',
                v => v === this.password || 'Please make sure your password matches'  
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
        handleUploadFile(file) {
            this.fileError = null;
            this.logo = file;
        },
        handleRemoveFile() {
            this.logo = null;
        },
        handleSignup() {
            if (!this.logo) {
                this.fileError = 'You are required to upload a logo';
                return;
            }
            if (this.$refs.form.validate()) {
                const user = {
                    name: this.name,
                    logo: this.logo,
                    email: this.email,
                    password: this.password,
                    type: 'venue'
                }
                this.$store.dispatch('signup', user);
            }
        }, 
        onDismissed() {
            this.$store.dispatch('clearError');
        }
    }
}
</script>