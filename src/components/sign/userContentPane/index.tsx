import { Box, CardMedia, Typography, Grid2 } from '@mui/material';
import React from 'react';
import logo from '../../../resources/lotus.webp';

export interface ContentPaneI {
    children: React.ReactNode,
    title: string
}

const SignContentPane: React.FC<ContentPaneI> = (contentPane: ContentPaneI) => {
    return (
        <Grid2
            size={{ xs: 12, md: 6 }}
        >
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
                    {contentPane.title}
                </Typography>
            </Box>
            {contentPane.children}
        </Grid2>
    );
}

export default SignContentPane;