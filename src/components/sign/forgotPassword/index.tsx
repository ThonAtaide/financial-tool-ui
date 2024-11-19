import React, { FormEvent, useState } from 'react';
import logo from '../../../resources/lotus.webp';
import { Grid, Box, CardMedia, Typography, TextField, Button } from '@mui/material';
import { InputFieldData } from '../../types';
import { useApiRequestStatelessHook } from '../../hook/api-request-simple';
import { recovery_password } from '../../../integration/fin-tool-api/authentication';
import { useNavigate } from 'react-router-dom';
import { GlobalLoadingContextType, useGlobalLoading } from '../../loading/global-loading/provider';
import { PopupProviderContextType, usePopup } from '../../popup/provider';

const PasswordRecovery: React.FC<{}> = ({ }) => {
    const { executeStatelessRequest } = useApiRequestStatelessHook({ apiRequest: recovery_password });
    const [emailFieldData, setEmailFieldData] = useState<InputFieldData<string>>({ data: '', validationMessage: null });
    const navigate = useNavigate();
    const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;
    const { displaySuccessPopup } = usePopup() as PopupProviderContextType;

    const onChangeEmail = (value: string) => setEmailFieldData({ data: value, validationMessage: null })

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        startLoading();
        executeStatelessRequest({ email: emailFieldData.data })
        .then(() => {
            displaySuccessPopup('Recuperação de senha solicitada', 'Por favor verifique sua caixa de email e lixo eletrônico.')
            setTimeout(() => navigate('/sign-in'), 2000);
        }).catch(err => console.log(err))
        .finally(() => finishLoading());
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
                    Recuperação de acesso
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
                <Button variant="contained" size='small' fullWidth type='submit'>Redefinir senha</Button>
            </Box>
        </Grid>
    )
}

export default PasswordRecovery;