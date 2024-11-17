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

interface SignManagement {
    changeForAnotherView: Function
}

const SignInCard: React.FC<SignManagement> = (signManagement: SignManagement) => {
    const [showPassword, setShowPassword] = useState<Boolean>(false);
    const [email, setUsername] = useState<string | null>('');
    const [password, setPassword] = useState<string | null>('');

    const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;
    const { setAuthenticatedUserData } = useAuthData() as AuthenticatedUserDataContextType;
    const { displaySuccessPopup } = usePopup() as PopupProviderContextType;

    const { executeStatelessRequest } = useApiRequestStatelessHook({ apiRequest: sign_in });
    const navigate = useNavigate();

    const onChangeUsername = (newValue: string) => {
        setUsername(newValue)
    }

    const onChangePassword = (newValue: string) => {
        setPassword(newValue)
    }

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        startLoading();
        //TODO alterar os tipos de dados para armazenarem mensagem de aviso
        executeStatelessRequest({ email: email!, password: password! })
             .then(data => {
                 const { nickname } = data;
                 setAuthenticatedUserData({ name: nickname });
                 displaySuccessPopup('Usuário logado com sucesso.', `Bem vindo ${nickname}`);
                 setTimeout(() => {
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
                    value={email}
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
                            {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                        </IconButton>,
                    }}

                    size='small'
                    type={showPassword ? 'text' : 'password'}
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
                <Link to={`/register`}>
                    <Button
                        variant="outlined"
                        sx={{ color: 'red', borderColor: 'red', textTransform: 'none' }}
                        onClick={() => signManagement.changeForAnotherView()}
                    >
                        Registre-se
                    </Button>
                </Link>
            </Box>
        </Grid>
    )
}

export default SignInCard;