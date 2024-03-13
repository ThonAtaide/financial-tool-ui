import { useState } from "react"
import { useApiRequestSimple } from "../api-request-simple";

export const useApiRequestWithStateResult = ({ initialValue = null, apiRequest }) => {

  const [data, setData] = useState(initialValue);
  const { statelessRequestApi, isLoading } = useApiRequestSimple({apiRequest});  

  const statefullRequestApi = async (requestArguments) => {
    await statelessRequestApi(requestArguments)
      .then(data => {
        setData(data);
      });
  }

  return { data, isLoading, statefullRequestApi };
}