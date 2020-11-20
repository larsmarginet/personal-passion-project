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
            <v-stepper v-model="stepper" flat max-width="600px" class="elevation-0">
                <v-stepper-header class="elevation-0">
                    <v-stepper-step :complete="stepper > 1" step="1">General info</v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step :complete="stepper > 2" step="2">Social media</v-stepper-step>
                </v-stepper-header>
                <v-divider></v-divider>
                <v-stepper-items > 
                    <v-stepper-content step="1">
                        <v-form ref="generalForm" class="pb-5">
                        <v-container>
                                <p :class="`${fileError ? 'error--text': 'grey--text text--darken-1'} mb-1`">Logo</p>
                                <FileDrop @fileDropped="handleUploadFile" @fileRemoved="handleRemoveFile" :rules="logoRules"/>
                                <p v-if="fileError" class="error--text caption">{{fileError}}</p>
                            </v-container>
                            <v-text-field validate-on-blur label="Band name" v-model="name" prepend-icon="album" :rules="nameRules" clearable counter="25"></v-text-field>
                            <v-text-field validate-on-blur label="Email" v-model="email" prepend-icon="email" :rules="emailRules" clearable></v-text-field>
                            <v-text-field validate-on-blur :append-icon="show ? 'visibility' : 'visibility_off'" :type="show ? 'text' : 'password'" label="Password" v-model="password" prepend-icon="vpn_key" :rules="passwordRules" clearable @click:append="show = !show"></v-text-field>
                            <v-text-field validate-on-blur :append-icon="show ? 'visibility' : 'visibility_off'" :type="show ? 'text' : 'password'"  label="Password Confirm" v-model="passwordConfirm" prepend-icon="vpn_key" :rules="passwordConfirmRules" clearable @click:append="show = !show"></v-text-field>
                            <v-btn color="primary" class="mt-2 ml-8" @click="handleNextGeneral" depressed>Continue</v-btn>
                        </v-form>
                    </v-stepper-content>
                    <v-stepper-content step="2">
                        <v-form ref="socialForm" class="pb-5">
                            <v-row align="center">
                                <v-img class="ml-3 mr-2" src="@/assets/facebook.svg" alt="facebook logo" max-width="35" height="35"></v-img>
                                <v-text-field validate-on-blur type="url" label="Facebook" v-model="facebook" :rules="linkRules"></v-text-field>
                            </v-row>
                            <v-row align="center">
                                <v-img class="ml-3 mr-2" src="@/assets/instagram.svg" alt="instagram logo" max-width="35" height="35"></v-img>
                                <v-text-field validate-on-blur type="url" label="Instagram" v-model="instagram" :rules="linkRules"></v-text-field>
                            </v-row>
                            <v-row align="center">
                                <v-img class="ml-3 mr-2" src="@/assets/itunes.svg" alt="itunes logo" max-width="35" height="35"></v-img>
                                <v-text-field validate-on-blur type="url" label="Apple Music" v-model="itunes" :rules="linkRules"></v-text-field>
                            </v-row>
                            <v-row align="center">
                                <v-img class="ml-3 mr-2" src="@/assets/spotify.svg" alt="spotify logo" max-width="35" height="35"></v-img>
                                <v-text-field validate-on-blur type="url" label="Spotify" v-model="spotify" :rules="linkRules"></v-text-field>
                            </v-row>
                            <v-row align="center">
                                <v-img class="ml-3 mr-2" src="@/assets/youtube.svg" alt="youtube logo" max-width="35" height="35"></v-img>
                                <v-text-field validate-on-blur type="url" label="YouTube" v-model="youtube" :rules="linkRules"></v-text-field>
                            </v-row>
                            <v-btn color="primary" class="mr-2 ml-8" text @click="stepper = 1" depressed>Previous</v-btn>
                            <v-btn color="primary" @click="handleSignup" depressed :loading="loading">Continue</v-btn>
                        </v-form>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
            <v-divider></v-divider>
            <v-card-text>
                <p class="text-center">Already have an account? <router-link to="/login">Login</router-link></p>
            </v-card-text>
        </v-card>
    </section>
</template>

<script>
import { nameRules, logoRules, emailRules, passwordRules, linkRules } from '../../helpers/signupRules'
import Alert from '../../components/shared/Alert'
import FileDrop from '../../components/shared/FileDrop';
import BackButton from '../../components/shared/BackButton';
export default {
    name: 'SignupBand',
     components: {
        Alert,
        FileDrop,
        BackButton
    },
    data() {
        return {
            stepper: 1,
            name: '',
            logo: null,
            email: '',
            password: '',
            passwordConfirm: '',
            facebook: '',
            instagram: '',
            itunes: '',
            spotify: '',
            youtube: '',
            show: false,
            fileError: null,
            nameRules,
            logoRules,
            emailRules,
            passwordRules,
            passwordConfirmRules: [
                v => !!v || 'Please confirm your password',
                v => v === this.password || 'Please make sure your password matches'  
            ],
            linkRules
        }
    },
    computed: {
        loading () {
            return this.$store.getters['auth/loading'];
        },
        error() {
            return this.$store.getters['auth/error'];
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
        handleNextGeneral() {
            if (!this.logo) {
                this.fileError = 'You are required to upload a logo';
                return;
            }
            if (this.$refs.generalForm.validate()) {
                this.stepper = 2;
            }
        },
        handleSignup() {
            if (!this.logo) {
                this.fileError = 'You are required to upload a logo';
                return;
            }
            if (this.$refs.generalForm.validate() && this.$refs.socialForm.validate()) {
                const user = {
                    name: this.name,
                    logo: this.logo,
                    email: this.email,
                    password: this.password,
                    facebook: this.facebook,
                    instagram: this.instagram,
                    itunes: this.itunes,
                    spotify: this.spotify,
                    youtube: this.youtube,
                    type: 'band'
                }
                this.$store.dispatch('auth/signup', user)
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