import { useState, React } from 'react';
import { Button, CardMedia, Grid, IconButton, TextField } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import logo from '../../../lotus.webp';
import { sign_in } from '../../../utils/backend-client/authentication';
import { usePopup } from '../../popup/provider';
import { useApiRequestSimple } from '../../hook/api-request-simple';
import { useGlobalLoading } from '../../loading/global-loading/provider';
import { useAuthData } from '../../auth-provider';
import {  VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

const LoginCard = ({ changeToRegisterCard }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { statelessRequestApi } = useApiRequestSimple({apiRequest: sign_in});
  const { startLoading, finishLoading } = useGlobalLoading();
  const { triggerSuccessPopup } = usePopup();
  const { storeUserData } = useAuthData();
  const navigate = useNavigate();

  const onChangeUsername = (value) => {
    setUsername(value)
  }

  const onChangePassword = (value) => {
    setPassword(value)
  }

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    startLoading();
    statelessRequestApi({username, password})
      .then(data => {        
        const { nickname } = data;
        storeUserData({ nickname });
        triggerSuccessPopup({ title: 'Usuário logado com sucesso.', message: `Bem vindo ${nickname}` });
        setTimeout(()=> {
          navigate('/')
        }, 2000);
      }).catch(err => {
        setTimeout(() => {
          setUsername('');
          setPassword('');
        }, 500)
      }).finally(() => finishLoading());
  }

  return (
    <Grid item xs={12} md={6} component="form" onSubmit={handleSubmit}>
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
        variant='h4'
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
          variant='h6'
          sx={{
            fontFamily: 'var(--bs-font-sans-serif)',
            color: 'inherit',
            textAlign: 'center'
          }}
        >
          Acesse sua conta
        </Typography>
      </Box>
      <Box
        mt={5}
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <TextField
          id="username-field"
          fullWidth
          label="Username"
          variant="outlined"
          size='small'
          value={username}
          onChange={(e) => onChangeUsername(e.target.value)}
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
          id="password-field"
          fullWidth
          label="Senha"
          variant="outlined"          
          InputProps={{
            endAdornment: <IconButton onClick={handlePasswordVisibility}>
              {showPassword? <VisibilityOutlined />: <VisibilityOffOutlined/>}
              </IconButton>,
          }}
          
          size='small'
          type={showPassword? 'text' : 'password'}
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
        />
      </Box>
      <Box
        mt={3}
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button variant="contained" size='small' fullWidth type='submit'>Entrar</Button>
      </Box>
      <Box
        mt={3}
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <a href='#'>Esqueceu a senha?</a>
      </Box>
      <Box
        mt={3}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row'}, 
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography
          variant='body1'
          sx={{
            fontFamily: 'var(--bs-font-sans-serif)',
            color: 'inherit',
            textAlign: 'center',
            padding: '0 1rem 0 1rem'           
          }}
        >
          Não possui conta?
        </Typography>        
        <Link to={`/register`}>
          <Button
            variant="outlined"
            sx={{ color: 'red', borderColor: 'red', textTransform: 'none' }}
            onClick={() => changeToRegisterCard()}
          >
            Registre-se
          </Button>
        </Link>
      </Box>
    </Grid>
  )
}

export default LoginCard;