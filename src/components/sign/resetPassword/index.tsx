import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { InputFieldData } from '../../types';
import { useApiRequestStatelessHook } from '../../hook/api-request-simple';
import { reset_password, retrieve_recovery_password_info } from '../../../integration/fin-tool-api/authentication';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { GlobalLoadingContextType, useGlobalLoading } from '../../loading/global-loading/provider';
import { PopupProviderContextType, usePopup } from '../../popup/provider';
import SignContentPane from '../userContentPane';

const PasswordReset: React.FC<{}> = ({ }) => {
    const query: URLSearchParams = new URLSearchParams(useLocation().search);
    const token: string | null = query.get("token");

    const { executeStatelessRequest: recovery_pwd_info_request } = useApiRequestStatelessHook({ apiRequest: retrieve_recovery_password_info });
    const { executeStatelessRequest: reset_pwd_request } = useApiRequestStatelessHook({ apiRequest: reset_password });

    const [passwordFieldData, setPasswordFieldData] = useState<InputFieldData<string>>({ data: '', validationMessage: null });
    const [passwordConfirmationFieldData, setPasswordConfirmationFieldData] = useState<InputFieldData<string>>({ data: '', validationMessage: null });
    const navigate = useNavigate();
    const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;
    const { displaySuccessPopup, displayErrorPopup } = usePopup() as PopupProviderContextType;

    useEffect(() => {
        if (token) {
            startLoading();
            const fetchData = () => {
                recovery_pwd_info_request(token!)
                    .catch(err => setTimeout(() => navigate('/sign-in'), 3000))
                    .finally(() => finishLoading());
            }
            fetchData();
        } else {
            displayErrorPopup('Requisição inválida', 'Informações incompletas');
            setTimeout(() => navigate('/sign-in'), 2000);
        }
    }, [])

    const onChangePassword = (value: string) => setPasswordFieldData({ data: value, validationMessage: null })

    const onChangePasswordConfirmation = (value: string) => {
        const validation = passwordFieldData.data === value ? null : 'A confirmação está diferente da senha.'
        setPasswordConfirmationFieldData({ data: value, validationMessage: validation })
    }

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement | MouseEvent>) => {
        event.preventDefault();
        if (passwordFieldData.data === passwordConfirmationFieldData.data) {
            startLoading();
            reset_pwd_request({ password: passwordFieldData.data, token: token!! })
                .then(() => {
                    displaySuccessPopup('Senha alterada com sucesso', 'Por favor tente efetuar o login.')
                    setTimeout(() => navigate('/sign-in'), 2000);
                }).catch(err => console.log(err))
                .finally(() => finishLoading());
        } else {
            displayErrorPopup('Entradas inválidas', 'A senha de confirmação não é igual.')
        }
    }

    return (
        <SignContentPane title='Resetar senha'>
            <Box
                mt={5}
                sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <TextField
                    id="password-field"
                    fullWidth
                    type='password'
                    label="Senha"
                    variant="outlined"
                    size='small'
                    value={passwordFieldData.data}
                    helperText={passwordFieldData.validationMessage}
                    onChange={(e) => onChangePassword(e.target.value)}
                />
            </Box>
            <Box
                mt={5}
                sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <TextField
                    id="password-confirmation-field"
                    fullWidth
                    type='password'
                    label="Confirmação"
                    variant="outlined"
                    size='small'
                    value={passwordConfirmationFieldData.data}
                    helperText={passwordConfirmationFieldData.validationMessage}
                    onChange={(e) => onChangePasswordConfirmation(e.target.value)}
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
                    onClick={handleSubmit}
                    disabled={passwordConfirmationFieldData.validationMessage !== null}
                >
                    Resetar senha
                </Button>
            </Box>
        </SignContentPane>
    )
}

export default PasswordReset;