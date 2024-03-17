import React, { createContext, useState, useContext } from 'react'

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  
   const [value, setValue] = useState();
   
   const triggerPopup = ({
    severity,
    title,
    message}) => setValue({show: true, severity, title, message})
   
    const triggerSuccessPopup = ({
      title,
      message
    }) => {
      console.log('calling success pop up')
      triggerPopup({severity: 'success', title, message})
    }

    const triggerErrorPopup = ({
      title,
      message
    }) => {
      triggerPopup({severity: 'error', title, message})
    }
   
    const clearPopup = () => setValue({})
   
   return (
     <PopupContext.Provider value={{ value, triggerSuccessPopup, triggerErrorPopup, clearPopup }}>
       {children}
     </PopupContext.Provider>
    )
}

export const usePopup = () => useContext(PopupContext)