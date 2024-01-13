import { React, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { USER_NAME_LOCAL_STORAGE } from '../../constants';
import { logout } from '../../utils/backend-client/authentication';
import { Alert } from '@mui/material';


function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [logged_user_name, setLoggedUserName] = useState(null);
  const [alertData, setAlertData] = useState({ show: false, type: null, message: null });

  const navigate = useNavigate();

  const logoutUser = async () => {
    console.log("chmando logout")
    try {
      await logout({});
      localStorage.clear();
      navigate("/login")
    } catch (err) {
      showAlert({type: 'error', message: err.errors[0]});
      localStorage.clear();
      navigate("/login");
    }
  }

  const pages = ['Grupos', 'Contas', 'Despesas'];
  const settings = [
    { text: 'Perfil', action: async () => logoutUser() },
    { text: 'Sair', action: async () => logoutUser() }
  ];

  useEffect(() => {
    const current_user_name = localStorage.getItem(USER_NAME_LOCAL_STORAGE);
    if (current_user_name) {
      setLoggedUserName(current_user_name.split(" ")[0]);
    } else {
      logoutUser();
    }
  }, [])

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (action) => {
    console.log("Menu foi chamado ")
    console.log(action)
    action();
    setAnchorElUser(null);
  };

  const showAlert = ({ type, message }) => {
    setAlertData({ show: true, type, message });
    setTimeout(() => {
      hideAlert()
    }, 3000)    
  }

  const hideAlert = () => {
    setAlertData({ show: false, type: null, message: null });
  }

  return (
    <AppBar position="static">
      <Container maxWidth>
        {alertData.show && <Box
          maxWidth
          sx={{
            position: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            top: 0,
            width: '100%'
          }}
        >
          <Alert
            severity={alertData.type}
            onClose={() => hideAlert()}
          >
            {alertData.message}
          </Alert>
        </Box>}
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            KATHON
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            KATHON
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                textAlign: 'end',
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {logged_user_name}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.text} onClick={() => handleCloseUserMenu(setting.action)}>
                  <Typography textAlign="center">{setting.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;