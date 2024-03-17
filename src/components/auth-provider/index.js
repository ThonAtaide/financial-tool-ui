import React, { createContext, useState, useContext } from 'react'

const AuthDataContext = createContext();

export const AuthDataProvider = ({ children }) => {
  
   const [userData, setUserData] = useState(null);   
   
   const storeUserData = ({nickname}) => setUserData({ nickname })    
   
    const clearUserData = () => setUserData(null)
   
   return (
     <AuthDataContext.Provider value={{ userData, storeUserData, clearUserData }}>
       {children}
     </AuthDataContext.Provider>
    )
}

export const useAuthData = () => useContext(AuthDataContext)