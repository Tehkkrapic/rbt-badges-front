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
                    console.log("CORS")
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
                console.log(res)                
                await this.setCurrentUser()
                console.log(this.currentUser)    
            })
            .catch(e => {
                toast.info(e.response.data.message, {autoClose: 2000})
                throw e
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
