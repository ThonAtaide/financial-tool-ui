import { Button, TextField } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useApiRequestStatelessHook } from '../../hook/api-request-simple';
import { registerNewUser } from '../../../integration/fin-tool-api/authentication';
import { PopupProviderContextType, usePopup } from '../../popup/provider';
import { GlobalLoadingContextType, useGlobalLoading } from '../../loading/global-loading/provider';
import { AuthenticatedUserDataContextType, useAuthData } from '../../auth-provider';
import { InputFieldData } from '../../types';
import { validateEmailWithRegex } from '../../../utils/validations';
import SignContentPane from '../userContentPane';

const SignUpCard: React.FC<{}> = ({ }) => {

  const [emailFieldData, setEmailFieldData] = useState<InputFieldData<string>>({ data: '', validationMessage: null });
  const [passwordFieldData, setPasswordFieldData] = useState<InputFieldData<string>>({ data: '', validationMessage: null });
  const [nameFieldData, setNameFieldData] = useState<InputFieldData<string>>({ data: '', validationMessage: null });

  const { executeStatelessRequest } = useApiRequestStatelessHook({ apiRequest: registerNewUser })
  const { displaySuccessPopup } = usePopup() as PopupProviderContextType;
  const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;
  const { setAuthenticatedUserData } = useAuthData() as AuthenticatedUserDataContextType;

  const navigate = useNavigate();

  const validateName = () => nameFieldData.data.length >= 2

  const validateEmail = () => {
    if (!validateEmailWithRegex(emailFieldData.data)) {
      setEmailFieldData({ ...emailFieldData, validationMessage: 'E-mail inválido' });
      return false;
    }
    return true;
  }

  const validatePassword = () => {
    if (!passwordFieldData.data
      || (passwordFieldData.data && passwordFieldData.data.length < 6)
    ) {
      setPasswordFieldData({ ...passwordFieldData, validationMessage: 'Senha fora dos padrões' });
      return false;
    }
    return true;
  }

  const submitUserRegistry = async (event: React.MouseEvent<HTMLButtonElement | MouseEvent>) => {
    event.preventDefault()
    if (!validateName() || !validateEmail() || !validatePassword()) {
      return;
    }

    startLoading();
    executeStatelessRequest({
      nickname: nameFieldData.data,
      email: emailFieldData.data,
      password: passwordFieldData.data
    }).then(data => {
      const { nickname } = data;
      setAuthenticatedUserData({ name: nickname });
      displaySuccessPopup('Usuário criado com sucesso!', `Bem vindo/a ${nickname}`)
      setTimeout(() => {
        navigate('/')
      }, 2000);
    }).catch(err => { })
      .finally(() => finishLoading());
  }

  const onEmailChange = (value: string) => setEmailFieldData({ data: value, validationMessage: null })

  const onPasswordChange = (value: string) => setPasswordFieldData({ data: value, validationMessage: null })

  const onNameChange = (value: string) => setNameFieldData({ data: value, validationMessage: null })

  return (
    <SignContentPane title='Registre-se e controle suas despesas'>
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
          value={nameFieldData.data}
          onChange={e => onNameChange(e.target.value)}
          helperText={nameFieldData.validationMessage}
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
          value={emailFieldData.data}
          onChange={e => onEmailChange(e.target.value)}
          helperText={emailFieldData.validationMessage}
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
          value={passwordFieldData.data}
          onChange={e => onPasswordChange(e.target.value)}
          helperText={passwordFieldData.validationMessage}
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
          sx={{ textTransform: 'none' }}
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
        <Link to={`/sign-in`}>
          <Button
            variant="outlined"
            sx={{ marginLeft: '1rem', textTransform: 'none', color: 'white', borderColor: 'white' }}
          >
            Entrar
          </Button>
        </Link>
      </Box>
    </SignContentPane>
  )
}

export default SignUpCard;