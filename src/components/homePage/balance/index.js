import { Box, Typography } from '@mui/material';
import { React } from 'react';
import { formatBRLCurrency } from '../../../utils/currencyFormatter';
import LinearProgress from '@mui/material/LinearProgress';

const UserBalancePane = ({ balance, fixedExpenseInfo }) => {  

  const getFixedExpenseChartValue = ({amountTotal, fixedTotal}) => {
    if (!amountTotal || amountTotal === 0){
      return 0;
    } else {
      return (fixedTotal / amountTotal) * 100;
    }
  }

  const balanceCard = (text) => {
    return (
      <Box
        sx={{
          width: '80%',
          backgroundColor: '#f3a7b5',
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

  const linearChart = (text, value) => {
    return (
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        sx={{
          width: '80%',
          backgroundColor: '#a5d7d6',
          borderRadius: '0.5em',
          height: '5em',
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
        <Box
          display='flex'
          justifyContent='center'
          maxWidth
        >
          <LinearProgress
            variant="determinate" 
            color='primary' 
            sx={{ height: '1.5em', width: '20em', borderRadius: '4px' }} 
            value={value}                        
          />
        </Box>
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
        {balanceCard(`Despesas Totais ${formatBRLCurrency(balance)}`)}
        {linearChart(`Despesas Fixas - ${getFixedExpenseChartValue(fixedExpenseInfo).toFixed(2)}%`, getFixedExpenseChartValue(fixedExpenseInfo))}
      </Box>

    </Box>
  );

}

export default UserBalancePane;