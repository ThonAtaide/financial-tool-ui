import { useState } from "react"
import { useApiRequestStatelessHook } from "../api-request-simple";

export const useApiRequestWithStateResult = ({ initialValue = null, apiRequest }) => {

  const [data, setData] = useState(initialValue);
  const { statelessRequestApi, isLoading } = useApiRequestStatelessHook({apiRequest});  

  const statefullRequestApi = async (requestArguments) => {
    await statelessRequestApi(requestArguments)
      .then(data => {
        setData(data);
      });
  }

  return { data, isLoading, statefullRequestApi };
}