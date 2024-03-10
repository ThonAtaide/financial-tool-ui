import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../popup/provider";



export const useBackendApi = ({ initialValue = null, apiRequest }) => {

  const [data, setData] = useState(initialValue);
  const [isLoading, setLoading] = useState(false);
  const { triggerErrorPopup } = usePopup();
  const navigate = useNavigate();

  const handleError = (err) => {
    setLoading(false);
    const { title, errors } = err.response.data;
    triggerErrorPopup({ title, message: errors[0] })
    
    if (err && err.response && err.response.status === 401) {      
      navigate('/login');
    }
    throw err;
  }

  const callApi = async (requestArguments) => {
    console.log(apiRequest)
    setLoading(true);
    await apiRequest(requestArguments)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => handleError(err));
  }

  return { data, isLoading, callApi };
}