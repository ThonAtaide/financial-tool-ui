import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { InputFieldData } from '../../types';
import { useApiRequestStatelessHook } from '../../hook/api-request-simple';
import { recovery_password } from '../../../integration/fin-tool-api/authentication';
import { useNavigate } from 'react-router-dom';
import { GlobalLoadingContextType, useGlobalLoading } from '../../loading/global-loading/provider';
import { PopupProviderContextType, usePopup } from '../../popup/provider';
import SignContentPane from '../userContentPane';

const PasswordRecovery: React.FC<{}> = ({ }) => {
    const { executeStatelessRequest } = useApiRequestStatelessHook({ apiRequest: recovery_password });
    const [emailFieldData, setEmailFieldData] = useState<InputFieldData<string>>({ data: '', validationMessage: null });
    const navigate = useNavigate();
    const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;
    const { displaySuccessPopup } = usePopup() as PopupProviderContextType;

    const onChangeEmail = (value: string) => setEmailFieldData({ data: value, validationMessage: null })

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement | MouseEvent>) => {
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
        <SignContentPane title='Recuperar senha'>
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
                <Button variant="contained" size='small' fullWidth onClick={handleSubmit}>Redefinir senha</Button>
            </Box>
        </SignContentPane>
    )
}

export default PasswordRecovery;