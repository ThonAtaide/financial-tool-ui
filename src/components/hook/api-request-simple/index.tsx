import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { PopupProviderContextType, usePopup } from "../../popup/provider";
import { AuthenticatedUserDataContextType, useAuthData } from "../../auth-provider";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorResponse } from "../../../integration/fin-tool-api/responses";

export interface ApiRequestI<T, U> {
  apiRequest: (input: T) => Promise<AxiosResponse<U>>
}

export const useApiRequestStatelessHook = <T, U>(param: ApiRequestI<T, U>) => {

  const [isLoading, setLoading] = useState<boolean>(false);

  const { clearAuthenticatedUserData } = useAuthData() as AuthenticatedUserDataContextType;
  const { displayErrorPopup } = usePopup() as PopupProviderContextType;
  const navigate = useNavigate();

  const handleError = (err: AxiosError) => {
    const {
      title,
      errorMessage
    } =( err && err.response && err.response.data as ErrorResponse)
      || { title: 'Houve um erro inesperado.', errorMessage: 'Não foi possível atender a requisição. Por favor tente novamente.' };

    displayErrorPopup(title, errorMessage)

    if (err.response && err.response.status === 401) {
      clearAuthenticatedUserData();
      navigate('/login');
    }
    throw err;

  }

  const executeStatelessRequest = async (requestArguments: T): Promise<U> => {
    setLoading(true);
    return param.apiRequest(requestArguments)
      .then((res) => res.data)
      .catch(err => handleError(err))
      .finally(() => setLoading(false))
  }

  return { isLoading, executeStatelessRequest };
}