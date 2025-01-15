import React, { ReactNode, useState } from 'react';
import { ErrorResponse } from '../../integration/fin-tool-api/responses';
import { Box, Typography } from '@mui/material';

export interface ErrorPageParamsI {
    error: ErrorResponse | Error
}

const ErrorPage: React.FC<ErrorPageParamsI> = (params: ErrorPageParamsI) => {

    const getErrorMessage = () => {
        if ('errorMessage' in params.error) {
            return (params as unknown as ErrorResponse).errorMessage;
        }
        return 'Houve um erro inexperado.';
    }
    return (
        <Box>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <Typography
                variant='h4'
            >
                {getErrorMessage()}
            </Typography>
        </Box>

    );
}

export default ErrorPage;