import axios from "axios";
import router from "../router";

let ax = axios.create({
    baseURL:'http://localhost:8000',
    withCredentials: true
})
//axios.defaults.baseURL = 'http://localhost:8000'
//axios.defaults.withCredentials = true

ax.interceptors.response.use(response => {
    return response
}, error => {
    if(error.response && error.response.status === 401) {
        console.log("BAS TU")
        localStorage.clear();
        router.push('/login')
    }
    return error;
})

export default ax