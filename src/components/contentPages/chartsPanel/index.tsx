import { Box, Divider, Typography } from '@mui/material';
import React from 'react';
import CustomPieChart from '../customPieChart';
import UserBalancePane from '../balance';

const ChartsPanel: React.FC<{}> = ({ }) => {

    return (
        <Box p={3}>
            <Typography
                variant='h5'
                sx={{
                    fontFamily: 'var(--bs-font-sans-serif)',
                    fontWeight: '600',
                    textAlign: 'center',
                    color: 'white'
                }}
                mb={2}
            >
                Estatísticas
            </Typography>
            <UserBalancePane />
            <Divider component="li" />
            <CustomPieChart />
        </Box>
    )
}

export default ChartsPanel;