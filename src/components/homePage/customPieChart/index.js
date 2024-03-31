import { React, useState } from 'react';
import { PieArc, PieArcLabel, PieArcPlot, PieChart, PiePlot } from '@mui/x-charts/PieChart';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import { formatBRLCurrency } from '../../../utils/currencyFormatter';
import { ChartsTooltip } from '@mui/x-charts';
import { useExpenses } from '../expenses-provider';
import { Brightness1 } from '@mui/icons-material';

const pieParams = { height: 500, margin: { right: 0, bottom: 75 } };
const colors = ['#a6cee3',
  '#1f78b4',
  '#b2df8a',
  '#33a02c',
  '#fb9a99',
  '#e31a1c',
  '#fdbf6f',
  '#ff7f00',
  '#cab2d6',
  '#6a3d9a',
  '#ffff99',
  '#b15928',
]
const CustomPieChart = ({ title, data }) => {
  const totalBalance = data.reduce((total, item) => total + item.value, 0);
  const { selectedCategories, updateSelectedCategories } = useExpenses();

  const categoriesChips = () => {
    return selectedCategories
      && selectedCategories.length > 0
      && selectedCategories.map(item =>
        <Tooltip
          title={item.formattedValue
          }
          placement='top'
        >
          <Chip
            variant='filled'
            sx={{
              cursor: 'pointer',
              marginRight: '0.5em',
              marginBottom: '0.5em',
              backgroundColor: item.color,
              fontWeight: 'bold'
            }}
            onDelete={() => updateSelectedCategories(item)}
            label={item.label}
          />
        </Tooltip>
      )
  }

  const handleClick = (event, item, pieArc) => {
    console.log(pieArc);
    updateSelectedCategories({
      id: pieArc.id,
      label: pieArc.label,
      color: pieArc.color,
      formattedValue: pieArc.formattedValue
    });
  };

  return (
    <Box >
      <Typography
        variant='h5'
        sx={{
          fontFamily: 'var(--bs-font-sans-serif)',
          fontWeight: '600',
          textAlign: 'center'
        }}
        mb={5}
      >
        {title}
      </Typography>
      <PieChart
        {...pieParams}
        colors={colors}
        onClick={handleClick}
        series={[
          {
            valueFormatter: (item) => `${formatBRLCurrency(item.value)} - ${((item.value / totalBalance) * 100).toFixed(2)}%`,
            data,
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
            hidden: true,
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'center' },
          },
        }}
      />
      {categoriesChips()}


    </Box>

  );
}
export default CustomPieChart