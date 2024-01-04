import { React, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { deleteExpenseGroup } from '../../../utils/backend-client';

const ExpenseGroupCard = ({expenseGroup, openExpenseGroupEditModal, refreshExpenseGroupHome}) => {

  const [anchorExpenseGroupOptions, setExpenseGroupOptions] = useState(null);
  const navigate = useNavigate();
  const removeExpenseGroup = () => {
    deleteExpenseGroup(expenseGroup.id)
      .finally(res => navigate(0));
  }

  const settings = [
    { text: 'Editar', action: () => openExpenseGroupEditModal(expenseGroup) },
    { text: 'Acessar', action: () => navigate(`/dashboard/${expenseGroup.id}`) },
    { text: 'Remover', action: () => removeExpenseGroup() }
  ]

  const handleOpenExpenseGroupOptions = (event) => {
    setExpenseGroupOptions(event.currentTarget);
  };

  const handleCloseExpenseGroupOptions = (action) => {
    action();
    setExpenseGroupOptions(null);
  };

  return (
    <Paper
      elevation={6}
      sx={{ backgroundColor: '#1976d2', cursor: 'pointer' }}
      
      onClick={() => navigate(`/dashboard/${expenseGroup.id}`)}
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
          {expenseGroup.name}
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
            <MoreVertIcon sx={{ color: 'white' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );

}

export default ExpenseGroupCard;
