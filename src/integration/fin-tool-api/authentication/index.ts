import { AxiosResponse } from "axios";
import { axios_client } from "..";
import { LoginResponse, UserRegisterResponse } from "../responses";
import { LoginRequest, PasswordRecoveryRequest, UserRegisterRequest } from "../requests";

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

  export const recovery_password = async (requestBody: PasswordRecoveryRequest): Promise<AxiosResponse<void>> => 
    await axios_client.post<void>(
      '/user/forgotten-password',
      JSON.stringify(requestBody)
    );