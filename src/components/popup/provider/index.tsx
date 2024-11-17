import { AlertColor } from '@mui/material'
import React, { createContext, useState, useContext } from 'react'

export type PopupProviderContextType = {
  show: boolean
  data: PopData | null,
  displaySuccessPopup: (title: string, message: string) => void,
  displayErrorPopup: (title: string, message: string) => void,
  clearPopup: () => void
}

export type PopData = {
  severity: AlertColor,
  title: string | null,
  message: string | null
}

const PopupContext = createContext<PopupProviderContextType | null>(null);

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [show, setShow] = useState<boolean>(false);
  const [data, setData] = useState<PopData | null>(null);

  const triggerPopup = (
    severity: AlertColor,
    title: string | null,
    message: string | null
  ) => {

    setData({ severity, title, message })
    setShow(true);
  }

  const displaySuccessPopup = (
    title: string | null,
    message: string | null
  ) => triggerPopup('success', title, message)

  const displayErrorPopup = (
    title: string | null,
    message: string | null
  ) => {
    triggerPopup('error', title, message)
  }

  const clearPopup = () => {
    setShow(false)
    setData(null);
  }

  return (
    <PopupContext.Provider value={{ show, data, displaySuccessPopup, displayErrorPopup, clearPopup }}>
      {children}
    </PopupContext.Provider>
  )
}

export const usePopup = () => useContext(PopupContext)