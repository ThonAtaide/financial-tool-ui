import { axios_client, handle_axios_response_error, hookCheckAuthentication } from "..";
import { config } from '../../properties';
const { BACKEND_URL } = config;

export const login = async ({username, password}) => {
    return axios_client.post(
        '/sign-in', 
        JSON.stringify({ username, password })
    ).then(res => {
        console.log(res.headers)
        return res.data
    })
    .catch(err => handle_axios_response_error(err));
};

export const logout = async ({unnathorized_redirect}) => {
    return hookCheckAuthentication({
        request: () => fetch(`${BACKEND_URL}/sign-out`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }),
        expected_status: 204,
        unnathorized_redirect
    });
};

export const registerNewUser = ({ username, password, email, nickname }) => {    
    return axios_client.post(
        '/sign-up',
        JSON.stringify({ username, password, email, nickname }) 
        );
}