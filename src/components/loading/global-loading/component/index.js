import React from 'react'
import { useGlobalLoading } from '../provider'
import { Backdrop, Box, CircularProgress } from '@mui/material';

const GlobalLoading = () => {
  const { value, finishLoading } = useGlobalLoading();

  return (value &&
    <Box sx={{ display: 'flex' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={value}
        onClick={finishLoading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Box>
  )
}

export default GlobalLoading;