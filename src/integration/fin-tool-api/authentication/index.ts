import { AxiosResponse } from "axios";
import { axios_client } from "..";
import { LoginResponse, UserRegisterResponse } from "../responses";
import { LoginRequest, UserRegisterRequest } from "../requests";

export const sign_in = async (requestBody: LoginRequest): Promise<AxiosResponse<LoginResponse>> => 
  await axios_client.post<LoginResponse>(
    '/user/sign-in',
    JSON.stringify(requestBody)
  );

export const logout = async (): Promise<void> =>
  await axios_client.post(
    '/user/sign-out',
    {}
  );

export const registerNewUser = async (requestBody: UserRegisterRequest): Promise<AxiosResponse<UserRegisterResponse>> =>
  await axios_client.post<UserRegisterResponse>(
    '/user/sign-up',
    JSON.stringify(requestBody)
  );
