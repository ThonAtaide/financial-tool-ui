import { Button, CardMedia, Grid, TextField } from '@mui/material';
import { Link, redirect } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import logo from '../../../lotus.webp'
import { axios_client } from '../../../utils/backend-client';
import { config } from '../../../utils/properties';
import { useState } from 'react';
import { UseBackendApi, useBackendApi } from '../../hook/backend-request';
import { registerNewUser } from '../../../utils/backend-client/authentication';

const { BACKEND_URL } = config;

const RegisterCard = ({changeToLoginCard}) => {

  const [userRegistryData, setUserRegistryData] = useState({});
  const { data, callApi } = useBackendApi({apiRequest: registerNewUser})

  const submitUserRegistry = (e) => {
    e.preventDefault()
    const {
      username, password, email, name
    } = userRegistryData;

    callApi({
        username,
        password,
        email,
        nickname: name
    }).then(res => console.log('Deu certo'))
    .catch(err => {      
      console.log('Deu ruim meus amigos register');
      console.log(err);
    })
    // registerNewUser({
    //   username,
    //   password,
    //   email,
    //   nickname: name
    // })
  } 

  // const registerNewUser = ({ username, password, email, nickname }) => {
  //   console.log('calling api new user')
  //   return axios_client.post(
  //     '/sign-up',
  //     JSON.stringify({ username, password, email, nickname }) 
  //     )
  //     // .then(res => console.log('Success: ' + res))
  //     // .catch(err => console.log(err.response.data))
  // }

  return (
    <Grid item xs={12} md={6} >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <CardMedia
          component="img"
          image={logo}
          sx={{ width: '12rem' }}
        />
      </Box>
      <Typography
        variant='h5'
        sx={{
          fontFamily: 'var(--bs-font-sans-serif)',
          fontWeight: '600',
          color: 'inherit',
          textAlign: 'center'
        }}
      >
        Kathon Finanças
      </Typography>
      <Box
        mt={4}
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Typography
          variant='body1'
          sx={{
            fontFamily: 'var(--bs-font-sans-serif)',
            color: 'inherit',
            textAlign: 'center'
          }}
        >
          Registre-se e controle suas despesas
        </Typography>
      </Box>
      <Box
        mt={3}
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <TextField
          id="outlined-basic"
          fullWidth
          label="Nome"
          variant="outlined"
          size='small'
          value={userRegistryData && userRegistryData.name}
          onChange={e => setUserRegistryData({...userRegistryData, name: e.target.value})}
        />
      </Box>
      <Box
        mt={3}
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <TextField
          id="outlined-basic"
          fullWidth
          label="E-mail"
          variant="outlined"
          size='small'
          value={userRegistryData && userRegistryData.email}
          onChange={e => setUserRegistryData({...userRegistryData, email: e.target.value})}
        />
      </Box>
      <Box
        mt={3}
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <TextField
          id="outlined-basic"
          fullWidth
          label="Username"
          variant="outlined"
          size='small'
          value={userRegistryData && userRegistryData.username}
          onChange={e => setUserRegistryData({...userRegistryData, username: e.target.value})}
        />
      </Box>
      <Box
        mt={3}
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <TextField
          id="outlined-basic"
          fullWidth
          label="Senha"
          variant="outlined"
          size='small'
          type='password'
          value={userRegistryData && userRegistryData.password}
          onChange={e => setUserRegistryData({...userRegistryData, password: e.target.value})}
        />
      </Box>
      <Box
        mt={3}
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button 
          variant="contained" 
          size='small'
          fullWidth
          sx={{ textTransform: 'none'}}
          onClick={submitUserRegistry}
        >
          Me cadastrar
        </Button>
      </Box>      
      <Box
        mt={4}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography
          variant='body1'
          sx={{
            fontFamily: 'var(--bs-font-sans-serif)',
            color: 'inherit',
            textAlign: 'center'
          }}
        >
          Possui uma conta?
        </Typography>
        <Link to={`/login`}>
          <Button
            variant="outlined"
            sx={{ marginLeft: '1rem', textTransform: 'none' }}
            onClick={() => changeToLoginCard()}
          >
            Entrar
          </Button>
        </Link>        
      </Box>
    </Grid>
  )
}

export default RegisterCard;