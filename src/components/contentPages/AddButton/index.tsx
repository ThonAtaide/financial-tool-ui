import React from 'react';
import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export interface AddButtonI {
    onClick?: undefined | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
}

const AddButton: React.FC<AddButtonI> = (addButtonProperties: AddButtonI) => {
    return (
        <Box display="flex" justifyContent="center">
        <Fab
          color="primary"
          aria-label="add"
          onClick={addButtonProperties.onClick}
          sx={{ position: 'fixed', bottom: '2em', height: '5em', width: '5em', zIndex: 10000 }}
        >
          <AddIcon sx={{ height: '3rem', width: '3rem' }} />
        </Fab>
      </Box>
    )
}

export default AddButton;