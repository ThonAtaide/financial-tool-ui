import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';
import { formatBRLCurrency } from '../../../utils/currencyFormatter';
import { useExpenses, UserExpensesDataCoxtextType } from '../../expenses-provider';
import { useApiRequestStatelessHook } from '../../hook/api-request-simple';
import { fetchUserExpensesGroupedByCategory } from '../../../integration/fin-tool-api/expenses';
import { GlobalLoadingContextType, useGlobalLoading } from '../../loading/global-loading/provider';

const pieParams = { height: 500, margin: { right: 0, bottom: 75 } };

export interface PieChartDataI {
  id: number,
  value: number,
  label: string,
}

const CustomPieChart: React.FC<{}> = ({}) => {
  
  const { selectedMonth, selectedSheet } = useExpenses() as UserExpensesDataCoxtextType;
  const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;
  const { executeStatelessRequest: fetchExpenseCategoriesData } = useApiRequestStatelessHook({apiRequest: fetchUserExpensesGroupedByCategory})
  
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [expenseCategoriesData, setExpenseCategoriesData] = useState<PieChartDataI[]>([]);

  const loadChartData = () => {
    startLoading();
    fetchExpenseCategoriesData({sheetId: selectedSheet!.id, from: selectedMonth!.format('YYYY-MM')})
    .then(res => {
      const mappedData = res.map(item => { return {id: item.id, value: item.amount, label: item.label}})
      setExpenseCategoriesData(mappedData);
      const total = res.reduce((total, item) => total + item.amount, 0);
      setTotalBalance(total)
    })
    .catch(err => console.log(err))
    .finally(() => finishLoading());
  }

  useEffect(()=> {
    loadChartData();
  }, []);

  useEffect(()=> {
    loadChartData();
  }, [selectedMonth]);

  return (
    <Box >
      {expenseCategoriesData && expenseCategoriesData.length > 0 && <>
      <Typography
        variant='h5'
        sx={{
          fontFamily: 'var(--bs-font-sans-serif)',
          fontWeight: '600',
          textAlign: 'center'
        }}
        mb={5}
      >
        Despesas por categoria
      </Typography>
      <PieChart
        {...pieParams}
        series={[
          {
            valueFormatter: (item) => `${formatBRLCurrency(item.value)} - ${((item.value / totalBalance) * 100).toFixed(2)}%`,
            data: expenseCategoriesData,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            type: 'pie',
            innerRadius: 20,
            paddingAngle: 3,
            cornerRadius: 5,            
          },
        ]}
        slotProps={{          
          legend: {
            direction: 'row',            
            position: {
              horizontal: 'middle' ,
              vertical: 'bottom',
              },
          },
        }}
      />
      </>}
    </Box>
  );
}
export default CustomPieChart