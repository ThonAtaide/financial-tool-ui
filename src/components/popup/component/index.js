import React, { useEffect } from 'react'
import { usePopup } from '../provider'
import { Alert, AlertTitle, Box } from '@mui/material';

const Popup = () => {
  console.log('loop')
  const { value, clearPopup } = usePopup();
  const {
    show,
    severity,
    title,
    message
  } = value || {};

  useEffect(() => {    
    if (show) {
      const timer = setTimeout(() => {
        clearPopup()
      }, 3000)
      return () => clearTimeout(timer)
    }
    
  }, [value])

  return (show &&
    <Box
      maxWidth
      sx={{
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
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