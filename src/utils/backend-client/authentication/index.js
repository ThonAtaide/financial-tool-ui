import { axios_client } from "..";

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

export const registerNewUser = async ({ username, password, email, nickname }) => {
  return await axios_client.post(
    '/sign-up',
    JSON.stringify({ username, password, email, nickname })
  );
}