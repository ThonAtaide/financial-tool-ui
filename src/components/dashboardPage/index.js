import { Box, Grid, Paper, Typography } from '@mui/material';
import { React } from 'react';
import { useNavigate, useLoaderData, useLocation } from "react-router-dom";
import ResponsiveAppBar from '../header';

export const DashboardPage = () => {
  const group = useLoaderData();

  return (
    <Box>
      <ResponsiveAppBar />
      <Box
        maxWidth
        display='flex'
        justifyContent='center'
        mt={4}
      >
        <Typography
          variant='h5'
          sx={{
            fontFamily: 'var(--bs-font-sans-serif)',
            fontWeight: '500'
          }}
        >
          {group.name}
        </Typography>
        {console.log(group)}
      </Box>
      <Grid
        container
        // spacing={2}
        sx={{
          padding: '2rem'
        }}
      >
        <Grid
          key='extrato'
          item
          lg={4}
          sx={{textAlign: 'center'}}
        >
          Extrato
        </Grid>
        <Grid
          key='extrato'
          item
          lg={4}
          sx={{textAlign: 'center'}}
        >
          extrato
        </Grid>
        <Grid
          key='extrato'
          item
          lg={4}
          sx={{textAlign: 'center'}}
        >
          <Paper>
            Saldo: 1000
          </Paper>
        </Grid>
      </Grid>
      Dashboard do papai
    </Box>
  );
}