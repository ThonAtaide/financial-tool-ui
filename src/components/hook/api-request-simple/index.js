import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../popup/provider";
import { useAuthData } from "../../auth-provider";

export const useApiRequestSimple = ({ apiRequest }) => {
  
  const [isLoading, setLoading] = useState(false);
  const { triggerErrorPopup } = usePopup();
  const navigate = useNavigate();
  const { clearUserData } = useAuthData();

  const handleError = (err) => {    
    
    const { title, errors } = err && err.response && err.response.data 
    || { title: 'Server connection error', errors: ['Server connection fail.']};
    
    triggerErrorPopup({ title, message: errors[0] })
    
    if (err.response.status === 401) {    
      clearUserData();  
      navigate('/login');
    }
    throw err;
  }

  const statelessRequestApi = async (requestArguments) => {    
    setLoading(true);
    return await apiRequest(requestArguments)
      .then((res) => res.data)
      .catch(err => handleError(err))
      .finally(() => setLoading(false))
  }

  return { isLoading, statelessRequestApi };
}