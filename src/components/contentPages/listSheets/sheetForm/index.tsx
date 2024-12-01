import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';
import React from 'react';

export interface SheetDataI {
    sheetId?: number,
    handleClose: () => void
    open: boolean
}


const SheetForm: React.FC<SheetDataI> = (sheetData: SheetDataI) => {
    return (
        <Dialog
            open={sheetData.open}
            onClose={sheetData.handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());
                    const email = formJson.email;
                    console.log(email);
                    sheetData.handleClose();
                },
            }}
        >
            <DialogTitle textAlign="center">Criar Planilha</DialogTitle>
            <DialogContent>               
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="name"
                    label="Nome da planilha"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={sheetData.handleClose}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SheetForm;