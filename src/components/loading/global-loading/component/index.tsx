import React from 'react'
import { GlobalLoadingContextType, useGlobalLoading } from '../provider'
import { Backdrop, Box, CircularProgress } from '@mui/material';

const GlobalLoading: React.FC<{}> = () => {
  const { isLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;

  return (isLoading &&
    <Box sx={{ display: 'flex' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: 1000 }}
        open={isLoading}
        onClick={finishLoading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Box>
  )
}

export default GlobalLoading;