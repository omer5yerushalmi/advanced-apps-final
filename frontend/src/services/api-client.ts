import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://localhost:3010',
});

export default apiClient;