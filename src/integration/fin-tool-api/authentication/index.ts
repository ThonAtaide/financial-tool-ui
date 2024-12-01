import { AxiosResponse } from "axios";
import { axios_client } from "..";
import { LoginResponse, RecoveryPasswordInfoResponse, UserRefreshResponse, UserRegisterResponse } from "../responses";
import { LoginRequest, PasswordRecoveryRequest, PasswordResetRequest, UserRegisterRequest } from "../requests";

export const sign_in = async (requestBody: LoginRequest): Promise<AxiosResponse<LoginResponse>> =>
  axios_client.post<LoginResponse>(
    '/user/sign-in',
    JSON.stringify(requestBody)
  );

export const logout = async (): Promise<AxiosResponse<void>> => {
  return axios_client.post(
    '/user/sign-out'
  );
}
export const registerNewUser = async (requestBody: UserRegisterRequest): Promise<AxiosResponse<UserRegisterResponse>> =>
  axios_client.post<UserRegisterResponse>(
    '/user/sign-up',
    JSON.stringify(requestBody)
  );

export const recovery_password = async (requestBody: PasswordRecoveryRequest): Promise<AxiosResponse<void>> =>
  axios_client.post<void>(
    '/user/forgotten-password',
    JSON.stringify(requestBody)
  );

export const retrieve_recovery_password_info = async (
  token: string
): Promise<AxiosResponse<RecoveryPasswordInfoResponse>> =>
  axios_client.get<RecoveryPasswordInfoResponse>(
    `/user/forgotten-password/${token}`,
  );

export const reset_password = async (
  passwordResetRequest: PasswordResetRequest
): Promise<AxiosResponse<void>> =>
  axios_client.patch<void>(
    `/user/forgotten-password/${passwordResetRequest.token}`,
    JSON.stringify({password: passwordResetRequest.password})
  );

  export const refresh_user_data = async (): Promise<AxiosResponse<UserRefreshResponse>> =>
    axios_client.get<UserRefreshResponse>(
      `/user/account`,
    );