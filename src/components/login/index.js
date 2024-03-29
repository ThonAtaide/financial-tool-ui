import React, { useState } from 'react';
import { Alert, Container, Grid, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './style.css'
import LoginCard from './loginCard'
import RegisterCard from './registerCard';

const LoginPage = ({ showRegisterForm = false }) => {
  // console.log('loop login')
  const [renderLoginCard, setRenderLoginCard] = useState(!showRegisterForm);  

  const setToRenderRegisterCard = () => {
    setRenderLoginCard(false)
  }

  const setToRenderLoginCard = () => {
    setRenderLoginCard(true)
  }

  return (
    <Container
      className='login-parent-container'
      maxWidth
    >      
      <Box
        sx={{
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Grid
          className='login-box'
          container
          component={Paper}
          elevation={6}
          columnSpacing={6}
          paddingLeft={2}
          paddingRight={2}
          sx={{
            width: '80%',
            padding: '2rem'
          }}
        >
          <Grid
            item
            xs={12} md={6}
          >
            <Box mt={16}>
              <Typography
                variant='h5'
                sx={{
                  fontFamily: 'var(--bs-font-sans-serif)',
                  fontWeight: 500,
                  color: 'inherit',
                }}
              >
                Mais do que uma ferramenta, uma solução.
              </Typography>
            </Box>
            <Box mt={3}>
              <Typography
                variant='body2'
                sx={{
                  fontFamily: 'var(--bs-font-sans-serif)',

                  color: 'inherit',
                }}
              >
                Seis em cada 10 brasileiros admitem que nunca, ou somente às vezes,
                dedicam tempo a atividades de controle da vida financeira. Não é atoa que o número de brasileiros endividados
                alcançou recentemente o maior nível histórico.
              </Typography>
            </Box>
            <Box mt={3}>
              <Typography
                variant='body2'
                sx={{
                  fontFamily: 'var(--bs-font-sans-serif)',
                  color: 'inherit',
                }}
              >
                Nós da Kathon, sabemos que administrar as despesas de uma casa não é tarefa fácil e que para isso só vontade não basta.
                Por isso desenvolvemos uma solução voltada para o gerenciamento de suas despesas.
              </Typography>
            </Box>
          </Grid>

          {renderLoginCard ?
            <LoginCard changeToRegisterCard={setToRenderRegisterCard} /> :
            <RegisterCard changeToLoginCard={setToRenderLoginCard} />
          }

        </Grid>
      </Box>
    </Container>
  )
}

export default LoginPage;