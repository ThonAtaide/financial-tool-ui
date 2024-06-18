import axios from 'axios';
import { config } from '../properties';
const { BACKEND_URL } = config;

export const axios_client = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
});
