import { React } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';
import { formatBRLCurrency } from '../../../utils/currencyFormatter';

const pieParams = { height: 500, margin: { right: 0, bottom: 75 } };

const CustomPieChart = ({ title, data }) => {
  const totalBalance = data.reduce((total, item) => total + item.value, 0);
  return (
    <Box >
      <Typography
        variant='h5'
        sx={{
          fontFamily: 'var(--bs-font-sans-serif)',
          fontWeight: '600'
        }}
        mb={5}
      >
        {title}
      </Typography>

      <PieChart
        {...pieParams}
        series={[
          {
            valueFormatter: (item) => `${formatBRLCurrency(item.value)} - ${((item.value/totalBalance)*100).toFixed(2)}%`,
            data,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            innerRadius: 20,
            paddingAngle: 3,
            cornerRadius: 5,
          },
        ]}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'center' },
            
          }
        }}
      />
    </Box>

  );
}
export default CustomPieChart