import { useState } from "react"
import { ApiRequestI, useApiRequestStatelessHook } from "../api-request-simple";
import { AxiosResponse } from "axios";

export interface UseApiRequestStateful<T, U> {
  initialValue: U | null,
  apiRequest: ((input: T) => Promise<AxiosResponse<U>>) | (() => Promise<AxiosResponse<U>>)
}

export const useApiRequestWithStateResult = <T, U>(useApiRequestStateful: UseApiRequestStateful<T, U>) => {

  const {
    initialValue,
    apiRequest
  } = useApiRequestStateful;

  const [data, setData] = useState<U | null>(initialValue);
  const { executeStatelessRequest, isLoading } = useApiRequestStatelessHook({apiRequest});  

  const statefullRequestApi = (requestArguments: T) => {
    executeStatelessRequest(requestArguments)
      .then(data => {
        console.log('Retornou')
        console.log(data)
        setData(data)
      })
      .catch(err => console.log(err));
  }

  return { data, isLoading, statefullRequestApi };
}