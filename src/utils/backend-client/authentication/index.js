import { hookCheckAuthentication } from "..";
import { config } from '../../properties';
const { BACKEND_URL } = config;

export const login = async ({username, password, unnathorized_redirect}) => {
    return hookCheckAuthentication({
        request: () => fetch(`${BACKEND_URL}/sign-in`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredntials: true,
            credentials: 'include',
            body: JSON.stringify({ username, password })
        }),
        expected_status: 200,
        unnathorized_redirect
    });
};

export const logout = async ({unnathorized_redirect}) => {
    return hookCheckAuthentication({
        request: () => fetch(`${BACKEND_URL}/sign-out`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredntials: true,
            credentials: 'include'
        }),
        expected_status: 204,
        unnathorized_redirect
    });
};