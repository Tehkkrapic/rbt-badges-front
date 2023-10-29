import { defineStore } from 'pinia'
import axios from '../plugins/axios';
import router from '../router';
import { toast } from 'vue3-toastify';

export const useAuthStore = defineStore('auth', {
    state: () => ({ currentUser: null}),
    getters: {
        isLoggedIn() {
            return this.currentUser ? true : false;
        },
        getCurrentUser() {
            return this.currentUser;
        }
    },
    actions: {
        async getCorsToken() {
            axios
                .get('/sanctum/csrf-cookie')
                .then(response => {
                })
                .catch(e => {
                    console.log(e)
                })
        },

        async setCurrentUser() {
            this.currentUser = (await axios.get('/api/user')).data
        },
        
        async login(email, password) {
            await this.getCorsToken()
            return axios.post('/login', {email, password})
            .then(async res => {
                if(res && res.response && res.response.status === 422) {
                    toast("An error has occured while signing into the website", {autoClose: 2000, type: 'error'})
                    return
                }
                await this.setCurrentUser()
            })
        },

        async register(email, password, confirm_password) {
            await this.getCorsToken()
            await axios.post('/register', {email, password, password_confirmation: confirm_password})  
        },

        async logout() {
            await axios.post('/logout');
            this.currentUser=null;
            localStorage.clear();
            sessionStorage.clear();
            router.push('/login')
        }
    },
    persist: true
})
