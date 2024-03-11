import { Button, CardMedia, Grid, TextField } from '@mui/material';
import { Link, redirect, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import logo from '../../../lotus.webp'
import { config } from '../../../utils/properties';
import { useState } from 'react';
import { useApiRequestSimple } from '../../hook/api-request-simple';
import { registerNewUser } from '../../../utils/backend-client/authentication';
import { usePopup } from '../../popup/provider';
import { USER_NAME_LOCAL_STORAGE } from '../../../constants';

const { BACKEND_URL } = config;

const RegisterCard = ({changeToLoginCard}) => {

  const [userRegistryData, setUserRegistryData] = useState({});
  const { isLoading, statelessRequestApi } = useApiRequestSimple({apiRequest: registerNewUser})
  const { triggerSuccessPopup } = usePopup();
  const navigate = useNavigate();

  const submitUserRegistry = async (e) => {
    e.preventDefault()
    const {
      username, password, email, name
    } = userRegistryData;

    statelessRequestApi({
        username,
        password,
        email,
        nickname: name
    }).then(data => {      
      const { nickname } = data;
      localStorage.setItem(USER_NAME_LOCAL_STORAGE, nickname);
      triggerSuccessPopup({title: 'Usuário criado com sucesso!', message: `Bem vindo/a ${nickname}`})
      setTimeout(()=> {
        navigate('/')
      }, 2000);
    }).catch(err => {});    
  }

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
          id="outlined-basic-name"
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
          id="outlined-basic-email"
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
          id="outlined-basic-username"
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
          id="outlined-basic-password"
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