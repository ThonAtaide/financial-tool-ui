import React from 'react'

export type GlobalLoadingContextType = {
  isLoading: boolean;
  startLoading: () => void;
  finishLoading: () => void;
};

export const GlobalLoadingContext = React.createContext<GlobalLoadingContextType | null>(null);

export const GlobalLoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const startLoading = () => setIsLoading(true);

  const finishLoading = () => setIsLoading(false)

  return <GlobalLoadingContext.Provider value={{ isLoading, startLoading, finishLoading }}>
    {children}
  </GlobalLoadingContext.Provider>
}

export const useGlobalLoading = () => React.useContext(GlobalLoadingContext)


