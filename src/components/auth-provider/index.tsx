import React, { createContext, useContext, useState } from 'react'

export type AuthenticatedUserDataContextType = {
  userData: UserDataType | null;
  setAuthenticatedUserData: (userData: UserDataType) => void;
  clearAuthenticatedUserData: () => void;
};

export type UserDataType = {
  name: string
}

const AuthenticationDataContext = createContext<AuthenticatedUserDataContextType | null>(null);

export const AuthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [userData, setUserData] = useState<UserDataType | null>(null);

  const setAuthenticatedUserData = (newUserData: UserDataType) => setUserData(newUserData)

  const clearAuthenticatedUserData = () => setUserData(null)
  

  return (
    <AuthenticationDataContext.Provider value={{ userData, setAuthenticatedUserData, clearAuthenticatedUserData }}>
      {children}
    </AuthenticationDataContext.Provider>
  )
}

export const useAuthData = () => useContext(AuthenticationDataContext)