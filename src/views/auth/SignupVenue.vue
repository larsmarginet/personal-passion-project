<template>
    <section class="mx-auto mt-5" style="maxWidth: 600px">
        <BackButton link="/signup/choose"/>
        <v-card flat class="mx-auto mt-2 mb-10" rounded="xl">
            <v-expand-transition>
                <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
            </v-expand-transition>
            <v-card-title class="justify-center">
                <h2 class="primary--text mt-5 mb-2">Sign up</h2>
            </v-card-title>
            <v-form ref="form" class="px-8 pb-5">
                <v-container>
                    <p :class="`${fileError ? 'error--text': 'grey--text text--darken-1'} mb-1`">Logo</p>
                    <FileDrop @fileDropped="handleUploadFile" @fileRemoved="handleRemoveFile" :rules="imageRules"/>
                    <p v-if="fileError" class="error--text caption">{{fileError}}</p>
                </v-container>
                <v-text-field validate-on-blur label="Venue name" v-model="name" prepend-icon="storefront" :rules="nameRules" clearable counter="25"></v-text-field>
                <v-text-field validate-on-blur label="Email" v-model="email" prepend-icon="email" :rules="emailRules" clearable></v-text-field>
                <v-text-field validate-on-blur :append-icon="show ? 'visibility' : 'visibility_off'" :type="show ? 'text' : 'password'" label="Password" v-model="password" prepend-icon="vpn_key" :rules="passwordRules" clearable @click:append="show = !show"></v-text-field>
                <v-text-field validate-on-blur :append-icon="show ? 'visibility' : 'visibility_off'" :type="show ? 'text' : 'password'"  label="Password Confirm" v-model="passwordConfirm" prepend-icon="vpn_key" :rules="passwordConfirmRules" clearable @click:append="show = !show"></v-text-field>
                <v-btn aria-label="continue" color="primary" class="mt-2 ml-8" @click="handleSignup" depressed :loading="loading">Continue</v-btn>
            </v-form>
            <v-divider></v-divider>
            <v-card-text>
                <p class="text-center">Already have an account? <router-link to="/login">Login</router-link></p>
            </v-card-text>
        </v-card>
    </section>
</template>

<script>
import { nameRules, imageRules, emailRules, passwordRules } from '../../helpers/validationRules';
import Alert from '../../components/shared/Alert';
import FileDrop from '../../components/shared/FileDrop';
import BackButton from '../../components/shared/BackButton';
export default {
    name: 'SignupVenue',
    components: {
        Alert,
        FileDrop,
        BackButton
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
            imageRules,
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
            return this.$store.getters['auth/loading'];
        },
        error() {
            return this.$store.getters['auth/errors'];
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
                this.$store.dispatch('auth/signup', user);
            }
        }, 
        onDismissed() {
            this.$store.dispatch('auth/clearError');
        }
    },
    mounted() {
        this.$store.dispatch('setLoadingComponent', false)
    }
}
</script>