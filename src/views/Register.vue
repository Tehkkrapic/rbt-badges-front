<template>
    <v-card variant="outlined" style="border: 1px solid;">    
         <div class="d-flex align-center justify-center" style="height: 100vh">
        <v-sheet width="400" class="mx-auto">
            <v-form fast-fail @submit.prevent="register">                
                <v-text-field v-model="email" label="Email"></v-text-field>

                <v-text-field type="password" v-model="password" label="Password"></v-text-field>
                <v-text-field type="password" v-model="confirm_password" label="Confirm Password"></v-text-field>

                <v-btn type="submit" color="blue" block class="mt-2">Sign in</v-btn>
                <v-btn color="blue" @click="logout" block class="mt-2">Logout</v-btn>
             
                <div class="mt-2">
                    <p class="text-body-2">Already registered ? <a href="/login">Login</a></p>
                </div>
            </v-form>
        </v-sheet>
    </div>
</v-card>
</template>

<script setup>
import { ref } from 'vue';
import {useAuthStore} from '../stores/auth'
import router from '../router/index'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
const authStore = useAuthStore()

const email = ref()
const password = ref() 
const confirm_password = ref()

const register = () => {     
    authStore.register(email.value, password.value, confirm_password.value)
    .then(() => {
        toast.info("User registered successfully. Please wait while an administrator confirms your registration", {autoClose: 2000})
        router.push('/login')
    })
    .catch(e => {
        toast.info("An error occured while registering user", {autoClose: 1000})        
        console.log(e)
    })
}

const logout = () => {
    authStore.logout()
}
</script>