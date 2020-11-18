<template>
    <v-card max-width="600px" flat class="mx-auto my-10" rounded="xl">
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
                        <v-text-field validate-on-blur label="Band name" v-model="name" prepend-icon="album" :rules="nameRules" clearable counter="25"></v-text-field>
                        <v-file-input validate-on-blur label="Logo" show-size v-model="logo" accept="image/png, image/jpeg" :rules="logoRules" prepend-icon="add_a_photo" clearable></v-file-input>
                        <v-text-field validate-on-blur label="Email" v-model="email" prepend-icon="email" :rules="emailRules" clearable></v-text-field>
                        <v-text-field validate-on-blur :append-icon="show ? 'visibility' : 'visibility_off'" :type="show ? 'text' : 'password'" label="Password" v-model="password" prepend-icon="vpn_key" :rules="passwordRules" clearable @click:append="show = !show"></v-text-field>
                        <v-text-field validate-on-blur :append-icon="show ? 'visibility' : 'visibility_off'" :type="show ? 'text' : 'password'"  label="Password Confirm" v-model="passwordConfirm" prepend-icon="vpn_key" :rules="passwordConfirmRules" clearable @click:append="show = !show"></v-text-field>
                        <v-btn color="primary" class="mt-2" @click="handleNextGeneral" depressed>Continue</v-btn>
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
                        <v-btn color="primary" class="mr-2" text @click="stepper = 1" depressed>Previous</v-btn>
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
</template>

<script>
import Alert from '../../components/shared/Alert'
export default {
    name: 'SignupBand',
     components: {
        Alert
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
            nameRules: [
                v => v.length > 0 || 'Please enter a name',
                v => v.length < 25 || 'Your name can not be more than 25 characters' 
            ],
            logoRules: [
                v => v != null || 'Please upload a logo' ,
                v => !v || v.size < 2000000 || 'Avatar size should be less than 2 MB',
            ],
            emailRules: [ 
                v => !!v || 'Email is required', 
                v => /.+@.+/.test(v) || 'E-mail must be valid' 
            ],
            passwordRules: [ 
                v => !!v || 'Password is required', 
                v => (v && v.length >= 8) || 'Password must have 8+ characters',
                v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character', 
                v => /(?=.*\d)/.test(v) || 'Must have one number', 
                v => /([_.!@$%])/.test(v) || 'Must have one special character'  
            ],
            passwordConfirmRules: [
                v => !!v || 'Please confirm your password',
                v => v === this.password || 'Please make sure your password matches'  
            ],
            linkRules: [
                v => v ? /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(v) || 'Input must be a valid link' : true
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
        handleNextGeneral() {
            if (this.$refs.generalForm.validate()) {
                this.stepper = 2
            }
        },
        handleSignup() {
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
                this.$store.dispatch('signup', user)
            }
        }, 
        onDismissed() {
            this.$store.dispatch('clearError');
        }
    }
}
</script>