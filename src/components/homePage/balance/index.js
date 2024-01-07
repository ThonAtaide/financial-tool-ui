import { Box, Typography } from '@mui/material';
import { React } from 'react';
import { formatBRLCurrency } from '../../../utils/currencyFormatter';

const UserBalancePane = ({ balance }) => {

  const balanceCard = (text) => {
    return(
      <Box        
        sx={{  
          width: '80%',       
          backgroundColor: '#a5d7d6',
          borderRadius: '0.5em', 
          height: '5em', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center'    
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
    <Box >
      <Typography
        variant='h5'
        sx={{
          fontFamily: 'var(--bs-font-sans-serif)',
          fontWeight: '600'
        }}
        mb={2}
      >
        Informações
      </Typography>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
      >
        {balanceCard(`Gasto Total ${formatBRLCurrency(balance)}`)}
      </Box>
      

      </Box>
  );

}

export default UserBalancePane;