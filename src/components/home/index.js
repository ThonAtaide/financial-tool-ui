import { React, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import ResponsiveAppBar from '../header/'
import { Box, Paper, Grid, Typography, Button, IconButton, Menu, MenuItem, Tooltip, Avatar, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { fetchUserExpenseGroups } from '../../utils/backend-client';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const HomePage = () => {

  const [expenseGroups, setExpenseGroups] = useState([]);
  const [anchorExpenseGroupOptions, setExpenseGroupOptions] = useState(null);
  const settings = [
    { text: 'Acessar', action: () => console.log('Visualização') },
    { text: 'Remover', action: () => console.log('remoção') }
  ]

  const navigate = useNavigate();

  const handleOpenExpenseGroupOptions = (event) => {
    setExpenseGroupOptions(event.currentTarget);
  };

  const handleCloseExpenseGroupOptions = (action) => {

    console.log('passando aqui')
    setExpenseGroupOptions(null);
  };

  useEffect(() => {
    fetchUserExpenseGroups()
      .then(response => {
        if (response.statusCode === 401) {
          localStorage.clear();
          navigate("/login");
        } else if (response.statusCode === 200) {
          setExpenseGroups(response.data.content);
        } else {
          console.log(response)
          console.log('Unespected response status');
        }
      })
  }, []);

  return (
    <Box>
      <ResponsiveAppBar />
      <Box
        padding={4}
        sx={{
          display: { xs: 'flex', md: 'block', justifyContent: 'center' }
        }}
      >
        <Typography
          variant='h5'
          sx={{
            fontFamily: 'var(--bs-font-sans-serif)',
            fontWeight: '600'
          }}
        >
          Meus grupos de despesa
        </Typography>
      </Box>
      <Grid
        container
        spacing={2}
        sx={{
          padding: '2rem'
        }}
      >
        {expenseGroups.map(item =>
          <Grid
            key={item.id}
            item
            xs={4} md={3}
          >
            <Paper
              elevation={6}
              sx={{backgroundColor: '#1976d2'}}
            >
              <Box
                sx={{
                  padding: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography
                  variant='h6'
                  sx={{
                    fontFamily: 'var(--bs-font-sans-serif)',
                    fontWeight: '500',
                    color: 'white'
                  }}
                >
                  {item.name}
                </Typography>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorExpenseGroupOptions}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorExpenseGroupOptions)}
                  onClose={handleCloseExpenseGroupOptions}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting.text} onClick={() => handleCloseExpenseGroupOptions(setting.action)}>
                      <Typography textAlign="center">{setting.text}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenExpenseGroupOptions} aria-label="settings">
                    <MoreVertIcon sx={{color: 'white'}}/>
                  </IconButton>
                </Tooltip>
              </Box> 
            </Paper>
          </Grid>
        )}
      </Grid>
      <Fab 
        color="primary" 
        aria-label="add" 
        // size='large'
        sx={{position: 'absolute', bottom:16, right: 16, height: '8rem', width:'8rem'}}>
        <AddIcon sx={{ height: '3rem', width:'3rem'}}/>          
      </Fab>
    </Box>
  );
}

export default HomePage;