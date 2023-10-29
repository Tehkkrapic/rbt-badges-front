import axios from "axios";
import router from "../router";

let ax = axios.create({
    baseURL: import.meta.env.VITE_API_BACKEND_URL,
    withCredentials: true
})

ax.interceptors.response.use(response => {
    return response
}, error => {
    if(error.response && error.response.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        router.push('/login')
    }
    return error;
})

export default ax