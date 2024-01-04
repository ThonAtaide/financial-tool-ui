import { React } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography } from '@mui/material';

const CustomPieChart = ({title, data}) => {
    return(
        
      <div style={{width:'100%', height: '25em'}}>
      <Typography
        variant='h5'
        sx={{
          fontFamily: 'var(--bs-font-sans-serif)',
          fontWeight: '600'
        }}
      >
        {title}
      </Typography>
          <PieChart
            // sx={{border: 'solid'}}
            series={[
                { 
                  data,     
                  innerRadius: 20,
                  outerRadius: 170,
                  paddingAngle: 3,
                  cornerRadius: 5,    
                },
              ]}
              margin={ {right: 10} }
              // slotProps={{
              //   legend: {
              //     direction: 'row',
              //     position: { vertical: 'bottom', horizontal: 'right' },
              //     padding: 0,
              //   },
              // }}
                  
          />  
          </div>     
        
    );
}
export default CustomPieChart