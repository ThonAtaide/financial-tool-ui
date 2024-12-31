import React, { useState, useEffect } from 'react';
import { Box, Button, InputLabel, MenuItem, Select, TextField, Typography, FormControl, FormControlLabel, Switch, FormHelperText, Backdrop, CircularProgress, Grid2, ListSubheader, Popper } from '@mui/material';
import dayjs from 'dayjs';
import { useApiRequestStatelessHook } from '../../hook/api-request-simple';
import { createUserExpense, getExpenseById, updateExpense } from '../../../integration/fin-tool-api/expenses';
import { retrieveExpenseCategoriesBy } from '../../../integration/fin-tool-api/expenseCategories';
import { ExpenseCategoryDomain, ExpenseTypeDomain } from '../../../domain/expenseType';
import { ExpenseDomain } from '../../../domain/expense';
import { NumericFormat } from 'react-number-format';
import { ExpenseFormDataParamsI, UseExpenseFormAdapter } from './adapter';
import { JSX } from 'react/jsx-runtime';
import { DateField, DatePicker } from '@mui/x-date-pickers';
import zIndex from '@mui/material/styles/zIndex';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '32em',
  maxWidth: '80%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.default',
  borderRadius: 2,
  p: 4
};

function NumberFormatCustom(props: { [x: string]: any; name?: any; inputRef?: any; onChange?: any; }) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      decimalSeparator='.'
      prefix='R$ '
      thousandSeparator
      decimalScale={2}
    />
  );
}

const ExpenseForm: React.FC<ExpenseFormDataParamsI> = (expenseFormDataParams: ExpenseFormDataParamsI) => {

  const {
    descriptionField,
    setDescriptionField,
    amountField,
    setAmountField,
    selectedExpenseTypeField,
    setSelectedExpenseTypeField,
    purchaseDateField,
    setPurchaseDateField,
    isFixedField,
    setIsFixedField,
    expenseCategories,
    loadExpenseCategories,
    fetchExpenseById,
    handleSubmit
  } = UseExpenseFormAdapter(expenseFormDataParams);


  useEffect(() => {
    loadExpenseCategories();
    fetchExpenseById();
  }, []);

  const renderExpenseTypeOptions = () => {
    const options: JSX.Element[] = []
    expenseCategories.forEach(category => {
      options.push(<ListSubheader key={category.id} >{category.name}</ListSubheader>)
      category.expenseTypes.forEach(expenseType =>
        options.push(
          <MenuItem key={expenseType.id} value={expenseType.id}>
            {expenseType.name}
          </MenuItem>
        ))
    })
    return options;
  }


  return (
    <Box sx={style}>
      <Typography
        id="modal-modal-title"
        variant="h5"
        component="h2"
        sx={{
          fontFamily: 'var(--bs-font-sans-serif)',
          color: 'white',
          fontWeight: '500'
        }}
        textAlign='center'
      >
        Despesa
      </Typography>
      <form autoComplete='off' onSubmit={handleSubmit}>
        <Box
          pb={2}
        >
          <TextField
            color='info'
            id="group-name-field"
            fullWidth
            value={descriptionField.value}
            onChange={(e) => setDescriptionField({ value: e.target.value, helperText: null })}
            helperText={descriptionField.helperText}
            label="Descrição da despesa"
            variant="standard"
            size='small'
            slotProps={{ inputLabel: { shrink: descriptionField.value && descriptionField.value !== '' ? true : false } }}
          />
        </Box>
        <Grid2
          container
          spacing={2}
          pb={2}
        >
          <Grid2
            size={{ xs: 6 }}
          >
            <TextField
              id="amount-name-field"
              fullWidth
              value={amountField.value && parseFloat(amountField.value).toFixed(2) || 0.00}
              label="Valor"
              helperText={amountField.helperText}
              variant="standard"
              size='small'
              onChange={(e) => setAmountField({ value: e.target.value, helperText: null })}
              slotProps={{
                input: {
                  inputComponent: NumberFormatCustom
                }
              }}

            />
          </Grid2>
          <Grid2
            size={{ xs: 6 }}
            sx={{ display: 'flex', alignSelf: 'flex-end' }}
          >
            <DatePicker
              value={purchaseDateField}
              label="Data da despesa"
              format="DD/MM/YYYY"
              onChange={(e) => setPurchaseDateField(e!!)}
              slotProps={{
                textField: { size: 'small', variant: 'standard' }, 
                popper: {
                  sx: { zIndex: '10001' }
                },
              }}

            />
          </Grid2>
        </Grid2>
        <Grid2
          container
          spacing={2}
          pt={0}
        >
          <Grid2
            size={{ xs: 6 }}
          >
            <FormControl variant="standard" sx={{ m: 1, minWidth: 130, margin: 0, padding: 0 }}>
              <InputLabel id="demo-simple-select-standard-label">Categoria</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedExpenseTypeField.value}
                onChange={(e) => setSelectedExpenseTypeField({ value: e.target.value as number, helperText: null })}
                label="Categoria"
              >
                <MenuItem value={99999}>
                  <em>Selecionar</em>
                </MenuItem>
                {renderExpenseTypeOptions()}
              </Select>
              {selectedExpenseTypeField.helperText
                && <FormHelperText>{selectedExpenseTypeField.helperText}</FormHelperText>
              }
            </FormControl>
          </Grid2>
          <Grid2
            size={{ xs: 6 }}
            sx={{ display: 'flex', justifyItems: 'end', padding: 0 }}
          >
            <FormControlLabel
              sx={{ color: 'white' }}
              control={<Switch
                checked={isFixedField}
                onChange={(e) => setIsFixedField(e.target.checked)}
              />} label="Despesa Fixa"
            />
          </Grid2>
        </Grid2>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            variant='contained'
            type='submit'
            color='info'
          >
            Salvar
          </Button>
          <Button
            onClick={() => expenseFormDataParams.closeForm(false)}
            color='info'
            variant='contained'
            sx={{ marginLeft: '1rem' }}>
            Fechar
          </Button>
        </Box>
      </form>
    </Box>

  );
}
export default ExpenseForm;
