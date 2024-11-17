import axios, { AxiosInstance } from 'axios';
import { config } from '../../configuration/properties';
const { BACKEND_URL } = config;

export const axios_client: AxiosInstance = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
});
