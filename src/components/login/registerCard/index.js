import { Button, CardMedia, Grid, TextField } from '@mui/material';
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import logo from '../../../lotus.webp'

const RegisterCard = ({changeToLoginCard}) => {
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