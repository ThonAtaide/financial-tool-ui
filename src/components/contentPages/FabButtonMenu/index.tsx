import React from 'react';
import { Box, Color, Fab, FabPropsColorOverrides, PropTypes, SvgIconProps } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { OverridableStringUnion } from '@mui/types';

export interface FabButtonMenuI {
  options: CustomFabButtonI[]
}

export interface CustomFabButtonI {
  label: string,
  onClick?: undefined | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
  Icon: React.ElementType<SvgIconProps>,
  color: OverridableStringUnion<PropTypes.Color | 'success' | 'error' | 'info' | 'warning', FabPropsColorOverrides>
  show: boolean
}

const CustomFabButton: React.FC<CustomFabButtonI> = (dataToMount: CustomFabButtonI) => {
  const {
    Icon,
    onClick,
    color,
    show, 
    label
  } = dataToMount;

  const display = show? 'inline-flex': 'none'; 
  return (
    <Fab
      color={color}
      aria-label={label}
      onClick={onClick}
      sx={{  mr: {xs: '0.5rem', sm: '1rem'}, ml: {xs: '0.5rem', sm: '1rem'}, display: {display} }}
      size='large'
    >
      <Icon  />
    </Fab>
  )
}

const FabButtonMenu: React.FC<FabButtonMenuI> = (menuData: FabButtonMenuI) => {
  console.log(menuData)
  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{ position: 'fixed', bottom: '3em', width: '100%', zIndex: 10000 }}
    >
      {menuData && menuData.options.map(item => <CustomFabButton {...item} />)}
    </Box>
  )
}

export default FabButtonMenu;