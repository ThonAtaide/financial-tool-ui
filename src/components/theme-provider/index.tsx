import React from 'react'
import { createTheme, GlobalStyles, ThemeProvider } from '@mui/material'

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
      background: {
        default: '#25292E',
      },  
    },
  });


export const DarkThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {  

  return (
    <ThemeProvider theme={darkTheme}>
        <GlobalStyles
          styles={{
            body: { backgroundColor: "#25292E" },
          }}
        />
      {children}
    </ThemeProvider>
  )
}
