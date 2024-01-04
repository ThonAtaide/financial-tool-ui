import { useState, React } from 'react';
import { Button, CardMedia, Grid, TextField } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import logo from '../../../lotus.webp'
import { USER_NAME_LOCAL_STORAGE } from '../../../constants/index'
import { login } from '../../../utils/backend-client';

const LoginCard = ({ changeToRegisterCard, showAlert }) => {

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const navigate = useNavigate();

  const onChangeUsername = (value) => {
    setUsername(value)
  }

  const onChangePassword = (value) => {
    setPassword(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    login(username, password)
      .then(name => {          
          localStorage.setItem(USER_NAME_LOCAL_STORAGE, name);
          console.log('Dando sucesso response')
          showAlert({alertType: 'success', message: 'Usuário logado com sucesso!'});
          setTimeout(()=> {
            navigate('/');
          }, 1000);
      }).catch(err => {
        showAlert({ alertType: 'error', message: 'Houve um erro. Por favor, tente novamente !'});
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