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
import { logout } from '../../utils/backend-client/authentication';
import { Alert } from '@mui/material';
import { useApiRequestSimple } from '../hook/api-request-simple';
import { useGlobalLoading } from '../loading/global-loading/provider';
import { useAuthData } from '../auth-provider';


function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [alertData, setAlertData] = useState({ show: false, type: null, message: null });
  const { statelessRequestApi: logoutRequest } = useApiRequestSimple({apiRequest: logout});
  const { startLoading, finishLoading } = useGlobalLoading();
  const { userData, clearUserData } = useAuthData();

  const navigate = useNavigate();

  const logoutUser = async () => {
    startLoading();
    logoutRequest()
      .then(res => {
        clearUserData();
        navigate('/login')
      })
      .catch(err => {})
      .finally(()=> finishLoading());   
  }

  const pages = ['Grupos', 'Contas', 'Despesas'];
  const settings = [
    { text: 'Sair', action: () => logoutUser() }
  ];

  useEffect(() => {
    if (!useAuthData) {
      logoutUser();
    }
    // const current_user_name = useAuthData;
    // if (current_user_name) {
    //   setLoggedUserName(current_user_name.split(" ")[0]);
    // } else {
    //   logoutUser();
    // }
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

  const onClickSettingsMenu = (action) => {
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
            
          </Box>
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
              {userData && userData.nickname.split(" ")[0]}
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
              onClose={() => setAnchorElUser(null)}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.text} onClick={() => onClickSettingsMenu(setting.action)}>
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