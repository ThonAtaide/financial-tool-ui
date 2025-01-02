import React, { useEffect, useState } from 'react';
import { Box, Grid2, Typography } from '@mui/material';
import { formatBRLCurrency } from '../../../utils/currencyFormatter';
import LinearProgress from '@mui/material/LinearProgress';
import { fetchUserExpensesGroupedByFixedOrNot } from '../../../integration/fin-tool-api/expenses';
import { useExpenses, UserExpensesDataCoxtextType } from '../../expenses-provider';
import { useApiRequestStatelessHook } from '../../hook/api-request-simple';
import { useGlobalLoading, GlobalLoadingContextType } from '../../loading/global-loading/provider';

export interface ExpenseFixedOrNotInfoSummary {
  fixedExpensesAmount: number,
  notFixedExpensesAmount: number,
}



const UserBalancePane: React.FC<{}> = () => {

  const { selectedMonth, getDateStartRange, selectedSheet } = useExpenses() as UserExpensesDataCoxtextType;
  const { executeStatelessRequest: fetchExpenseFixesOrNotData } = useApiRequestStatelessHook({ apiRequest: fetchUserExpensesGroupedByFixedOrNot })

  const [expensesFixedOrNotData, setExpensesFixedOrNotData] = useState<ExpenseFixedOrNotInfoSummary | null>(null);

  useEffect(() => {
    loadFixedOrNotExpenseData();
  }, []);

  useEffect(() => {
    loadFixedOrNotExpenseData();
  }, [selectedMonth]);

  const loadFixedOrNotExpenseData = () => {
    fetchExpenseFixesOrNotData({ sheetId: selectedSheet!!.id, from: getDateStartRange()!! })
      .then(res => {
        let fixed = 0;
        let notFixed = 0;
        res.forEach(item => {
          if (item.label === 'Recurring') fixed = item.amount;
          notFixed = item.amount;
        })
        setExpensesFixedOrNotData({ fixedExpensesAmount: fixed, notFixedExpensesAmount: notFixed })
      })
      .catch(err => console.log(err));
  }



  const getFixedExpenseChartValue = (amountTotal: number, fixedTotal: number) => {
    if (getExpensesTotalAmount() === 0) {
      return 0;
    } else {
      return (fixedTotal / amountTotal) * 100;
    }
  }

  const getExpensesTotalAmount = () => {
    if (expensesFixedOrNotData)
      return expensesFixedOrNotData.fixedExpensesAmount + expensesFixedOrNotData.notFixedExpensesAmount;
    return 0;
  }

  const getExpensesFixedTotalAmount = () => {
    if (expensesFixedOrNotData)
      return expensesFixedOrNotData.fixedExpensesAmount;
    return 0;
  }

  const balanceCard = (text: string) => {
    return (
      <Box
        sx={{
          width: '80%',
          backgroundColor: 'rgb(2, 178, 175)',
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
            fontWeight: '600',
            color: 'black'
          }}
        >
          {text}
        </Typography>
      </Box>
    );
  };

  const linearChart = (text: string, value: number) => {
    return (
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        sx={{
          width: '80%',
          backgroundColor: 'rgb(2, 178, 175)',
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
            fontWeight: '600',
            color: 'black'
          }}
        >
          {text}
        </Typography>
        <Box
          display='flex'
          justifyContent='center'
          sx={{ width: '100%' }}>

          <LinearProgress
            variant="determinate"
            color='primary'
            sx={{ height: '1.5em', width: '90%', borderRadius: '4px' }}
            value={value}
            
          />

        </Box>
      </Box>
    );
  };

  return (
    <Box >      
      <Grid2
        container
        display="flex"
        justifyContent="flex-end"
      >
        <Grid2
          size={{ sm: 12, md:6 }}
          display="flex"
          justifyContent="center"
        >
          {balanceCard(`Despesas Totais ${formatBRLCurrency(getExpensesTotalAmount())}`)}
        </Grid2>
        <Grid2
          size={{ sm: 12, md:6 }}
          display="flex"
          justifyContent="center"
        >
          {linearChart(`Despesas Fixas - ${getFixedExpenseChartValue(getExpensesTotalAmount(), getExpensesFixedTotalAmount()).toFixed(2)}%`, getFixedExpenseChartValue(getExpensesTotalAmount(), getExpensesFixedTotalAmount()))}
        </Grid2>
      </Grid2>
    </Box>
  );

}

export default UserBalancePane;