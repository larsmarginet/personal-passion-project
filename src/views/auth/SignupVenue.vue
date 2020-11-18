<template>
    <v-card max-width="600px" flat class="mx-auto my-10" rounded="xl">
        <v-card-title class="justify-center">
            <h2 class="primary--text mt-5 mb-2">Sign up</h2>
        </v-card-title>
         <v-form ref="form" class="px-8 pb-5">
            <v-text-field validate-on-blur label="Venue name" v-model="name" prepend-icon="storefront" :rules="nameRules" clearable counter="25"></v-text-field>
            <v-file-input validate-on-blur label="Logo" show-size v-model="logo" accept="image/png, image/jpeg" :rules="logoRules" prepend-icon="add_a_photo" clearable></v-file-input>
            <v-text-field validate-on-blur label="Email" v-model="email" prepend-icon="email" :rules="emailRules" clearable></v-text-field>
            <v-text-field validate-on-blur :append-icon="show ? 'visibility' : 'visibility_off'" :type="show ? 'text' : 'password'" label="Password" v-model="password" prepend-icon="vpn_key" :rules="passwordRules" clearable @click:append="show = !show"></v-text-field>
            <v-text-field validate-on-blur :append-icon="show ? 'visibility' : 'visibility_off'" :type="show ? 'text' : 'password'"  label="Password Confirm" v-model="passwordConfirm" prepend-icon="vpn_key" :rules="passwordConfirmRules" clearable @click:append="show = !show"></v-text-field>
            <v-btn color="primary" class="mt-2" @click="handleSignup" depressed>Continue</v-btn>
        </v-form>
        <v-divider></v-divider>
        <v-card-text>
            <p class="text-center">Already have an account? <router-link to="/login">Login</router-link></p>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: 'Signup',
    data() {
        return {
            name: '',
            logo: null,
            email: '',
            password: '',
            passwordConfirm: '',
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
            ]
        }
    }, methods: {
        handleSignup() {
            if (this.$refs.form.validate()) {
                const user = {
                    name: this.name,
                    logo: this.logo,
                    email: this.email,
                    password: this.password,
                    type: 'venue'
                }
                this.$store.dispatch('signup', user)
            }
        }
    }
}
</script>