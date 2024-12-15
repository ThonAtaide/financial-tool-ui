import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { SvgIconProps } from '@mui/material';
import { useApiRequestStatelessHook } from '../hook/api-request-simple';
import { GlobalLoadingContextType, useGlobalLoading } from '../loading/global-loading/provider';
import { AuthenticatedUserDataContextType, useAuthData } from '../auth-provider';
import { logout, refresh_user_data } from '../../integration/fin-tool-api/authentication';

export interface ChildrenDataI {
  selectedSheetId?: number | null
  children?: React.ReactNode | null
}

const ResponsiveAppBar: React.FC<ChildrenDataI> = (data: ChildrenDataI) => {

  const [anchorElUser, setAnchorElUser] = useState<HTMLButtonElement | null>(null);
  const { executeStatelessRequest: logoutRequest } = useApiRequestStatelessHook({ apiRequest: logout });
  const { executeStatelessRequest: refreshRequest } = useApiRequestStatelessHook({ apiRequest: refresh_user_data });
  const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;
  const { userData, clearAuthenticatedUserData, setAuthenticatedUserData } = useAuthData() as AuthenticatedUserDataContextType;

  const navigate = useNavigate();

  const logoutUser = () => {
    startLoading();
    const execute = () => logoutRequest(null)
      .then(res => {
        clearAuthenticatedUserData();
        navigate('/sign-in')
      })
      .catch(err => console.log(err))
      .finally(() => finishLoading());
      execute();
  }

  const settings = [
    { text: 'Sair', action: () => logoutUser() },
  ];

  useEffect(() => {
    if (!userData) {
      console.log('aqui')
      startLoading();
      const refresh = () => refreshRequest(null)
        .then(data => setAuthenticatedUserData({ name: data.nickname }))
        .catch(err => console.log(err))
        .finally(() => finishLoading());
      refresh();
    }
  }, [])


  const handleOpenSettingsMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseSettingsMenu = () => {
    setAnchorElUser(null);
  };

  const onClickSettingsMenu = (action: () => void) => {
    action();
    handleCloseSettingsMenu();
  };



  const buildIconButton = (
    title: string,
    Icon: React.ElementType<SvgIconProps>,
    path: string,
  ) => {
    return (
      <Link to={path}>
        <Tooltip title={title}>
          <IconButton>
            <Icon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Link>
    )
  }

  return (
    <Box>
      <AppBar position="static" sx={{ top: 'auto' }} color="primary">
        <Container >
          <Toolbar disableGutters sx={{ justifyContent: 'center' }}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              KATHON
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      {data.children}
      <AppBar position="fixed" sx={{ top: 'auto', bottom: 0 }} color="primary">
        <Container >
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {buildIconButton("Home", HomeIcon, "/")}
            {data.selectedSheetId && buildIconButton("Gráficos", BarChartIcon, `sheet/${data.selectedSheetId}/graficos`)}
            {data.selectedSheetId && buildIconButton("Extrato", ReceiptIcon, `sheet/${data.selectedSheetId}/despesas`)}

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Configurações">
                <IconButton
                  onClick={handleOpenSettingsMenu}
                >
                  <SettingsSuggestIcon fontSize="large" />
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
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseSettingsMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.text}
                    onClick={() => onClickSettingsMenu(setting.action)}
                  >
                    <Typography textAlign="center">{setting.text}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
export default ResponsiveAppBar;