import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { fetchUserExpensesGroupedByFixedOrNot } from '../../../integration/fin-tool-api/expenses';
import { useExpenses, UserExpensesDataCoxtextType } from '../../expenses-provider';
import { useApiRequestStatelessHook } from '../../hook/api-request-simple';

export interface ExpenseFixedOrNotInfoSummary {
  fixedExpensesAmount: number,
  notFixedExpensesAmount: number,
}

const UserBalancePane: React.FC<{}> = () => {

  const { selectedMonth, getDateStartRange, selectedSheet, expensesTotalAmount } = useExpenses() as UserExpensesDataCoxtextType;
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



  const getFixedExpenseChartPercentValue = (fixedTotal: number) => {
    if (expensesTotalAmount === 0) {
      return 0;
    } else {
      return (fixedTotal / expensesTotalAmount) * 100;
    }
  }

  const getExpensesFixedTotalAmount = () => {
    if (expensesFixedOrNotData)
      return expensesFixedOrNotData.fixedExpensesAmount;
    return 0;
  }  

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
          sx={{ width: '100%' }}
        >
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
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
      >
        {linearChart(`Despesas Fixas - ${getFixedExpenseChartPercentValue(getExpensesFixedTotalAmount()).toFixed(2)}%`, getFixedExpenseChartPercentValue(getExpensesFixedTotalAmount()))}
      </Box>
    </Box>
  );

}

export default UserBalancePane;