import React from 'react';
import { useState } from 'react';
import { Button, CardMedia, Grid, IconButton, TextField } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import logo from '../../../resources/lotus.webp';
import { sign_in } from '../../../integration/fin-tool-api/authentication'
import { PopupProviderContextType, usePopup } from '../../popup/provider';
import { useApiRequestStatelessHook } from '../../hook/api-request-simple';
import { useGlobalLoading, GlobalLoadingContextType } from '../../loading/global-loading/provider';
import { AuthenticatedUserDataContextType, useAuthData } from '../../auth-provider';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { InputFieldData } from '../../types';
import { validateEmailWithRegex } from '../../../utils/validations';

const SignInCard: React.FC<{}> = ({}) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [emailFieldData, setEmailFieldData] = useState<InputFieldData<string>>({ data: '', validationMessage: null });
    const [passwordFieldData, setPasswordFieldData] = useState<InputFieldData<string>>({ data: '', validationMessage: null });

    const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;
    const { setAuthenticatedUserData } = useAuthData() as AuthenticatedUserDataContextType;
    const { displaySuccessPopup } = usePopup() as PopupProviderContextType;

    const { executeStatelessRequest } = useApiRequestStatelessHook({ apiRequest: sign_in });
    const navigate = useNavigate();

    const onChangeEmail = (newValue: string) => {
        setEmailFieldData({ data: newValue, validationMessage: null })
    }

    const onChangePassword = (newValue: string) => {
        setPasswordFieldData({ data: newValue, validationMessage: null })
    }

    const handlePasswordVisibility = () => setShowPassword(!showPassword);

    const validateEmail = () => {
        if (!validateEmailWithRegex(emailFieldData.data)) {
            setEmailFieldData({ ...emailFieldData, validationMessage: 'Este E-mail não é válido' });
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateEmail() || !validatePassword()) {
            return
        }
        startLoading();
        executeStatelessRequest({ email: emailFieldData.data!, password: passwordFieldData.data! })
            .then(data => {
                const { nickname } = data;
                setAuthenticatedUserData({ name: nickname });
                displaySuccessPopup('Usuário logado com sucesso.', `Bem vindo ${nickname}`);
                setTimeout(() => {
                    navigate('/')
                }, 2000);
            }).catch(err => {
                setTimeout(() => {
                    onChangeEmail('');
                    onChangePassword('');
                }, 500)
            }).finally(() => finishLoading());
    }

    return (
        <Grid item xs={12} md={6} component="form" onSubmit={(e) => handleSubmit(e)}>
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
                    id="email-field"
                    fullWidth
                    label="Email"
                    variant="outlined"
                    size='small'
                    value={emailFieldData.data}
                    helperText={emailFieldData.validationMessage}
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
                    helperText={passwordFieldData.validationMessage}
                    InputProps={{
                        endAdornment: <IconButton onClick={handlePasswordVisibility}>
                            {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                        </IconButton>,
                    }}

                    size='small'
                    type={showPassword ? 'text' : 'password'}
                    value={passwordFieldData.data}
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
                    flexDirection: { xs: 'column', sm: 'row' },
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
                <Link to={'/sign-up'}>
                    <Button
                        variant="outlined"
                        sx={{ color: 'red', borderColor: 'red', textTransform: 'none' }}
                    >
                        Registre-se
                    </Button>
                </Link>
            </Box>
        </Grid>
    )
}

export default SignInCard;