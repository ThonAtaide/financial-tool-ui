import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../popup/provider";

export const useApiRequestSimple = ({ apiRequest }) => {
  
  const [isLoading, setLoading] = useState(false);
  const { triggerErrorPopup } = usePopup();
  const navigate = useNavigate();

  const handleError = (err) => {
    console.log(err);
    setLoading(false);
    if (!err.response) {
      throw {title: 'Server connection error', message: 'Server connection fail.'}
    }

    const { title, errors } = err.response.data;
    triggerErrorPopup({ title, message: errors[0] })
    
    if (err.response.status === 401) {      
      navigate('/login');
    }
    throw err;
  }

  const statelessRequestApi = async (requestArguments) => {    
    setLoading(true);
    return await apiRequest(requestArguments)
      .then((res) => {        
        setLoading(false);
        return res.data;
      })
      .catch(err => handleError(err));
  }

  return { isLoading, statelessRequestApi };
}