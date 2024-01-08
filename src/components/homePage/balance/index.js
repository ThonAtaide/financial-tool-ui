import { Box, Typography } from '@mui/material';
import { React, useEffect, useState } from 'react';
import { formatBRLCurrency } from '../../../utils/currencyFormatter';
import LinearProgress from '@mui/material/LinearProgress';
import { fetchUserExpensesGroupedByFixedOrNot } from '../../../utils/backend-client/expenses';
import { Navigate } from 'react-router-dom';

const UserBalancePane = ({ balance, date }) => {

  const [fixedChartValue, setFixedChartValue] = useState(0);

  useEffect(() => {
    const from = date.format('YYYY-MM')
    fetchUserExpensesGroupedByFixedOrNot({ from })
      .then(response => {
        const amountTotal = response.reduce((total, item) => total + item.amount, 0);
        const fixedExpenseAmountTotal = response.filter(item => item.label === 'Fixed').reduce((total, item) => total + item.amount, 0);
        
        if (!amountTotal || amountTotal === 0){
          setFixedChartValue(0);
        } else {
          setFixedChartValue((fixedExpenseAmountTotal / amountTotal) * 100);
        }
      }).catch(err => {
        if (err && err.status === 401) {
          Navigate("/login");
        }
      });
  }, [balance]);

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
        {linearChart(`Despesas Fixas - ${fixedChartValue}%`, fixedChartValue)}
      </Box>

    </Box>
  );

}

export default UserBalancePane;