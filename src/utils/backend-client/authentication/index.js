import { axios_client, handle_axios_response_error, hookCheckAuthentication } from "..";
import { config } from '../../properties';
const { BACKEND_URL } = config;

export const sign_in = async ({ username, password }) => {
  return await axios_client.post(
    '/sign-in',
    JSON.stringify({ username, password })
  )
};

export const logout = async () => {
  return await axios_client.post(
    '/sign-out',
    {}
  );
};

// export const logout = async ({ unnathorized_redirect }) => {
//   return hookCheckAuthentication({
//     request: () => fetch(`${BACKEND_URL}/sign-out`, {
//       method: 'POST',
//       mode: 'cors',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include'
//     }),
//     expected_status: 204,
//     unnathorized_redirect
//   });
// };

export const registerNewUser = async ({ username, password, email, nickname }) => {
  return await axios_client.post(
    '/sign-up',
    JSON.stringify({ username, password, email, nickname })
  );
}