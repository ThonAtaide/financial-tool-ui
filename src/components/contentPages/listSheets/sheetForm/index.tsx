import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useApiRequestStatelessHook } from '../../../hook/api-request-simple';
import { GlobalLoadingContextType, useGlobalLoading } from '../../../loading/global-loading/provider';
import { create_sheet, fetch_sheet_by_id, update_sheet } from '../../../../integration/fin-tool-api/sheets';

export interface SheetDataI {
    sheetId?: number | null,
    handleClose: () => void
    open: boolean
}

const SheetForm: React.FC<SheetDataI> = (sheetData: SheetDataI) => {

    const [name, setName] = useState<string>('');
    const { executeStatelessRequest: create_new_sheet } = useApiRequestStatelessHook({ apiRequest: create_sheet });
    const { executeStatelessRequest: update_existent_sheet } = useApiRequestStatelessHook({ apiRequest: update_sheet });
    const { executeStatelessRequest: retrieve_sheet } = useApiRequestStatelessHook({ apiRequest: fetch_sheet_by_id });
    const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;

    useEffect(() => {
        if (sheetData.sheetId) {
            const findSheet = () => {
                startLoading();
                retrieve_sheet({sheetId: sheetData.sheetId!!})
                .then(res => setName(res.name))
                .catch(err => console.log(err))
                .finally(()=> finishLoading())
            } 
            findSheet();
        }
    }, [sheetData.sheetId])

    return (
        <Dialog
            open={sheetData.open}
            onClose={sheetData.handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    if (sheetData.sheetId) {                        
                        startLoading();
                        update_existent_sheet({id: sheetData.sheetId, name })
                            .then(res => sheetData.handleClose())
                            .catch(err => console.log('error'))
                            .finally(() => {
                                finishLoading();
                            })
                    } else {
                        startLoading();
                        create_new_sheet({ name })
                            .then(res => sheetData.handleClose())
                            .catch(err => console.log('error'))
                            .finally(() => {
                                finishLoading();
                            })
                    }
                    
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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