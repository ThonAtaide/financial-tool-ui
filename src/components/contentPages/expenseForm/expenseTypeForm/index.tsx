import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useApiRequestStatelessHook } from '../../../hook/api-request-simple';
import { createExpenseType, deleteExpenseType, fetchExpenseTypeById, updateExpenseType } from '../../../../integration/fin-tool-api/expenseCategories';
import { GlobalLoadingContextType, useGlobalLoading } from '../../../loading/global-loading/provider';
import { TextFieldData } from '../adapter';

export interface ExpenseTypeFormParams {
    sheetId: number,
    categoryId: number,
    subCategoryId: number | null,
    isOpen: boolean,
    handleClose: () => void
}

export enum ExpenseTypeFormActionEnum {
    CREATE,
    EDIT,
}

const ExpenseTypeFormDialog: React.FC<ExpenseTypeFormParams> = (params: ExpenseTypeFormParams) => {

    const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;
    const { executeStatelessRequest: getById } = useApiRequestStatelessHook({ apiRequest: fetchExpenseTypeById });
    const { executeStatelessRequest: create } = useApiRequestStatelessHook({ apiRequest: createExpenseType });
    const { executeStatelessRequest: update } = useApiRequestStatelessHook({ apiRequest: updateExpenseType });
    
    const [subCategoryName, setSubCategoryName] = useState<TextFieldData<string>>({ value: '', helperText: null });

    const {
        sheetId,
        categoryId,
        subCategoryId,
        isOpen,
        handleClose
    } = params;

    useEffect(() => {
        if (subCategoryId) {
            fetchById();
        }
    }, []);
    const fetchById = () => {
        getById({ sheetId, expenseTypeId: subCategoryId! })
            .then(res => setSubCategoryName({ value: res.name, helperText: null }))
            .catch(err => console.log(err))
            .finally(() => finishLoading());
    }    

    const createItem = () => {
        startLoading();
        create({ sheetId, categoryId: categoryId, name: subCategoryName.value })
            .then(res => handleClose())
            .catch(err => console.log(err))
            .finally(() => finishLoading());
    }

    const updateItem = () => {
        if (subCategoryId) {
            startLoading();
            update({ sheetId, categoryId: categoryId, name: subCategoryName.value, expenseTypeId: subCategoryId! })
                .then(res => handleClose())
                .catch(err => console.log(err))
                .finally(() => finishLoading());
        }
    }

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    if (subCategoryName.value.length < 2) {
                        setSubCategoryName({ ...subCategoryName, helperText: 'O nome deve conter ao menos 2 caracteres' });
                        return;
                    }

                    if (subCategoryName.value.length > 20) {
                        setSubCategoryName({ ...subCategoryName, helperText: 'O nome deve conter no máximo 20 caracteres' });
                        return;
                    }
                    if (subCategoryId) {
                        updateItem();
                    } else {
                        createItem();
                    }
                },
            }}
        >
            <DialogTitle>
                {subCategoryId === null ? 'Criar Sub Categoria' : 'Editar Sub Categoria'}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="expense-type"
                    label="Nome"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setSubCategoryName({ value: e.target.value, helperText: null })}
                    value={subCategoryName.value}
                    helperText={subCategoryName.helperText}
                />
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='info' type="submit">Salvar</Button>
                <Button variant='contained' color='info' onClick={handleClose}>Fechar</Button>
            </DialogActions>
        </Dialog>)
}

export default ExpenseTypeFormDialog;