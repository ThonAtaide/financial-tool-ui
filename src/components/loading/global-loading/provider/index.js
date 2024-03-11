import React, { createContext, useState, useContext } from 'react'

const GlobalLoadingContext = createContext();

export const GlobalLoadingProvider = ({ children }) => {
  
   const [value, setValue] = useState(false);
   
   const startLoading = () => setValue(true);
   
    const finishLoading = () => setValue(false)
   
   return (
     <GlobalLoadingContext.Provider value={{ value, startLoading, finishLoading }}>
       {children}
     </GlobalLoadingContext.Provider>
    )
}

export const useGlobalLoading = () => useContext(GlobalLoadingContext)