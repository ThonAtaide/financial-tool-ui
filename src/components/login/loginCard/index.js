import { useState, React } from 'react';
import { Button, CardMedia, Grid, TextField, Popper, Fade, Paper, Alert, Container } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import logo from '../../../lotus.webp'
import { USER_NAME_LOCAL_STORAGE } from '../../../constants/index'
import { login } from '../../../utils/backend-client';

const LoginCard = ({ changeToRegisterCard }) => {

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState();

  const navigate = useNavigate();

  const onChangeEmail = (value) => {
    setEmail(value)
  }

  const onChangePassword = (value) => {
    setPassword(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    login(email, password)
      .then(response => {
        if (response.statusCode === 200) {          
          localStorage.setItem(USER_NAME_LOCAL_STORAGE, response.data.name);
          console.log(response)
          setShowAlert(true);
          setAlertType('success');
          setAlertMessage('Usuário logado com sucesso!')
          navigate('/');
        } else {
          setShowAlert(true);
          setAlertType('error');
          setAlertMessage('Usuário ou senha incorretos!')
        }
      }).catch(err => {
        console.log(err);
        setShowAlert(true);
        setAlertType('error');
        setAlertMessage('erro de outro tipo!')
      });
    
  }

  return (
    <Grid item xs={12} md={6} component="form" onSubmit={handleSubmit}>
      <Container sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'magenta', width: '100%' }}>
        <Popper open={showAlert} transition >
          <Paper>
            <Alert severity={alertType}>{alertMessage}</Alert>
          </Paper>
        </Popper>
      </Container>
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
          id="email-field"
          fullWidth
          label="E-mail"
          variant="outlined"
          size='small'
          onChange={(e) => onChangeEmail(e.target.value)}
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