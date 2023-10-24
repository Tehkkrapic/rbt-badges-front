<template>
    <v-card variant="outlined" style="border: 1px solid;">    
        <div class="d-flex flex-column align-center justify-center" style="height: 100vh">
        <img src="@/assets/logo_small.png" class="mb-4"/>
        <v-sheet width="400" class="mx-auto">
            <v-form ref="refForm" @submit.prevent="validateForm">                
                <v-text-field v-model="email" label="Email" :rules="emailRules"></v-text-field>

                <v-text-field type="password" v-model="password" :rules="passwordRules" label="Password" class="mt-2"></v-text-field>

                <v-btn type="submit" :disabled="loading" color="blue" block class="mt-2">Sign in</v-btn>
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
const loading = ref(false)
const refForm = ref(null)

const validateForm = () => {
    refForm.value
    .validate()
    .then(r => {
        if(r.valid) {
            login()
        }           
    })

}

const login = () => {   
    loading.value = true
    authStore.login(email.value, password.value)
    .then(res => {
        loading.value = false
//        toast("Sign in successful", {autoClose: 1000, type: 'success'})
        router.push('/')
    })
    .catch(e => {
        loading.value = false
//        toast("An error has occured while signing into the website", {autoClose: 1000, type: 'error'})
        console.log(e)
    })
}

const emailRules = [
    v => !!v || 'Email is required',
    v => (v && v.length <= 64) || 'Email must be less than 64 characters',
]


const passwordRules = [
    v => !!v || 'Password is required',
]

</script>