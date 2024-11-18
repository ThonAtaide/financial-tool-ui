import React, { useEffect } from 'react'
import { PopupProviderContextType, usePopup } from '../provider'
import { Alert, AlertTitle, Box } from '@mui/material';

const Popup: React.FC = () => {
  const { show, data, clearPopup } = usePopup() as PopupProviderContextType;
  const {
    severity,
    title,
    message
  } = data || {};

  useEffect(() => {    
    if (show) {
      const timer = setTimeout(() => {
        clearPopup()
      }, 3000)
      return () => clearTimeout(timer)
    }
    
  }, [show])

  return (show &&
    <Box      
      sx={{
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        top: 0,
        width: '100%'
      }}
    >
      <Alert
        severity={severity}
        onClose={() => clearPopup()}
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  )
}

export default Popup