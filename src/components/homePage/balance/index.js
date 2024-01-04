import { Box, Typography } from '@mui/material';
import { React } from 'react';

const UserBalancePane = ({ balance }) => {

  const balanceCard = (text) => {
    return(
      <Box        
        sx={{  
          width: '80%',       
          backgroundColor: 'white',
          borderRadius: '0.5em', 
          height: '5em', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          borderColor: '#a3a3a3',          
        }}
        mb={4}
      >
        <Typography
          variant='h6'
          sx={{
            fontFamily: 'var(--bs-font-sans-serif)',
            fontWeight: '600'
          }}
        >
          {text}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{height: '100%'}}>
      <Typography
        variant='h5'
        sx={{
          fontFamily: 'var(--bs-font-sans-serif)',
          fontWeight: '600'
        }}
        mb={2}
      >
        Total Mensal
      </Typography>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
      >
        {balanceCard(`Mês Anterior R$ ${balance.toFixed(2)}`)}
        {balanceCard(`Mês Atual R$ ${balance.toFixed(2)}`)}
        {balanceCard(`Mês Seguinte R$ ${balance.toFixed(2)}`)}
      </Box>
      

      </Box>
  );

}

export default UserBalancePane;