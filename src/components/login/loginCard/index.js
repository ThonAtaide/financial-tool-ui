import { useState, React } from 'react';
import { Button, CardMedia, Grid, TextField } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import logo from '../../../lotus.webp'
import { USER_NAME_LOCAL_STORAGE } from '../../../constants/index'
import { sign_in } from '../../../utils/backend-client/authentication';
import { usePopup } from '../../popup/provider';
import { useApiRequestSimple } from '../../hook/api-request-simple';
import { useGlobalLoading } from '../../loading/global-loading/provider';

const LoginCard = ({ changeToRegisterCard }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { isLoading, statelessRequestApi } = useApiRequestSimple({apiRequest: sign_in});
  const { triggerSuccessPopup, triggerErrorPopup} = usePopup();
  const { startLoading, finishLoading } = useGlobalLoading();

  const onChangeUsername = (value) => {
    setUsername(value)
  }

  const onChangePassword = (value) => {
    setPassword(value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    startLoading();
    statelessRequestApi({username, password})
      .then(data => {
        finishLoading();
        const { nickname } = data;
        localStorage.setItem(USER_NAME_LOCAL_STORAGE, nickname);
        triggerSuccessPopup({ title: 'Usuário logado com sucesso.', message: `Bem vindo ${nickname}` });
        setTimeout(()=> {
          navigate('/')
        }, 2000);
      }).catch(err => {
        finishLoading();
        setTimeout(() => {
          setUsername('');
          setPassword('');
        }, 500)
      });
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
        mt={5}
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
          size='small'
          type='password'
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
        mt={2}
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <a href='#'>Esqueceu a senha?</a>
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
          Não possui conta?
        </Typography>
        <Link to={`/register`}>
          <Button
            variant="outlined"
            sx={{ color: 'red', marginLeft: '1rem', borderColor: 'red', textTransform: 'none' }}
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